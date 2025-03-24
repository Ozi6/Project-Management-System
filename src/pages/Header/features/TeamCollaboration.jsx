import React from 'react';
import { Users, UserPlus, UserCheck, List, Tag, Clock, ArrowRight, Shield, Settings } from 'lucide-react';
import FeaturePageTemplate from '../../../components/FeaturePageTemplate';
import { motion } from 'framer-motion';

const TeamCollaboration = () => {
  const collaborationFeatures = [
    {
      icon: Users,
      title: "Team Formation",
      description: "Create specialized teams and organize members by departments, projects, or skills."
    },
    {
      icon: UserPlus,
      title: "Member Assignment",
      description: "Assign team members to specific tasks with clear responsibilities and deadlines."
    },
    {
      icon: List,
      title: "Workload Distribution",
      description: "Evenly distribute tasks across your team to prevent burnout and maximize efficiency."
    },
    {
      icon: UserCheck,
      title: "Role Management",
      description: "Define team roles and permissions to streamline workflow and decision making."
    },
    {
      icon: Shield,
      title: "Access Controls",
      description: "Set board, list, and card-level permissions to manage who can view and edit content."
    },
    {
      icon: Settings,
      title: "Team Settings",
      description: "Customize team visibility, notifications, and collaboration preferences."
    }
  ];

  return (
    <FeaturePageTemplate
      title="Team Collaboration"
      description="Organize your teams and distribute work efficiently across your organization."
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--loginpage-bg)] to-[var(--loginpage-bg2)] rounded-3xl p-8 mb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-4 font-serif">Collaborate Better with Teams</h2>
            <p className="text-lg text-[var(--features-text-color)] mb-6">
              PlanWise helps you organize team members, assign specific people to tasks, 
              and distribute workload efficiently—just like Trello, but with features tailored 
              to your team's unique needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-2">
                  <span className="text-[var(--features-icon-color)] text-lg font-bold">✓</span>
                </div>
                <span className="text-[var(--features-text-color)]">Team formation</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-2">
                  <span className="text-[var(--features-icon-color)] text-lg font-bold">✓</span>
                </div>
                <span className="text-[var(--features-text-color)]">Task assignment</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-2">
                  <span className="text-[var(--features-icon-color)] text-lg font-bold">✓</span>
                </div>
                <span className="text-[var(--features-text-color)]">Workload balancing</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Team Collaboration" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-[var(--features-title-color)] mb-10 font-mono tracking-tight">Team Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collaborationFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-[var(--bg-color)] p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-[var(--loginpage-bg2)] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-[var(--features-icon-color)]" />
              </div>
              <h3 className="text-xl text-[var(--features-title-color)] font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--features-text-color)]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Assignment Demo Section */}
      <div className="bg-[var(--bg-color)] rounded-2xl shadow-md p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--features-title-color)] font-sans uppercase tracking-wider">Task Assignment in Action</h2>
        <p className="text-center text-[var(--features-text-color)] mb-8">
          Easily assign tasks to team members and track who's working on what
        </p>
        
        <div className="border border-[var(--features-text-color)] rounded-lg overflow-hidden">
          {/* Board Header */}
          <div className="bg-[var(--loginpage-bg2)] p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="font-bold text-lg text-[var(--features-title-color)] mr-4">Marketing Campaign</h3>
                <span className="bg-[var(--loginpage-bg2)] text-[var(--features-icon-color)] text-xs px-2.5 py-1 rounded">Board</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--features-icon-color)] flex items-center justify-center text-white text-xs border-2 border-white">AB</div>
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs border-2 border-white">CJ</div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs border-2 border-white">EL</div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs border-2 border-white">+2</div>
                </div>
                <button className="bg-[var(--features-icon-color)] text-[var(--bg-color2)] rounded p-1.5">
                  <UserPlus style={{color:"var(--bg-color)"}}size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Board Content */}
          <div className="p-4 bg-[var(--gray-card1)] overflow-x-auto">
            <div className="flex space-x-4">
              {/* To Do List */}
              <div className="bg-[var(--gray-card3)] rounded min-w-[280px] w-[280px]">
                <div className="p-3 border-b border-[var(--gray-card1)]">
                  <h4 className="font-medium text-[var(--features-text-color)]">To Do</h4>
                </div>
                <div className="p-2 space-y-2">
                  <div className="bg-[var(--bg-color)] p-3 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-[var(--features-title-color)]">Create social media graphics</h5>
                      <button className="bg-[var(--gray-card1)] rounded p-1 hover:bg-[var(--hover-color)]0">
                        <UserPlus size={14} className="text-[var(--features-text-color)]" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag size={12} className="text-g[var(--features-text-color)] mr-1" />
                        <span className="text-xs text-[var(--features-text-color)]">Design</span>
                      </div>
                      <div>
                        <span className="text-xs text-red-600 flex items-center">
                          <Clock size={10} className="mr-1" />
                          Mar 28
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--bg-color)] p-3 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-[var(--features-title-color)]">Draft email newsletter</h5>
                      <div className="w-6 h-6 rounded-full bg-[var(--features-icon-color)] flex items-center justify-center text-white text-xs">
                        AB
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag size={12} className="text-[var(--features-text-color)] mr-1" />
                        <span className="text-xs text-[var(--features-text-color)]">Content</span>
                      </div>
                      <div>
                        <span className="text-xs text-amber-600 flex items-center">
                          <Clock size={10} className="mr-1" />
                          Apr 2
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* In Progress List */}
              <div className="bg-[var(--gray-card3)] rounded min-w-[280px] w-[280px]">
                <div className="p-3 border-b border-[var(--gray-card1)]">
                  <h4 className="font-medium text-[var(--features-text-color)]">In Progress</h4>
                </div>
                <div className="p-2 space-y-2">
                  <div className="bg-[var(--bg-color)] p-3 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-[var(--features-title-color)]">Update website copy</h5>
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                        CJ
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag size={12} className="text-[var(--features-text-color)] mr-1" />
                        <span className="text-xs text-[var(--features-text-color)]">Content</span>
                      </div>
                      <div className="bg-[var(--loginpage-bg2)] px-2 py-0.5 rounded text-xs text-[var(--features-icon-color)]">
                        50%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Review List */}
              <div className="bg-[var(--gray-card3)] rounded min-w-[280px] w-[280px]">
                <div className="p-3 border-b border-[var(--gray-card1)]">
                  <h4 className="font-medium text-[var(--features-text-color)]">Review</h4>
                </div>
                <div className="p-2 space-y-2">
                  <div className="bg-[var(--bg-color)] p-3 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-[var(--features-title-color)]">Design new landing page</h5>
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                        EL
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag size={12} className="text-[var(--features-text-color)] mr-1" />
                        <span className="text-xs text-[var(--features-text-color)]">Design</span>
                      </div>
                      <div className="bg-purple-100 px-2 py-0.5 rounded text-xs text-purple-700">
                        Feedback Needed
                      </div>
                    </div>
                    <div className="mt-2 flex">
                      <div className="w-6 h-6 rounded-full bg-[var(--features-icon-color)] flex items-center justify-center text-white text-xs border-2 border-white">
                        AB
                      </div>
                      <span className="text-xs text-[var(--features-text-color)] ml-2">Please review by EOD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Workload Section */}
      <div className="bg-[var(--gray-card3)] rounded-2xl p-8 mb-16">
      <div className="center bg-[var(--gray-card2)] p-6 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--features-title-color)]  text-center mb-8 font-sans italic">Balanced Workload Distribution</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl text-[var(--features-title-color)] font-semibold mb-4">Visualize Team Capacity</h3>
              <p className="text-[var(--features-text-color)] mb-6">
                See at a glance who has bandwidth and who's at capacity to make smart assignment decisions.
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--features-icon-color)] flex items-center justify-center text-white text-xs mr-2">AB</div>
                      <span className='text-[var(--features-title-color)]'>Alex Brown</span>
                    </div>
                    <span className="text-sm text-[var(--text-color3)]">7/10 tasks</span>
                  </div>
                  <div className="w-full bg-[var(--gray-card3)] rounded-full h-2.5">
                    <div className="bg-[var(--features-icon-color)] h-2.5 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mr-2">CJ</div>
                      <span className='text-[var(--features-title-color)]'>Chris Johnson</span>
                    </div>
                    <span className="text-sm text-[var(--text-color3)]">3/10 tasks</span>
                  </div>
                  <div className="w-full bg-[var(--gray-card3)] rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs mr-2">EL</div>
                      <span className='text-[var(--features-title-color)]'>Emma Lewis</span>
                    </div>
                    <span className="text-sm text-[var(--text-color3)]">9/10 tasks</span>
                  </div>
                  <div className="w-full bg-[var(--gray-card3)] rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl text-[var(--features-title-color)] font-semibold mb-4">Team Performance Insights</h3>
              <p className="text-[var(--features-text-color)] mb-4">
                Track team velocity and completion rates to optimize workflow and identify bottlenecks.
              </p>
              
              <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-sm">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-[var(--features-title-color)]">Tasks completed this week</p>
                    <p className="text-2xl text-[var(--features-icon-color)] font-bold">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--features-title-color)]">Team velocity</p>
                    <p className="text-2xl text-[var(--features-icon-color)] font-bold">8.5</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--features-title-color)]">On-time completion</p>
                    <p className="text-2xl text-[var(--features-icon-color)] font-bold">92%</p>
                  </div>
                </div>
                
                <div className="h-32 bg-gray-50 rounded flex items-end justify-between px-2">
                  {[35, 45, 30, 60, 75, 50, 40].map((height, i) => (
                    <div key={i} className="w-8 bg-[var(--features-icon-color)] rounded-t" style={{height: `${height}%`}}></div>
                  ))}
                </div>
                <div className="flex justify-between px-2 mt-1 text-xs text-[var(--features-title-color)]">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-[var(--loginpage-bg)] rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4 text-[var(--features-title-color)] font-mono tracking-tight">Build Better Teams Today</h2>
        <p className="text-lg text-[var(--features-text-color)] mb-6 max-w-2xl mx-auto">
          Start assigning tasks, managing workloads, and collaborating efficiently with PlanWise's team management tools.
        </p>
        <a 
          href="/signup" 
          className="inline-flex items-center bg-[var(--features-icon-color)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--hover-color)] transition-colors"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </FeaturePageTemplate>
  );
};

export default TeamCollaboration;