import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddConfig from './pages/AddConfig';
import UpdateConfig from './pages/UpdateConfig';
import DeleteConfig from './pages/DeleteConfig';
import ViewConfig from './pages/ViewConfig';
import RunProxy from './pages/RunProxy';
// src/App.jsx
import './App.css';


function App() {
  return (
    <Router>
      <div>
        <h1>Third-Party API Manager</h1>
        <nav>
          <ul>
            <li><Link to="/add-config">Add Config</Link></li>
            <li><Link to="/update-config">Update Config</Link></li>
            <li><Link to="/delete-config">Delete Config</Link></li>
            <li><Link to="/view-config">View Config</Link></li>
            <li><Link to="/run-proxy">Run Proxy</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/add-config" element={<AddConfig />} />
          <Route path="/update-config" element={<UpdateConfig />} />
          <Route path="/delete-config" element={<DeleteConfig />} />
          <Route path="/view-config" element={<ViewConfig />} />
          <Route path="/run-proxy" element={<RunProxy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
