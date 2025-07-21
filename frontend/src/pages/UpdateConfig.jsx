// src/pages/UpdateConfig.jsx
import React, { useState } from 'react';

const UpdateConfig = () => {
  const [dataSourceName, setDataSourceName] = useState('');
  const [configJson, setConfigJson] = useState('');
  const [response, setResponse] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const parsedJson = JSON.parse(configJson);
      const res = await fetch(`http://localhost:8080/api/configs/update/${dataSourceName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJson),
      });

      const result = await res.text();
      setResponse(result);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Update Existing Config</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Data Source Name: </label>
          <input
            type="text"
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Updated Config JSON:</label><br />
          <textarea
            rows="15"
            cols="80"
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default UpdateConfig;
