import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const directoryPath = path.join(process.cwd(), 'public/CSV-Files');
    console.log(directoryPath)
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Unable to scan files!" });
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));
        res.status(200).json({ files: csvFiles });
    });
}
