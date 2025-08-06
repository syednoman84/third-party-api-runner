import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactJson from 'react-json-view';

const ViewConfigDetails = () => {
  const { dataSourceName } = useParams();
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/configs/${dataSourceName}`);
        if (!res.ok) {
          const errText = await res.text();
          setError(errText);
        } else {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    };

    fetchConfig();
  }, [dataSourceName]);

  return (
    <div className="container">
      <h2>Config Details: {dataSourceName}</h2>
      {error && <p className="error">{error}</p>}

      {config && (
        <>
          <p><strong>Created At:</strong> {new Date(config.createdAt).toLocaleString()}</p>
          <h4>Configuration:</h4>
          <ReactJson
            src={config.config}
            name={null}
            collapsed={false}
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={false}
            style={{ fontSize: '16px' }}
          />
        </>
      )}
    </div>
  );
};

export default ViewConfigDetails;
