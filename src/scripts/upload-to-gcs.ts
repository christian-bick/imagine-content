import 'dotenv/config'; // Load .env file at the very top
import { Storage } from '@google-cloud/storage';
import { readdir, stat } from 'fs/promises';
import { join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const OUT_DIR = resolve(PROJECT_ROOT, 'out');

async function uploadDirectoryToGCS(bucketName: string) {
    if (!bucketName) {
        console.error('Please provide a bucket name as an argument.');
        process.exit(1);
    }

    const storage = new Storage();
    const bucket = storage.bucket(bucketName);

    console.log(`Starting upload of '${OUT_DIR}' to GCS bucket '${bucketName}'...`);

    try {
        const filesToUpload: string[] = [];

        // Function to recursively get all files in a directory
        async function getFiles(dir: string) {
            const entries = await readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = join(dir, entry.name);
                if (entry.isDirectory()) {
                    await getFiles(fullPath);
                } else {
                    filesToUpload.push(fullPath);
                }
            }
        }

        await getFiles(OUT_DIR);

        if (filesToUpload.length === 0) {
            console.log('No files found in the /out directory to upload.');
            return;
        }

        for (const filePath of filesToUpload) {
            const destination = relative(OUT_DIR, filePath).replace(/\\/g, '/'); // Get relative path for GCS object name
            console.log(`Uploading ${filePath} to gs://${bucketName}/${destination}`);

            await bucket.upload(filePath, {
                destination: destination,
                // You can add more options here, e.g., contentType, predefinedAcl
            });
            console.log(`Uploaded ${destination}`);
        }

        console.log('All files uploaded successfully!');
    } catch (error) {
        console.error('Error during upload:', error);
        process.exit(1);
    }
}

// Get bucket name from command line arguments
const bucketName = process.argv[2];

uploadDirectoryToGCS(bucketName).catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
