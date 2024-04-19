import { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../utils/dateHelpers';
import styles from './index.module.css';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isVisible, setIsVisible] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortByDate, setSortByDate] = useState('');

  const API = '/api/csv-api';

  useEffect(() => {
    callApi(API);
  }, []);

  async function callApi(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setFiles(data.files))
      .catch((err) => console.error('Failed to load files', err));
  }

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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleFilterApply = () => {
    const params = {
      startDate: startDate,
      endDate: endDate,
      sortByDate: sortByDate
    };

    const searchParams = new URLSearchParams(params).toString();
    callApi(API + '?' + searchParams);
    setFiltering(false);
    setIsVisible(true);
    setEndDate('');
    setStartDate('');
    setSortByDate('');
  };

  return (
    <div className={styles.pageContainer}>
      {isVisible ? (
        <div className={styles.reportContainer}>
          <div className={styles.titleContainer}>
            <h1>Recently Generated Reports</h1>
            <div className={styles.headerButtonsContainer}>
              <button
                onClick={() => {
                  toggleVisibility();
                  setFiltering(true);
                }}
              >
                <img
                  src="https://res.cloudinary.com/dscsiijis/image/upload/c_scale,h_20/v1713479155/filter_ykxxsz.png"
                  alt="Filter button icon"
                />
              </button>
              <button onClick={toggleVisibility}>X</button>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Report Name</th>
                  <th className={styles.fileDownloadCell}>Download</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((file, index) => (
                  <tr key={index} className={styles.row}>
                    <td className={styles.fileDateCell}>
                      {formatDate(file.creationDate)} <br />
                      <span className={styles.fileCreationTime}>
                        {formatTime(file.creationDate)}
                      </span>
                    </td>
                    <td className={styles.fileNameCell}>{file.file}</td>
                    <td className={styles.fileDownloadCell}>
                      <a href={`/CSV-Files/${file.file}`} download>
                        <img
                          className={styles.downloadIcon}
                          src="https://res.cloudinary.com/dscsiijis/image/upload/c_pad,w_25,h_25/v1713477677/file_yej9dd.png"
                          alt="Download Icon"
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => changePage(number)}
                  disabled={currentPage === number}
                  className={currentPage === number ? styles.currentPage : ''}
                >
                  {number}
                </button>
              )
            )}
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
          ;
        </div>
      ) : filtering ? (
        <div className={styles.filterControls}>
          <button
            className={styles.exitButton}
            onClick={() => {
              setFiltering(false);
              toggleVisibility();
            }}
          >
            X
          </button>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <label>
            Sort by Date:
            <select
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value)}
            >
              <option value="">Select</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
          <button className={styles.filterSubmit} onClick={handleFilterApply}>
            Apply Filters
          </button>
        </div>
      ) : (
        <button onClick={toggleVisibility} className={styles.displayBtn}>
          Show Reports
        </button>
      )}
    </div>
  );
}
