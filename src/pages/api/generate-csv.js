const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const { faker } = require('@faker-js/faker');

const NUM_FILES = 50;
const RECORDS_UPPER_BOUND = 20;
const baseDir = path.join(__dirname, '../../../public/CSV-Files');
const metadataPath = path.join(__dirname, '../../../public/metadata.json');

// Ensure the directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

function createCsvWriter(filename) {
  return createObjectCsvWriter({
    path: path.join(baseDir, filename),
    header: [
      { id: 'name', title: 'NAME' },
      { id: 'email', title: 'EMAIL' },
      { id: 'address', title: 'ADDRESS' },
      { id: 'date', title: 'DATE' }
    ]
  });
}

function generateUserData() {
  const numberOfRecords = faker.number.int({
    min: 1,
    max: RECORDS_UPPER_BOUND
  });
  const data = [];
  for (let i = 0; i < numberOfRecords; i++) {
    data.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      date: faker.date.past().toISOString().split('T')[0] // Format the date as YYYY-MM-DD
    });
  }
  return data;
}

async function generateCSVFiles() {
  let metadata = {};

  for (let i = 0; i < NUM_FILES; i++) {
    const filename = `report_${i + 1}.csv`;
    const creationDate = faker.date.recent({ days: 45 });

    metadata[filename] = { creationDate };

    const csvWriter = createCsvWriter(filename);
    const data = generateUserData();
    await csvWriter
      .writeRecords(data)
      .then(() =>
        console.log(`${filename} written successfully in ${baseDir}.`)
      );
  }

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

generateCSVFiles();
