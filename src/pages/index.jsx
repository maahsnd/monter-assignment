import { useState, useEffect } from 'react';

/* 
To do: tag each report with appropriate date, sort them 


*/

export default function Home() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch('/api/csv-api')
      .then((response) => response.json())
      .then((data) => setFiles(data.files)) // Ensure 'data.files' contains objects with 'date' and 'name' properties
      .catch((err) => console.error('Failed to load files', err));
  }, []);

  return (
    <div>
      <h1>Recently Generated CSV Reports</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Report Name</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.creationDate}</td> {/* Displaying the date */}
              <td>{file.file}</td> {/* Displaying the file name */}
              <td>
                <a href={`/CSV-Files/${file.file}`} download>
                  <img
                    className="downloadIcon"
                    src="https://res.cloudinary.com/dscsiijis/image/upload/c_pad,w_30,h_30/v1713477677/file_yej9dd.png"
                    alt="Download Icon"
                    /*  Download icon created by joalfa - Flaticon */
                  />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
