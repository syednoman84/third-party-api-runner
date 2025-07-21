// src/pages/DeleteConfig.jsx
import React, { useState } from 'react';

const DeleteConfig = () => {
  const [dataSourceName, setDataSourceName] = useState('');
  const [response, setResponse] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/api/configs/delete/${dataSourceName}`, {
        method: 'DELETE',
      });

      const result = await res.text();
      setResponse(result);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Delete Config</h2>
      <form onSubmit={handleDelete}>
        <div>
          <label>Data Source Name: </label>
          <input
            type="text"
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Delete</button>
      </form>
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default DeleteConfig;
