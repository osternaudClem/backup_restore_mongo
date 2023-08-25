import path from 'path';
import { fileURLToPath } from 'url';

// Fix ES 6 dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const backupDir = path.join(__dirname, '../backup');
