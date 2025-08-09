import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { getConfigurations } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const TEMP_DIR = resolve(PROJECT_ROOT, 'temp');
const BASE_URL = 'http://localhost:5173';

function getWorksheetUrl(moduleName, params) {
    const urlParams = new URLSearchParams(params);
    return `${BASE_URL}/worksheets/${moduleName}/worksheet.html?${urlParams.toString()}`;
}

async function generatePdfs() {
    const configurations = getConfigurations();

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Ensure the temp directory exists
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR);
    }

    for (const config of configurations) {
        const url = getWorksheetUrl('operations-vertical', config.params);
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

