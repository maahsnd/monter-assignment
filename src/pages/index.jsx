import { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../utils/dateHelpers';
import styles from './index.module.css';

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
    <div className={styles.pageContainer}>
      <div className={styles.reportContainer}>
        <div className={styles.titleContainer}>
          <h1>Recently Generated Reports</h1>
          <div className={styles.headerButtonsContainer}>
            <button>X</button>
            <button>
              <img
                src="https://res.cloudinary.com/dscsiijis/image/upload/c_scale,h_20/v1713479155/filter_ykxxsz.png"
                alt="Filter button icon"
              />
            </button>
          </div>
        </div>

        <table className={styles.table}>
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
                <td className={styles.fileDateCell}>
                  {formatDate(file.creationDate)} <br />{' '}
                  <span className={styles.fileCreationTime}>
                    {formatTime(file.creationDate)}
                  </span>
                </td>
                <td className={styles.fileNameCell}>{file.file}</td>
                <td className={styles.fileDownloadCell}>
                  <a href={`/CSV-Files/${file.file}`} download>
                    <img
                      className={styles.downloadIcon}
                      src="https://res.cloudinary.com/dscsiijis/image/upload/c_pad,w_20,h_20/v1713477677/file_yej9dd.png"
                      alt="Download Icon"
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.paginatorButtonsContainer}>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageChangeButton}
          >
            <img
              src="https://res.cloudinary.com/dscsiijis/image/upload/c_scale,q_100,w_20/v1713478859/arrow-left_aeja3p.png"
              alt="Previous arrow icon"
            />
            Prev
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => changePage(number)}
              disabled={currentPage === number}
              className={currentPage === number ? styles.currentPage : ''}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === pageCount}
            className={styles.pageChangeButton}
          >
            Next
            <img
              src="https://res.cloudinary.com/dscsiijis/image/upload/c_scale,q_100,w_20/a_180/v1713478859/arrow-left_aeja3p.png"
              alt="Next arrow icon"
            />
          </button>
          <div className={styles.rowSelector}>
            Rows per page:
            <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
