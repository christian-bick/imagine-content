import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const TEMP_DIR = resolve(PROJECT_ROOT, 'temp');
const BASE_URL = 'http://localhost:5173';

async function loadConfig(moduleName) {
    const configPath = `../worksheets/${moduleName}/generation.js`;
    try {
        const { config } = await import(configPath);
        return config;
    } catch (error) {
        console.error(`Failed to load configuration for module: ${moduleName}`);
        console.error(error);
        process.exit(1);
    }
}

function getWorksheetUrl(moduleName, params) {
    const urlParams = new URLSearchParams(params);
    return `${BASE_URL}/worksheets/${moduleName}/worksheet.html?${urlParams.toString()}`;
}

export function getConfigurations(moduleName, config) {
    const combinations = [];
    const permutations = config.generatePermutations();
    for (const perm of permutations) {
        const { count, ...params } = perm;
        const name = config.generateName(params);
        for (let i = 1; i <= count; i++) {
            combinations.push({
                params: params,
                filename: `${moduleName}_${name}_v${i}.pdf`
            });
        }
    }
    return combinations;
}

async function generatePdfs() {
    const args = process.argv.slice(2);
    const moduleName = args[0];

    if (!moduleName) {
        console.error('Please provide a module name as an argument.');
        process.exit(1);
    }

    console.log(`Generating PDFs for module: ${moduleName}`);

    const config = await loadConfig(moduleName);
    const configurations = getConfigurations(moduleName, config);

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Ensure the temp directory exists
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR);
    }

    for (const config of configurations) {
        const url = getWorksheetUrl(moduleName, config.params);
        console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0' });

        console.log(`Generating PDF for: ${config.filename}`);
        const pdfPath = resolve(TEMP_DIR, config.filename);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF generated at: ${pdfPath}`);
    }

    await browser.close();
    console.log('Browser closed. All PDFs generated.');
}

generatePdfs().catch(error => {
    console.error('Error generating PDFs:', error);
    process.exit(1);
});

