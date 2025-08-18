import 'dotenv/config'; // Load .env file at the very top
import { Storage } from '@google-cloud/storage';
import { readdir } from 'fs/promises';
import { join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createHash } from 'crypto';
import { createReadStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const OUT_DIR = resolve(PROJECT_ROOT, 'out');

function calculateMD5(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = createHash('md5');
        const stream = createReadStream(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('base64')));
        stream.on('error', (err) => reject(err));
    });
}

async function uploadDirectoryToGCS(bucketName: string, sync: boolean, dry: boolean) {
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);

    console.log(`Starting upload of '${OUT_DIR}' to GCS bucket '${bucketName}'...`);
    if (sync) {
        console.log('Sync mode enabled: checking for existing files and comparing hashes.');
    }
    if (dry) {
        console.log('Dry run mode enabled: no files will be uploaded.');
    }

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
            const destination = relative(OUT_DIR, filePath).split('\\').join('/'); // Get relative path for GCS object name

            if (sync) {
                const file = bucket.file(destination);
                let remoteHash: string | undefined;
                try {
                    const [metadata] = await file.getMetadata();
                    remoteHash = metadata.md5Hash;
                } catch (e: any) {
                    if (e.code !== 404) {
                        console.error(`Error checking file gs://${bucketName}/${destination}:`, e.message);
                        throw e;
                    }
                }

                if (remoteHash) {
                    const localHash = await calculateMD5(filePath);
                    if (localHash === remoteHash) {
                        console.log(`Skipping ${filePath} (hashes match)`);
                        continue;
                    }
                    console.log(`Hashes for ${filePath} differ. Re-uploading.`);
                }
            }

            if (dry) {
                console.log(`[DRY RUN] Would upload ${filePath} to gs://${bucketName}/${destination}`);
            } else {
                console.log(`Uploading ${filePath} to gs://${bucketName}/${destination}`);

                await bucket.upload(filePath, {
                    destination: destination,
                    // You can add more options here, e.g., contentType, predefinedAcl
                });
                console.log(`Uploaded ${destination}`);
            }
        }

        console.log('All files processed successfully!');
    } catch (error) {
        console.error('Error during upload:', error);
        process.exit(1);
    }
}

// Get bucket name from command line arguments
const args = process.argv.slice(2);
const bucketName = args.find(arg => !arg.startsWith('--'));

if (!bucketName) {
    console.error('Please provide a bucket name as an argument.');
    process.exit(1);
}

// Get sync flag, default to true
const syncArg = args.find(arg => arg.startsWith('--sync='));
const sync = syncArg ? syncArg.split('=')[1] !== 'false' : true;

const dry = args.includes('--dry');

uploadDirectoryToGCS(bucketName, sync, dry).catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
