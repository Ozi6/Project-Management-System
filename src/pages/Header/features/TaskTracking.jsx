import React from 'react';
import { CheckSquare, Clock, Bell, BarChart2, Tag, Filter, ArrowRight } from 'lucide-react';
import FeaturePageTemplate from "../../../components/FeaturePageTemplate";
import { motion } from 'framer-motion';

const TaskTracking = () => {
  const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Create and organize tasks with ease"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Monitor time spent on tasks"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated on task progress"
    },
    {
      icon: BarChart2,
      title: "Progress Analytics",
      description: "Visual insights into task completion rates"
    },
    {
      icon: Tag,
      title: "Custom Labels",
      description: "Organize tasks with customizable tags"
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Find tasks quickly with powerful filters"
    }
  ];

  // Sample tasks for the interactive demo
  const kanbanBoard = {
    todo: ['Research market trends', 'Design new product page', 'Draft project proposal'],
    inProgress: ['Update user documentation', 'Implement new feature'],
    review: ['Code refactoring', 'QA testing'],
    done: ['Initial planning', 'Stakeholder meeting', 'Setup project environment']
  };

  return (
    <FeaturePageTemplate
      title="Task Tracking"
      description="Keep your projects on track with comprehensive task management"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--loginpage-bg)] via-[var(--loginpage-bg2)] to-[var(--gray-card1)] rounded-3xl p-8 mb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-4 font-sans uppercase tracking-wide">Never Lose Track of Tasks Again</h2>
            <p className="text-lg text-[var(--features-text-color)] mb-6">
              PlanWise's powerful task tracking system helps you manage everything from small daily activities 
              to complex multi-stage workflows. Keep everyone accountable and ensure nothing falls through the cracks.
            </p>
            <motion.div 
              className="bg-[var(--bg-color)] p-4 rounded-lg shadow-md mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center text-[var(--features-icon-color)] mb-2">
                <CheckSquare className="h-5 w-5 mr-2" />
                <span className="font-medium">Complete visibility of all tasks</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--features-icon-color)] h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>Project progress</span>
                <span>75%</span>
              </div>
            </motion.div>
          </div>
          <div className="lg:w-1/2">
            <motion.img 
              src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Task Tracking" 
              className="rounded-xl shadow-lg w-full h-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-8 text-center font-mono tracking-tight">
            See Task Tracking in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(kanbanBoard).map(([status, tasks], columnIndex) => (
              <div key={status} className="bg-[var(--gray-card2)] p-6 rounded-xl">
                <h3 className="font-semibold mb-4 text-[var(--features-title-color)] capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <div className="space-y-3">
                  {tasks.map((task, i) => (
                    <motion.div 
                      key={i} 
                      className="bg-[var(--bg-color)] p-3 rounded text-[var(--features-text-color)] shadow-sm border-l-4 border-[var(--features-icon-color)] hover:shadow-md transition-shadow cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (i + columnIndex) }}
                      whileHover={{ y: -2 }}
                    >
                      {task}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-[var(--features-title-color)] mb-10 font-serif italic">Comprehensive Task Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[var(--features-icon-color)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <feature.icon className="h-8 w-8 text-[var(--features-icon-color)] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Feature Section */}
      <div className="bg-[var(--loginpage-bg2)] rounded-2xl p-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--features-title-color)] font-sans tracking-wider">How PlanWise Makes Task Management Easier</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-3 text-[var(--features-icon-color)] font-mono">Intuitive Task Creation</h3>
                <p className="text-[var(--features-text-color)] mb-4">
                  Creating new tasks is quick and straightforward. Add descriptions, due dates, priority levels, 
                  and assign tasks to team members in seconds.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>Simple drag-and-drop interface</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>Bulk task creation for efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>Task templates for common activities</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-[var(--gray-card2)] p-4 rounded-lg shadow-md">
                <div className="bg-[var(--gray-card1)] p-3 rounded mb-3">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-[var(--features-icon-color)]">New Task</div>
                    <div className="text-[var(--features-icon-color)] text-sm">Save as template</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">Task name</div>
                    <div>Prepare client presentation</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">Assign to</div>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-1">
                        <span className="text-xs text-[var(--features-icon-color)]">JD</span>
                      </div>
                      <span>John Doe</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">Due date</div>
                      <div>Mar 24, 2025</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">Priority</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-3 font-mono text-[var(--features-icon-color)]">Real-time Progress Tracking</h3>
                <p className="text-[var(--features-text-color)] mb-4">
                  Monitor task completion and project progress in real-time with visual dashboards and detailed reports.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>Customizable progress indicators</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>Burndown charts and velocity tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>Automated status updates</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-[var(--gray-card2)] p-4 rounded-lg shadow-md">
                <div className="bg-[var(--gray-card1)] p-3 rounded mb-3">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-[var(--features-icon-color)]">New Task</div>
                    <div className="text-[var(--features-icon-color)] text-sm">Save as template</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">Task name</div>
                    <div>Prepare client presentation</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">Assign to</div>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-1">
                        <span className="text-xs text-[var(--features-icon-color)]">JD</span>
                      </div>
                      <span>John Doe</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">Due date</div>
                      <div>Mar 24, 2025</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">Priority</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[var(--features-icon-color)] rounded-2xl p-8 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4 font-serif">Ready to Streamline Your Task Management?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join PlanWise to boost productivity and deliver projects on time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/login" 
              className="bg-[var(--bg-color)] text-[var(--features-icon-color)] hover:bg-[var(--loginpage-bg2)] px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            
          </div>
          
        </motion.div>
      </div>
    </FeaturePageTemplate>
  );
};

export default TaskTracking;