import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ClerkProvider } from '@clerk/clerk-react';
import PropTypes from "prop-types";
import Homepage from "./pages/Homepage";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectManagement from "./pages/ProjectManagement";
import ProjectSettings from "./pages/ProjectSettings"
import ProjectManagementFeature from "./pages/Header/features/ProjectManagement";
import TeamCollaboration from "./pages/Header/features/TeamCollaboration";
import TaskTracking from "./pages/Header/features/TaskTracking";
import ProfilePage from "./pages/auth/ProfilePage";
import SignupPage from "./pages/auth/SignupPage";
import About from "./pages/Header/AboutUs";
import FAQPage from "./pages/Header/FAQPage";
import NotFound from "./pages/404/NotFound"; // Import the NotFound component
import LoginPage from "./pages/auth/LoginPage";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Dashboard from "./pages/Dashboard";
import GanttChart from "./pages/GanttChart";
import "./App.css";
import "./index.css"
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ScrollToTop from './components/ScrollToTop'; // Import the ScrollToTop component
import Issues from './pages/admin/Issues';
import IncidentsBugs from './pages/IncidentsBugs'; // Add to your imports at the top

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
                <Route path="/project/settings" element={<PageWrapper><ProjectSettings /></PageWrapper>} />
                <Route path="/" element={<PageWrapper><Homepage/></PageWrapper>}/>
                <Route path="/dashboard" element={<PageWrapper><Dashboard/></PageWrapper>}/>
                <Route path="/projects" element={<PageWrapper><ProjectManagement/></PageWrapper>}/>
                <Route path="/calendar" element={<PageWrapper><GanttChart/></PageWrapper>}/>

                
                <Route path="/project/:id" element={<PageWrapper><ProjectDetails/></PageWrapper>}/>
                <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/faq" element={<PageWrapper><FAQPage/></PageWrapper>}/>
                <Route path="/dashboard" element={<PageWrapper><Dashboard/></PageWrapper>}/>
                <Route path="/admin/issues" element={<PageWrapper><Issues/></PageWrapper>}/>
                {/* Add the new incidents-bugs route */}
                <Route path="/bugs" element={<PageWrapper><IncidentsBugs /></PageWrapper>}/>
                
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
                
                <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
                <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
                
                {/* 404 Route - Must be last */}
                <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return(
        <Router>
            <ScrollToTop /> {/* Add the ScrollToTop component inside Router */}
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
