import fs from 'fs';
import path from 'path';
import url from 'url';

export default function handler(req, res) {
  const directoryPath = path.join(process.cwd(), 'public/CSV-Files');
  const metadataPath = path.join(process.cwd(), 'public/metadata.json');

  const reqUrl = url.parse(req.url, true);
  const { startDate, endDate, sortByDate } = reqUrl.query;

  fs.readFile(metadataPath, 'utf8', (err, metadataContent) => {
    if (err) {
      console.error('Failed to read metadata file:', err);
      return res.status(500).json({ message: 'Unable to read metadata file!' });
    }

    let metadata;
    try {
      metadata = JSON.parse(metadataContent);
    } catch (parseErr) {
      console.error('Error parsing metadata:', parseErr);
      return res.status(500).json({ message: 'Error parsing metadata file!' });
    }

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Failed to read directory:', err);
        return res.status(500).json({ message: 'Unable to scan files!' });
      }

      let filesWithDates = files
        .filter((file) => file.endsWith('.csv'))
        .map((file) => ({
          file,
          creationDate: metadata[file]
            ? new Date(metadata[file].creationDate)
            : null
        }));

      // Filtering by startDate and/or endDate
      if (startDate || endDate) {
        const startDateObj = startDate
          ? new Date(startDate)
          : new Date(-8640000000000000); // Use earliest possible date if no start date
        const endDateObj = endDate ? new Date(endDate) : new Date(); // Use current date if no end date

        filesWithDates = filesWithDates.filter(
          ({ creationDate }) =>
            creationDate &&
            creationDate >= startDateObj &&
            creationDate <= endDateObj
        );
      }
      // Sorting logic
      if (sortByDate === 'asc') {
        filesWithDates.sort((a, b) => a.creationDate - b.creationDate);
      } else {
        filesWithDates.sort((a, b) => b.creationDate - a.creationDate);
      }

      res.status(200).json({ files: filesWithDates.slice(0, 30) });
    });
  });
}
