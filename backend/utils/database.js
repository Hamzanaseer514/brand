import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
};

// Initialize default data files
export const initializeDatabase = async () => {
  await ensureDataDir();

  const files = [
    { name: 'products.json', default: [] },
    { name: 'categories.json', default: ['All', 'Woody', 'Floral', 'Fresh'] },
    { name: 'reviews.json', default: [] },
    { name: 'testimonials.json', default: [] },
    { name: 'orders.json', default: [] },
    { name: 'users.json', default: [] },
  ];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file.name);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(file.default, null, 2));
    }
  }
};

// Read data from file
export const readData = async (filename) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// Write data to file
export const writeData = async (filename, data) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

