// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import AllProjects from './pages/AllProjects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectManagement from './pages/ProjectManagement';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}

export default App;