import { useState, useEffect } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetch('/api/csv-api')
      .then((response) => response.json())
      .then((data) => setFiles(data.files))
      .catch((err) => console.error('Failed to load files', err));
  }, []);

  const pageCount = Math.ceil(files.length / rowsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page with new row setting
  };

  const currentTableData = files.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <h1>Recently Generated Reports</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Report Name</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((file, index) => (
            <tr key={index}>
              <td>{file.creationDate}</td>
              <td>{file.file}</td>
              <td>
                <a href={`/CSV-Files/${file.file}`} download>
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => changePage(number)}
            disabled={currentPage === number}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </button>
        <div>
          Rows per page:
          <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  );
}
