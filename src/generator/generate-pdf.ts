import puppeteer from 'puppeteer';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {createHash} from 'crypto';
import {getSortedUrlSearchParams} from "../lib/params.ts";

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
    filename: string;
    preview: string;
    params: any;
    labels: any;
    hash?: string;
}

async function loadConfigGenerator(moduleName: string): Promise<Generator> {
    // Resolve the path relative to the project root
    const configGenerationPath = resolve(PROJECT_ROOT, 'src', 'worksheets', moduleName, 'generator.ts');
    try {
        // Use a file URL for dynamic import to ensure it's treated as a module path
        const { default: generator } = await import('file:///' + configGenerationPath.replace(/\\/g, '/'));
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
        const {params} = perm; // Extract labels here
        const name = generator.generateName(params);
        const labels  = generator.generateLabels(params);
        expandedConfigs.push({
            filename: `${moduleName}_${name}.pdf`,
            preview: `${moduleName}_${name}.png`,
            params: params,
            labels: labels
        });
    }
    return expandedConfigs;
}

async function generatePdfs() {
    const args = process.argv.slice(2);
    const moduleName = args[0];
    const isDryRun = args.includes('--dry');

    if (!moduleName) {
        console.error('Please provide a module name as an argument.');
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
        mkdirSync(moduleOutputDir, { recursive: true });
    }

    for (const config of configurations) {
        const url = getWorksheetUrl(moduleName, config.params);
        let hashSum = createHash('sha256');
        if (isDryRun) {
            console.log(`Dry run: ${url}`);
        } else {
            console.log(`Navigating to ${url}`);
            await page.goto(url, {waitUntil: 'networkidle0'});

            console.log(`Generating PDF for: ${config.filename}`);
            const pdfPath = resolve(moduleOutputDir, config.filename);
            await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true
            });
            console.log(`PDF generated at: ${pdfPath}`);

            // Generate web-optimized PNG preview
            const pngFilename = config.filename.replace(/\.pdf$/, '.png');
            const pngPath = resolve(moduleOutputDir, pngFilename);
            console.log(`Generating PNG preview for: ${pngFilename}`);

            const worksheetElement = await page.$('#worksheet'); // Find the element by ID
            if (worksheetElement) {
                await worksheetElement.screenshot({ // Take screenshot of the element
                    path: pngPath,
                    type: 'png',
                });
                console.log(`PNG preview generated at: ${pngPath}`);
            } else {
                console.warn(`Warning: Element with id="worksheet" not found for ${config.filename}. Skipping PNG preview.`);
            }

            // Calculate SHA256 hash
            const fileBuffer = readFileSync(pdfPath);
            const hashSum = createHash('sha256');
            hashSum.update(fileBuffer);
        }
        // Add hash to the configuration object
        config.hash = hashSum.digest('hex');
    }

    await browser.close();
    console.log('Browser closed. All PDFs generated.');

    // --- METADATA GENERATION ---
    console.log('Generating meta file...');
    const creationTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const metaForJson = configurations.map(c => {
        const urlPath = getRelativeWorksheetUrl(moduleName, c.params);
        return {
            hash: c.hash,
            filename: c.filename,
            preview: c.preview,
            source: urlPath,
            created: creationTimestamp,
            labels: c.labels,
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

