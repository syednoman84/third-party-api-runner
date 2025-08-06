import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewAllConfigs = () => {
    const [configs, setConfigs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/configs/all')
            .then(res => res.json())
            .then(data => setConfigs(data))
            .catch(err => {
                console.error(err);
                setError('Failed to load configs');
            });
    }, []);

    const handleView = (dataSourceName) => {
        navigate(`/view-config/${dataSourceName}`);
    };

    return (
        <div className="container">
            <h2>All Configs</h2>
            {error && <p className="error">{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data Source Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {configs.map((config, index) => (
                        <tr key={index}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{config.dataSourceName}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{config.createdAt}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <button onClick={() => navigate(`/configs/view/${config.dataSourceName}`)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAllConfigs;
