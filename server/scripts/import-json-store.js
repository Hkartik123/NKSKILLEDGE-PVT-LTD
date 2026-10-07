const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = require('../utils/prisma');
const { getCollection } = require('../config/db');

async function importJsonStore() {
  const storeDirectory = path.join(__dirname, '..', 'data', 'store');
  const files = fs.readdirSync(storeDirectory)
    .filter(file => file.endsWith('.json'))
    .sort((left, right) => {
      if (left === 'users.json') return -1;
      if (right === 'users.json') return 1;
      return left.localeCompare(right);
    });

  let importedTotal = 0;

  for (const file of files) {
    const collectionName = path.basename(file, '.json');
    const filePath = path.join(storeDirectory, file);
    const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(records)) {
      throw new Error(`Expected ${file} to contain a JSON array.`);
    }

    const imported = await getCollection(collectionName).importMany(records);
    importedTotal += imported;
    console.log(`${collectionName}: imported ${imported} of ${records.length}; existing records were preserved.`);
  }

  console.log(`JSON store import completed: ${importedTotal} records added.`);
}

importJsonStore()
  .catch(error => {
    console.error('JSON store import failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
