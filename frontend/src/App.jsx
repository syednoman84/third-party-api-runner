import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddConfig from './pages/AddConfig';
import UpdateConfig from './pages/UpdateConfig';
import DeleteConfig from './pages/DeleteConfig';
import ViewConfig from './pages/ViewConfig';
import RunProxy from './pages/RunProxy';
import './App.css';
import NavBar from './components/Navbar';

function App() {
  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<RunProxy />} />
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
