import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import Homepage from "./pages/Homepage";
import AllProjects from "./pages/AllProjects";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectManagement from "./pages/ProjectManagement";
import "./App.css";

function PageWrapper({ children }){
    return(
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}>
            {children}
        </motion.div>
    );
}

PageWrapper.propTypes =
{
    children: PropTypes.node.isRequired,
};

function AnimatedRoutes()
{
    const location = useLocation();

    return(
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Homepage/></PageWrapper>} />
                <Route path="/projects" element={<PageWrapper><ProjectManagement/></PageWrapper>}/>
                <Route path="/project/:id" element={<PageWrapper><ProjectDetails/></PageWrapper>}/>
            </Routes>
        </AnimatePresence>
    );
}

function App()
{
    return(
        <Router>
            <AnimatedRoutes/>
        </Router>
    );
}

export default App;
