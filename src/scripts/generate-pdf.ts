import puppeteer, {Page, ElementHandle} from 'puppeteer';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {createHash} from 'crypto';
import {getSortedUrlSearchParams} from "../lib/params.ts";
import {execSync} from "child_process"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const OUT_DIR = resolve(PROJECT_ROOT, 'out');
const BASE_URL = 'http://localhost:5173';

interface Generator {
    generatePermutations: () => { params: any }[];
    generateName: (params: any) => string;
    generateLabels: (params: any) => any;
}

interface Config {
    questionDoc: string;
    answerDoc?: string; // Optional, as it might not exist
    questionImage: string;
    answerImage?: string; // Optional
    params: any;
    labels: any;
    hash?: string; // This hash will be for the questionDoc
}

async function loadConfigGenerator(moduleName: string): Promise<Generator> {
    // Resolve the path relative to the project root
    const configGenerationPath = resolve(PROJECT_ROOT, 'src', 'worksheets', moduleName, 'generator.ts');
    try {
        // Use a file URL for dynamic import to ensure it's treated as a module path
        const {default: generator} = await import('file:///' + configGenerationPath.replace(/\\/g, '/'));
        return generator
    } catch (error) {
        console.error(`Failed to load configuration for module: ${moduleName}`);
        console.error(error);
        process.exit(1);
    }
}

function getRelativeWorksheetUrl(moduleName: string, params: any): string {
    const urlParams = new URLSearchParams(params);

    // No /src/... needed in path because of vite
    // We sort the url params to identify identical generation calls
    return `/worksheets/${moduleName}/worksheet.html?${getSortedUrlSearchParams(urlParams)}`;
}

function getWorksheetUrl(moduleName: string, params: any): string {
    return `${BASE_URL}${getRelativeWorksheetUrl(moduleName, params)}`;
}

export function generateConfigs(moduleName: string, generator: Generator): Config[] {
    const expandedConfigs: Config[] = [];
    const permutations = generator.generatePermutations();
    for (const perm of permutations) {
        const {params} = perm;
        const name = generator.generateName(params);
        const labels = generator.generateLabels(params);
        expandedConfigs.push({
            questionDoc: `${moduleName}_${name}_question.pdf`,
            answerDoc: `${moduleName}_${name}_answer.pdf`,
            questionImage: `${moduleName}_${name}_question.png`,
            answerImage: `${moduleName}_${name}_answer.png`,
            params: params,
            labels: labels
        });
    }
    return expandedConfigs;
}

// Helper function to generate PDF and PNG for a given page element
async function generatePagePdfAndPng(
    page: Page,
    element: ElementHandle,
    pdfPath: string,
    imagePath: string,
    logPrefix: string
) {
    console.log(`Generating ${logPrefix} PDF for: ${pdfPath}`);
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    });
    console.log(`${logPrefix} PDF generated at: ${pdfPath}`);

    console.log(`Generating ${logPrefix} PNG preview for: ${imagePath}`);
    await element.screenshot({
        path: imagePath,
        type: 'png',
    });
    console.log(`${logPrefix} PNG preview generated at: ${imagePath}`);
}

// Helper function to toggle page visibility
async function togglePageVisibility(page: Page, selector: string, display: string) {
    await page.evaluate((sel, disp) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) el.style.display = disp;
    }, selector, display);
}

// Function to process a single configuration
async function processConfiguration(
    config: Config,
    moduleName: string,
    moduleOutputDir: string,
    page: Page
) {
    const url = getWorksheetUrl(moduleName, config.params);
    const hashSum = createHash('sha256');

    console.log(`Navigating to ${url}`);
    await page.goto(url, {waitUntil: 'networkidle0'});

    // Generate hash from the full DOM content before manipulating visibility

    // This will reflect CSS changes as well as long as we use vite's default css bundling as it
    // generates a has as part of the css name.
    // All changes to the Javascript logic including permutations is already reflected in the dom
    // as we are only using JS to generate static content and not for interactions here.

    const fullHtml = await page.content();
    hashSum.update(fullHtml);
    config.hash = hashSum.digest('hex');

    const pageElements = await page.$$('.page');

    if (pageElements.length === 0) {
        console.warn(`Warning: No .page elements found for ${url}. Skipping PDF and PNG generation.`);
        return;
    }

    const questionPageElement = pageElements[0];
    const answerPageElement = pageElements.length > 1 ? pageElements[1] : undefined;

    // --- Generate Question PDF and PNG ---
    if (answerPageElement) {
        await togglePageVisibility(page, '.page:nth-of-type(2)', 'none');
    }
    await generatePagePdfAndPng(
        page,
        questionPageElement,
        resolve(moduleOutputDir, config.questionDoc),
        resolve(moduleOutputDir, config.questionImage),
        'Question'
    );
    if (answerPageElement) {
        await togglePageVisibility(page, '.page:nth-of-type(2)', '');
    }

    // --- Generate Answer PDF and PNG (if answer page exists) ---
    if (answerPageElement) {
        await togglePageVisibility(page, '.page:nth-of-type(1)', 'none');
        await generatePagePdfAndPng(
            page,
            answerPageElement,
            resolve(moduleOutputDir, config.answerDoc!),
            resolve(moduleOutputDir, config.answerImage!),
            'Answer'
        );
        await togglePageVisibility(page, '.page:nth-of-type(1)', '');
    } else {
        console.log(`No second .page element found for ${url}. Skipping answer key PDF and PNG.`);
        delete config.answerDoc;
        delete config.answerImage;
    }
}

async function generatePdfs() {
    const args = process.argv.slice(2);
    const moduleName = args.find(arg => !arg.startsWith('--'));
    const isDryRun = args.includes('--dry');

    if (!moduleName) {
        console.error('Please provide a module name as parameter');
        process.exit(1);
    }

    console.log(`Generating PDFs for module: ${moduleName}`);

    const configGenerator = await loadConfigGenerator(moduleName);
    const configurations: Config[] = generateConfigs(moduleName, configGenerator);

    console.log('Launching browser...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    const moduleOutputDir = resolve(OUT_DIR, moduleName);

    // Ensure the module-specific output directory exists
    if (!existsSync(moduleOutputDir)) {
        mkdirSync(moduleOutputDir, {recursive: true});
    }

    for (const config of configurations) {
        if (isDryRun) {
            const url = getWorksheetUrl(moduleName, config.params);
            console.log(`Dry run: ${url}`);
        } else {
            await processConfiguration(config, moduleName, moduleOutputDir, page);
        }
    }

    await browser.close();
    console.log('Browser closed. All PDFs generated.');

    // --- METADATA GENERATION ---
    console.log('Generating meta file...');
    const versionHash = execSync('git rev-parse HEAD').toString().trim();
    const creationTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const metaForJson = configurations.map(c => {
        const urlPath = getRelativeWorksheetUrl(moduleName, c.params);
        return {
            contentHash: c.hash,
            questionDoc: c.questionDoc,
            answerDoc: c.answerDoc, // Will be undefined if not generated
            questionImage: c.questionImage,
            answerImage: c.answerImage, // Will be undefined if not generated
            source: urlPath, // For random generations this can be used to generate more of the same worksheet
            created: creationTimestamp,
            labels: c.labels,
            versionHash: versionHash,
        };
    });

    const metaPath = resolve(moduleOutputDir, `meta.json`);
    writeFileSync(metaPath, JSON.stringify(metaForJson, null, 2));
    console.log(`Meta file generated at: ${metaPath}`);
}

generatePdfs().catch(error => {
    console.error('Error generating PDFs:', error);
    process.exit(1);
});
