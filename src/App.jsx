import AllProjects from './pages/AllProjects';
import ProjectDetails from './pages/ProjectDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

function App()
{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllProjects />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}
export default App;