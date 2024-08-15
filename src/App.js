import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [tempInput, setTempInput] = useState("");
  const [size, setSize] = useState(200);
  const [bgColor, setBgColor] = useState("ffffff");
  const [fgColor, setFgColor] = useState("000000");
  const [qrCode, setQrCode] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [filename, setFilename] = useState("QRCode.png");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (input) {
      setLoading(true);
      setError(null);
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(input)}&size=${size}x${size}&bgcolor=${bgColor}&color=${fgColor}`;
      console.log('Fetching QR code URL:', url);
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Failed to generate QR code');
          return response.blob(); 
        })
        .then(blob => {
          const objectURL = URL.createObjectURL(blob); 
          setQrCode(objectURL);
          setHistory(prev => [...prev, { url: objectURL, input }]);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setError(`Failed to generate QR code: ${err.message}`);
        })
        .finally(() => setLoading(false));
    }
  }, [input, size, bgColor, fgColor]);

  function handleGenerateClick() {
    if (tempInput.trim()) {
      setInput(tempInput.trim());
    } else {
      setError("Input cannot be empty.");
    }
  }

  function handleReset() {
    setTempInput("");
    setInput("");
    setSize(200);
    setBgColor("ffffff");
    setFgColor("000000");
    setQrCode("");
    setError(null);
    setFilename("QRCode.png");
  }

  function handleFilenameChange(e) {
    setFilename(e.target.value);
  }

  function handleCopyToClipboard() {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode).then(() => {
        alert("QR Code URL copied to clipboard!");
      });
    }
  }

  function handleDeleteHistoryItem(index) {
    setHistory(prev => prev.filter((_, i) => i !== index));
  }

  function handleClearHistory() {
    setHistory([]);
  }

  return (
    <div className="App">
      <h1>QR Code Generator</h1>
      <div className="input-box">
        <div className="gen">
          <input 
            type="text" 
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            placeholder="Enter text or URL to encode" 
          />
          <div className="button-group">
            <button 
              className="button" 
              onClick={handleGenerateClick}
            >
              Generate
            </button>
            <button 
              className="button reset" 
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="extra">
          <div className="color-size">
            <div>
              <h5>Background Color:</h5>
              <input 
                type="color" 
                value={`#${bgColor}`} 
                onChange={(e) => setBgColor(e.target.value.substring(1))} 
              />
            </div>
            <div>
              <h5>Foreground Color:</h5>
              <input 
                type="color" 
                value={`#${fgColor}`} 
                onChange={(e) => setFgColor(e.target.value.substring(1))} 
              />
            </div>
            <div>
              <h5>Dimension:</h5>
              <input 
                type="range" 
                min="200" 
                max="600"
                value={size} 
                onChange={(e) => setSize(e.target.value)} 
              />
              <span>{size} x {size}</span>
            </div>
            <div>
              <h5>Filename:</h5>
              <input 
                type="text" 
                value={filename} 
                onChange={handleFilenameChange}
                placeholder="Enter filename for download" 
              />
            </div>
          </div>
        </div>
      </div>
      <div className="output-box">
        {loading && <div className="loader">Generating...</div>}
        {error && <div className="error">{error}</div>}
        {qrCode && (
          <>
            <img src={qrCode} alt="QR Code" />
            <a href={qrCode} download={filename}>
              <button type="button" className="download-button">Download</button>
            </a>
            <button type="button" className="button" onClick={handleCopyToClipboard}>
              Copy URL
            </button>
          </>
        )}
      </div>
      <div className="history">
        <div className="history-header">
          <h2>History</h2>
          <button type="button" className="button clear-all" onClick={handleClearHistory}>
            Clear All History
          </button>
        </div>
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.input}
              </a>
              <button 
                className="delete-button" 
                onClick={() => handleDeleteHistoryItem(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
