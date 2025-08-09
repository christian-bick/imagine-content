import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { getUrls } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const TEMP_DIR = resolve(PROJECT_ROOT, 'temp');

async function generatePdfs() {
    const combinations = getUrls();

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Ensure the temp directory exists
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR);
    }

    for (const combo of combinations) {
        console.log(`Navigating to ${combo.url}`);
        await page.goto(combo.url, { waitUntil: 'networkidle0' });

        console.log(`Generating PDF for: ${combo.filename}`);
        const pdfPath = resolve(TEMP_DIR, combo.filename);
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

