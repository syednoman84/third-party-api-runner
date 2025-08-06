// src/pages/Homepage.jsx
import React from 'react';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to Third-Party API Runner 🚀</h1>
      <p>
        This is a highly configurable application that allows you to define, manage, and run third-party API calls dynamically.
      </p>
      <ul>
        <li>🔧 Add and update API configurations</li>
        <li>📦 Store configs in the database</li>
        <li>🧪 Run APIs with parameters and headers</li>
        <li>📊 View results with beautifully formatted JSON</li>
        <li>🛡️ Supports various authentication methods</li>
      </ul>
      <p className="highlight">Start by navigating using the menu above to add or run an API!</p>
    </div>
  );
};

export default Homepage;
