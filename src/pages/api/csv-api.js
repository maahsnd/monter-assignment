import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const directoryPath = path.join(process.cwd(), 'public/CSV-Files');
  const metadataPath = path.join(process.cwd(), 'public/metadata.json');

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

      const csvFiles = files.filter((file) => file.endsWith('.csv'));

      const filesWithDates = csvFiles.map((file) => ({
        file: file,
        creationDate: metadata[file].creationDate || 'Unknown'
      }));

      filesWithDates.sort((a, b) => b.creationDate - a.creationDate);

      res.status(200).json({ files: filesWithDates.slice(0, 30) });
    });
  });
}
