// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import AllProjects from './pages/AllProjects';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';
import Homepage from "./pages/Homepage";
import './App.css';
import ProjectManagement from "./pages/ProjectManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;