// src/pages/ViewConfig.jsx
import React, { useState } from 'react';
import ReactJson from 'react-json-view';

const ViewConfig = () => {
  const [dataSourceName, setDataSourceName] = useState('');
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  const handleView = async (e) => {
    e.preventDefault();
    setError('');
    setConfig(null);

    try {
      const res = await fetch(`http://localhost:8080/api/configs/${dataSourceName}`);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Unknown error');
      } else {
        const result = await res.json();
        setConfig(result);
      }
    } catch (err) {
      setError(`Fetch failed: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>View Config</h2>
      <form onSubmit={handleView}>
        <div>
          <label>Data Source Name: </label>
          <input
            type="text"
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Fetch Config</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {config && (
        <div style={{ marginTop: '1em' }}>
          <h3>Data Source: {config.dataSourceName}</h3>
          <p><strong>Created At:</strong> {config.createdAt}</p>
          <ReactJson
            src={config.config}
            name={false}
            collapsed={false}
            enableClipboard={true}
            displayDataTypes={false}
            style={{ fontSize: '14px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewConfig;
