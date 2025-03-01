import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ClerkProvider } from '@clerk/clerk-react';
import PropTypes from "prop-types";
import Homepage from "./pages/Homepage";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectManagement from "./pages/ProjectManagement";
import ProjectManagementFeature from "./pages/Header/features/ProjectManagement";
import TeamCollaboration from "./pages/Header/features/TeamCollaboration";
import TaskTracking from "./pages/Header/features/TaskTracking";
import ProfilePage from "./pages/auth/ProfilePage";
import SignupPage from "./pages/auth/SignupPage";
import About from "./pages/Header/AboutUs";
import FAQPage from "./pages/Header/FAQPage";
import NotFound from "./pages/404/NotFound"; // Import the NotFound component
import LoginPage from "./pages/auth/LoginPage";
import "./App.css";
import "./index.css"
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

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

PageWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

function AnimatedRoutes() {
    const location = useLocation();

    return(
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                
                <Route path="/" element={<PageWrapper><Homepage/></PageWrapper>}/>
                <Route path="/projects" element={<PageWrapper><ProjectManagement/></PageWrapper>}/>
                
                <Route path="/project/:id" element={<PageWrapper><ProjectDetails/></PageWrapper>}/>
                <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/faq" element={<PageWrapper><FAQPage/></PageWrapper>} />
                
                
                
                {/* Auth Routes */}
                <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
                {/* Feature Routes */}
                <Route path="/features/project-management" element={
                    <PageWrapper><ProjectManagementFeature /></PageWrapper>
                } />
                <Route path="/features/team-collaboration" element={
                    <PageWrapper><TeamCollaboration /></PageWrapper>
                } />
                <Route path="/features/task-tracking" element={
                    <PageWrapper><TaskTracking /></PageWrapper>
                } />
                
                {/* 404 Route - Must be last */}
                <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return(
        <Router>
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
