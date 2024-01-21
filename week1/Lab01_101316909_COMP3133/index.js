const fs = require('fs');//Delete canada.txt and usa.txt if already exist using fs module
const csvParser = require('csv-parser');
const results = [];

// Function to delete a file if it exists
function deleteFileIfExists(filename) {
    if (fs.existsSync(filename)) {
        try {
            fs.unlinkSync(filename);
            console.log(`${filename} deleted successfully.`);
        } catch (err) {
            console.error(`Error while deleting ${filename}:`, err);
        }
    } else {
        console.log(`${filename} does not exist, no need to delete.`);
    }
}

// Function to write data to a file
function writeToFile(filename, data) {
    const stream = fs.createWriteStream(filename, { flags: 'a' });
    stream.write('country,year,population\n'); // Write header
    data.forEach(row => stream.write(`${row.country},${row.year},${row.population}\n`));
    stream.end();
}

// Delete canada.txt and usa.txt if they exist
deleteFileIfExists('canada.txt');
deleteFileIfExists('usa.txt');

// Read CSV file
fs.createReadStream('input_countries.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // Filter data for Canada and USA

        const canadaData = results.filter(row => row.country === 'Canada');
        const usaData = results.filter(row => row.country === 'United States');

        // Write filtered data to respective files
        if (canadaData.length > 0) {
            writeToFile('canada.txt', canadaData);
            console.log('Data written to canada.txt');
        } else {
            console.log('No data for Canada found.');
        }

        if (usaData.length > 0) {
            writeToFile('usa.txt', usaData);
            console.log('Data written to usa.txt');
        } else {
            console.log('No data for the United States found.');
        }
    });
