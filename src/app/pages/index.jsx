import { useState, useEffect } from 'react';
export default function Home() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch('../csvAPI')
            .then(response => response.json())
            .then(data => setFiles(data.files))
            .catch(err => console.error("Failed to load files", err));
    }, []);

    return (
        <div>
            <h1>Recently Generated CSV Reports</h1>
            <ul>
                {files.map(file => (
                    <li key={file}>
                        <a href={`/public/${file}`} download>{file}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
