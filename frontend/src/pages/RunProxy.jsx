import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

const RunProxy = () => {
    const [dataSourceName, setDataSourceName] = useState('');
    const [params, setParams] = useState([{ key: '', value: '' }]);
    const [result, setResult] = useState(null);
    const [statusCode, setStatusCode] = useState(null);
    const [responseHeaders, setResponseHeaders] = useState(null);
    const [requestHeaders, setRequestHeaders] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [requestParams, setRequestParams] = useState(null);

    const handleParamChange = (index, field, value) => {
        const updated = [...params];
        updated[index][field] = value;
        setParams(updated);
    };

    const addParam = () => setParams([...params, { key: '', value: '' }]);

    const handleCopy = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(result), null, 2);
            navigator.clipboard.writeText(formatted);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            navigator.clipboard.writeText(result);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        setError('');
        setStatusCode(null);
        setResponseHeaders(null);
        setRequestHeaders(null);
        setRequestParams(null);

        const paramObject = {};
        params.forEach(({ key, value }) => {
            if (key) paramObject[key] = value;
        });

        const query = new URLSearchParams(paramObject).toString();
        const fullUrl = `http://localhost:8080/api/proxy/${dataSourceName}?${query}`;

        try {
            const res = await fetch(fullUrl, { method: 'GET' });
            const text = await res.text();

            // 🔥 Save response info
            setStatusCode(res.status);
            setResponseHeaders(Object.fromEntries(res.headers.entries()));
            setRequestHeaders({ 'Content-Type': 'application/json' });
            setRequestParams(paramObject);

            if (!res.ok) {
                setError(text);
            } else {
                setResult(text);
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        }
    };

    return (
    <div className="container">
            <h2>Run Proxy</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Data Source Name: </label>
                    <input
                        type="text"
                        value={dataSourceName}
                        onChange={(e) => setDataSourceName(e.target.value)}
                        required
                    />
                </div>

                <h4>Query Parameters</h4>
                {params.map((p, i) => (
                    <div key={i}>
                        <input
                            type="text"
                            placeholder="Key"
                            value={p.key}
                            onChange={(e) => handleParamChange(i, 'key', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Value"
                            value={p.value}
                            onChange={(e) => handleParamChange(i, 'value', e.target.value)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addParam}>Add Param</button>

                <div style={{ marginTop: '1em' }}>
                    <button type="submit">Run</button>
                </div>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {statusCode && (
                <div style={{ marginTop: '1em' }}>
                    <h3>Status Code</h3>
                    <p>{statusCode}</p>
                </div>
            )}

            {requestHeaders && (
                <div>
                    <h3>Request Headers</h3>
                    <pre>{JSON.stringify(requestHeaders, null, 2)}</pre>
                </div>
            )}

            {requestParams && (
                <div>
                    <h3>Request Parameters</h3>
                    <pre>{JSON.stringify(requestParams, null, 2)}</pre>
                </div>
            )}

            {responseHeaders && (
                <div>
                    <h3>Response Headers</h3>
                    <pre>{JSON.stringify(responseHeaders, null, 2)}</pre>
                </div>
            )}

            {result && (
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Response Body
                        <button
                            onClick={handleCopy}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Copy to clipboard"
                        >
                            <FiCopy size={20} />
                        </button>
                        {copied && <span style={{ color: 'green' }}>Copied!</span>}
                    </h3>
                    <pre style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "5px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                    }}>
                        {typeof result === "string"
                            ? JSON.stringify(JSON.parse(result), null, 2)
                            : JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default RunProxy;
