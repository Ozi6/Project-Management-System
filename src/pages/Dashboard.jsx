import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, Activity, PieChart, ChevronRight, 
  Calendar, CheckCircle, Clock, AlertCircle, 
  ArrowUp, ArrowDown, Eye, FileText, Plus, Heart
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    inProgress: 0,
    completed: 0,
    upcomingDeadlines: 0,
    teamMembers: 0,
    completionRate: 0
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Sample data that would normally come from an API
  useEffect(() => {
    // Simulate API call to fetch projects
    const sampleProjects = [
      { id: 1, name: 'Website Redesign', progress: 75, status: 'In Progress', dueDate: '2025-04-15', owner: 'Alice' },
      { id: 2, name: 'Mobile App Development', progress: 30, status: 'In Progress', dueDate: '2025-05-01', owner: 'Bob' },
      { id: 3, name: 'Database Migration', progress: 100, status: 'Completed', dueDate: '2025-03-28', owner: 'Charlie' },
      { id: 4, name: 'Marketing Campaign', progress: 50, status: 'In Progress', dueDate: '2025-03-18', owner: 'Diana' },
      { id: 5, name: 'Product Launch', progress: 10, status: 'In Progress', dueDate: '2025-06-01', owner: 'Emma' },
    ];
    
    setProjects(sampleProjects);
    
    // Calculate stats
    const inProgressCount = sampleProjects.filter(p => p.status === 'In Progress').length;
    const completedCount = sampleProjects.filter(p => p.status === 'Completed').length;
    const totalTasks = sampleProjects.length;
    
    setStats({
      totalProjects: totalTasks,
      inProgress: inProgressCount,
      completed: completedCount,
      upcomingDeadlines: 3,
      teamMembers: new Set(sampleProjects.map(p => p.owner)).size,
      completionRate: Math.round((completedCount / totalTasks) * 100)
    });
  }, []);

  // In the Dashboard component
  useEffect(() => {
    setActiveTab('dashboard');
  }, [setActiveTab]);

  // Add this effect to update the tab when location changes
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setActiveTab('dashboard');
    }
  }, [location, setActiveTab]);

  // Simulated activity data
  const recentActivities = [
    { id: 1, user: 'Alice', action: 'completed task', item: 'Design Homepage', time: '2 hours ago', avatar: 'A' },
    { id: 2, user: 'Bob', action: 'commented on', item: 'API Integration', time: '3 hours ago', avatar: 'B' },
    { id: 3, user: 'Charlie', action: 'created', item: 'New Marketing Campaign', time: '5 hours ago', avatar: 'C' },
    { id: 4, user: 'Diana', action: 'updated', item: 'Q1 Reports', time: '1 day ago', avatar: 'D' },
  ];

  // Upcoming deadlines
  const upcomingDeadlines = [
    { id: 1, task: 'Submit Final Designs', project: 'Website Redesign', dueDate: '2025-03-15', status: 'At Risk' },
    { id: 2, task: 'Client Presentation', project: 'Mobile App Development', dueDate: '2025-03-18', status: 'On Track' },
    { id: 3, task: 'Complete Testing', project: 'Database Migration', dueDate: '2025-03-20', status: 'On Track' }
  ];

  // Determine task status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'At Risk': return 'text-red-500';
      case 'On Track': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'At Risk': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'On Track': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  // Handle new project creation
  const handleNewProject = () => {
    navigate('/projects/new');
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      {/* Header with blue accent */}
      <div className="w-full bg-white shadow-sm z-10 border-b-2 border-blue-100">
        <Header
          title={<span className="text-xl font-semibold text-blue-800">Dashboard</span>}
          action={{
            onClick: handleNewProject,
            icon: <Plus className="mr-2 h-4 w-4" />,
            label: "New Project"
          }}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white shadow-md z-5 border-r border-blue-100">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main content with blue background */}
        <div className="flex-1 overflow-auto bg-blue-50 flex flex-col">
          <div className="p-6 space-y-6 flex-grow">
            {/* Welcome banner with blue gradient */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl shadow-md p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h1>
              <p className="opacity-90">
                Here's an overview of your projects and team's progress.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link to="/projects" className="bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-lg flex items-center text-sm backdrop-blur-sm">
                  View All Projects <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
                <Link to="/team" className="bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-lg flex items-center text-sm backdrop-blur-sm">
                  Manage Team <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            
            {/* Stats with blue accents */}
            <div className="flex justify-center gap-6 flex-wrap">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 w-80"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Projects</p>
                    <h3 className="text-2xl font-bold text-blue-800">{stats.totalProjects}</h3>
                  </div>
                  <span className="p-2 bg-blue-100 rounded-md">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <span className="flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" /> 12% 
                  </span>
                  <span className="ml-1 text-blue-500">since last month</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 w-80"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">In Progress</p>
                    <h3 className="text-2xl font-bold text-blue-700">{stats.inProgress}</h3>
                  </div>
                  <span className="p-2 bg-blue-100 rounded-md">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <span className="flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3 mr-1" /> 5% 
                  </span>
                  <span className="ml-1 text-blue-500">since last week</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 w-80"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Completed</p>
                    <h3 className="text-2xl font-bold text-blue-600">{stats.completed}</h3>
                  </div>
                  <span className="p-2 bg-blue-100 rounded-md">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <span className="flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" /> 8% 
                  </span>
                  <span className="ml-1 text-blue-500">since last month</span>
                </div>
              </motion.div>
            </div>
            
            {/* Main dashboard content with blue accents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-blue-200 lg:col-span-2"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-blue-800">Project Progress</h2>
                  <Link to="/projects" className="text-sm text-blue-600 hover:underline flex items-center">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 4).map(project => (
                    <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-3">
                          {project.owner.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-xs text-gray-500">{`Due: ${new Date(project.dueDate).toLocaleDateString()}`}</p>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">{project.progress}%</span>
                          <span className="text-xs font-medium" style={{ color: project.progress === 100 ? '#10B981' : '#3B82F6' }}>
                            {project.status}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${project.progress}%` }}>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Recent Activity Feed with blue accents */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-blue-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-blue-800">Recent Activity</h2>
                  <button className="text-sm text-blue-600 hover:underline flex items-center">
                    <Eye className="h-4 w-4 mr-1" /> View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full bg-${activity.avatar === 'A' ? 'blue' : activity.avatar === 'B' ? 'green' : activity.avatar === 'C' ? 'purple' : 'amber'}-500 flex items-center justify-center text-white text-xs shrink-0`}>
                        {activity.avatar}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Third row with blue accents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming deadlines */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-blue-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-blue-800">Upcoming Deadlines</h2>
                  <button className="text-sm flex items-center text-blue-600 hover:underline">
                    <Calendar className="h-4 w-4 mr-1" />
                    View Calendar
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingDeadlines.map(deadline => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <h3 className="font-medium text-gray-800">{deadline.task}</h3>
                        <p className="text-xs text-gray-500">{deadline.project}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center mb-1">
                          {getStatusIcon(deadline.status)}
                          <span className={`ml-1 text-xs font-medium ${getStatusColor(deadline.status)}`}>
                            {deadline.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(deadline.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Documents with blue accents */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-blue-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-blue-800">Recent Documents</h2>
                  <button className="text-sm flex items-center text-blue-600 hover:underline">
                    <FileText className="h-4 w-4 mr-1" />
                    All Documents
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 1, name: 'Q1 Project Report.pdf', updated: '2 days ago', size: '2.4 MB' },
                    { id: 2, name: 'Design Assets.zip', updated: '5 days ago', size: '14.8 MB' },
                    { id: 3, name: 'Client Presentation.pptx', updated: '1 week ago', size: '5.1 MB' },
                  ].map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-800">{doc.name}</h3>
                          <p className="text-xs text-gray-500">Updated {doc.updated}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{doc.size}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Footer with blue accent */}
          <div className="bg-white border-t border-blue-100 py-3 px-6">
            <div className="flex flex-row justify-between items-center text-xs text-blue-600">
              <div>
                <span>© 2025 PlanWise</span>
                <span className="hidden sm:inline"> • All rights reserved</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/terms" className="hover:text-blue-800 transition-colors">Terms</Link>
                <Link to="/privacy" className="hover:text-blue-800 transition-colors">Privacy</Link>
                <span className="flex items-center">
                  Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> by PlanWise
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;