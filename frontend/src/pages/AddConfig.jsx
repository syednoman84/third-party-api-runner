// src/pages/AddConfig.jsx
import React, { useState } from 'react';
import ReactJson from 'react-json-view';

const AddConfig = () => {
  const [dataSourceName, setDataSourceName] = useState('');
  const [configJson, setConfigJson] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setConfigJson(value);
    try {
      const parsed = JSON.parse(value);
      setParsedJson(parsed);
      setError('');
    } catch (err) {
      setParsedJson(null);
      setError('Invalid JSON');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);

    try {
      const parsed = JSON.parse(configJson);
      const res = await fetch(`http://localhost:8080/api/configs/add/${dataSourceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed),
      });

      const result = await res.text();
      setResponse(result);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Add New Config</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Data Source Name:</label>
          <input
            type="text"
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Config JSON:</label><br />
          <textarea
            rows="15"
            cols="80"
            value={configJson}
            onChange={handleJsonChange}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={!!error}>Submit</button>
      </form>

      {parsedJson && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Live Preview</h4>
          <ReactJson
            src={parsedJson}
            name={false}
            collapsed={false}
            enableClipboard={true}
            displayDataTypes={false}
            style={{ fontSize: '14px' }}
          />
        </div>
      )}

      {response && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Server Response</h4>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default AddConfig;
