import React from 'react';
import { CheckSquare, Clock, Bell} from 'lucide-react';
import FeaturePageTemplate from '../../components/FeaturePageTemplate';

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
    }
    
  ];

  return (
    <FeaturePageTemplate
      title="Task Tracking"
      description="Keep your projects on track with comprehensive task management"
    >
      <div className="py-12">
        {/* Interactive Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              See Task Tracking in Action
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">To Do</h3>
                <div className="space-y-3">
                  {['Research', 'Design', 'Planning'].map((task, i) => (
                    <div key={i} className="bg-white p-3 rounded shadow-sm">
                      {task}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">In Progress</h3>
                <div className="space-y-3">
                  {['Development', 'Testing'].map((task, i) => (
                    <div key={i} className="bg-white p-3 rounded shadow-sm">
                      {task}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Done</h3>
                <div className="space-y-3">
                  {['Setup', 'Initial Review'].map((task, i) => (
                    <div key={i} className="bg-white p-3 rounded shadow-sm">
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </FeaturePageTemplate>
  );
};

export default TaskTracking;