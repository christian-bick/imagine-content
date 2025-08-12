import puppeteer from 'puppeteer';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {createHash} from 'crypto';
import {Buffer} from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const TEMP_DIR = resolve(PROJECT_ROOT, 'temp');
const BASE_URL = 'http://localhost:5173';

async function loadConfigGenerator(moduleName) {
    const configGenerationPath = `../worksheets/${moduleName}/generator.js`;
    try {
        const { default: generator } = await import(configGenerationPath);
        return generator
    } catch (error) {
        console.error(`Failed to load configuration for module: ${moduleName}`);
        console.error(error);
        process.exit(1);
    }
}

function getRelativeWorksheetUrl(moduleName, params) {
    const urlParams = new URLSearchParams(params);
    return `/worksheets/${moduleName}/worksheet.html?${urlParams.toString()}`; // No /src/... needed because of vite
}

function getWorksheetUrl(moduleName, params) {
    return `${BASE_URL}${getRelativeWorksheetUrl(moduleName, params)}`;
}

export function generateConfigs(moduleName, generator) {
    const expandedConfigs = [];
    const permutations = generator.generatePermutations();
    for (const perm of permutations) {
        const {params} = perm; // Extract labels here
        const name = generator.generateName(params);
        const labels  = generator.generateLabels(params);
        expandedConfigs.push({
            filename: `${moduleName}_${name}.pdf`,
            params: params,
            labels: labels
        });
    }
    return expandedConfigs;
}

async function generatePdfs() {
    const args = process.argv.slice(2);
    const moduleName = args[0];

    if (!moduleName) {
        console.error('Please provide a module name as an argument.');
        process.exit(1);
    }

    console.log(`Generating PDFs for module: ${moduleName}`);

    const configGenerator = await loadConfigGenerator(moduleName);
    const configurations = generateConfigs(moduleName, configGenerator);

    const isDryRun = args.includes('--dry');
    if (isDryRun) {
        console.log('Dry run: Configurations would be:');
        console.log(configurations);
        return;
    }

    console.log('Launching browser...');
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    // Ensure the temp directory exists
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR);
    }

    for (const config of configurations) {
        const url = getWorksheetUrl(moduleName, config.params);
        console.log(`Navigating to ${url}`);
        await page.goto(url, {waitUntil: 'networkidle0'});

        console.log(`Generating PDF for: ${config.filename}`);
        const pdfPath = resolve(TEMP_DIR, config.filename);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF generated at: ${pdfPath}`);

        // Calculate SHA256 hash
        const fileBuffer = readFileSync(pdfPath);
        const hashSum = createHash('sha256');
        hashSum.update(fileBuffer);
        // Add hash to the configuration object
        config.id = hashSum.digest('hex');
    }

    await browser.close();
    console.log('Browser closed. All PDFs generated.');

    // --- METADATA GENERATION ---
    console.log('Generating meta file...');
    const metaForJson = configurations.map(c => {
        const urlPath = getRelativeWorksheetUrl(moduleName, c.params);
        const encodedUrlPath = Buffer.from(urlPath).toString('base64');
        return {
            id: c.id,
            filename: c.filename,
            source: encodedUrlPath,
            labels: c.labels
        };
    });

    const metaPath = resolve(TEMP_DIR, `meta_${moduleName}.json`);
    writeFileSync(metaPath, JSON.stringify(metaForJson, null, 2));
    console.log(`Meta file generated at: ${metaPath}`);
}

generatePdfs().catch(error => {
    console.error('Error generating PDFs:', error);
    process.exit(1);
});

