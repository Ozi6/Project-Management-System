import React from 'react';
import { CheckSquare, Clock, Bell, BarChart2, Tag, Filter, ArrowRight } from 'lucide-react';
import FeaturePageTemplate from "../../../components/FeaturePageTemplate";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TaskTracking = () => {
  const {t} = useTranslation();
  const features = [
    {
      icon: CheckSquare,
      title: t("TT.mid.tit2.1"),
      description: t("TT.mid.tit2.1d")
    },
    {
      icon: Clock,
      title: t("TT.mid.tit2.2"),
      description: t("TT.mid.tit2.2d")
    },
    {
      icon: Bell,
      title: t("TT.mid.tit2.3"),
      description: t("TT.mid.tit2.3d")
    },
    {
      icon: BarChart2,
      title: t("TT.mid.tit2.4"),
      description: t("TT.mid.tit2.4d")
    },
    {
      icon: Tag,
      title: t("TT.mid.tit2.5"),
      description: t("TT.mid.tit2.5d")
    },
    {
      icon: Filter,
      title: t("TT.mid.tit2.6"),
      description: t("TT.mid.tit2.6d")
    }
  ];

  // Sample tasks for the interactive demo
  const kanbanBoard = {
    [t("TT.mid.subtit1")]: [t("TT.mid.subtit1.1"), t("TT.mid.subtit1.2"), t("TT.mid.subtit1.3")],
    [t("TT.mid.subtit2")]: [t("TT.mid.subtit2.1"), t("TT.mid.subtit2.2")],
    [t("TT.mid.subtit3")]: [t("TT.mid.subtit3.1"), t("TT.mid.subtit3.2")],
    [t("TT.mid.subtit4")]: [t("TT.mid.subtit4.1"), t("TT.mid.subtit4.2"), t("TT.mid.subtit4.3")]
  };

  return (
    <FeaturePageTemplate
      title={t("TT.tit")}
      description={t("TT.subtit")}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--loginpage-bg)] via-[var(--loginpage-bg2)] to-[var(--gray-card1)] rounded-3xl p-8 mb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-4 font-sans uppercase tracking-wide">{t("TT.head")}</h2>
            <p className="text-lg text-[var(--features-text-color)] mb-6">
            {t("TT.headd")}
            </p>
            <motion.div 
              className="bg-[var(--bg-color)] p-4 rounded-lg shadow-md mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center text-[var(--features-icon-color)] mb-2">
                <CheckSquare className="h-5 w-5 mr-2" />
                <span className="font-medium">{t("TT.head.task")}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--features-icon-color)] h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>{t("TT.head.prog")}</span>
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
      <div className="bg-[var(--bg-color)] rounded-2xl shadow-lg p-8 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-8 text-center font-mono tracking-tight">
          {t("TT.mid.tit")}
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
        <h2 className="text-2xl font-bold text-center text-[var(--features-title-color)] mb-10 font-serif italic">{t("TT.mid.tit2")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="p-6 bg-[var(--bg-color)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[var(--features-icon-color)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <feature.icon className="h-8 w-8 text-[var(--features-icon-color)] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--features-text-color)]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Feature Section */}
      <div className="bg-[var(--loginpage-bg2)] rounded-2xl p-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--features-title-color)] font-sans tracking-wider">{t("TT.foot.tit")}</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-3 text-[var(--features-icon-color)] font-mono">{t("TT.foot.tit1")}</h3>
                <p className="text-[var(--features-text-color)] mb-4">
                {t("TT.foot.tit1d")}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>{t("TT.foot.tit1.1")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>{t("TT.foot.tit1.2")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>{t("TT.foot.tit1.3")}</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-[var(--gray-card2)] p-4 rounded-lg shadow-md">
                <div className="bg-[var(--gray-card1)] p-3 rounded mb-3">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-[var(--features-icon-color)]">{t("TT.task.tit.l")}</div>
                    <div className="text-[var(--features-icon-color)] text-sm">{t("TT.task.tit.r")}</div>
                  </div>
                  <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">{t("TT.task1")}</div>
                    <div>{t("TT.task1.1")}</div>
                  </div>
                  <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">{t("TT.task2")}</div>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-1">
                        <span className="text-xs text-[var(--features-icon-color)]">JD</span>
                      </div>
                      <span>John Doe</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">{t("TT.task3")}</div>
                      <div>{t("TT.task3.1")}</div>
                    </div>
                    <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">{t("TT.task4")}</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>{t("TT.task4.1")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-3 font-mono text-[var(--features-icon-color)]">{t("TT.foot.tit2")}</h3>
                <p className="text-[var(--features-text-color)] mb-4">
                {t("TT.foot.tit2d")}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>{t("TT.foot.tit2.1")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>{t("TT.foot.tit2.2")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-[var(--homepage-text-bright)] mr-2 mt-0.5" />
                    <span className='text-[var(--features-title-color)]'>{t("TT.foot.tit2.3")}</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-[var(--gray-card2)] p-4 rounded-lg shadow-md">
                <div className="bg-[var(--gray-card1)] p-3 rounded mb-3">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-[var(--features-icon-color)]">{t("TT.task.tit.l")}</div>
                    <div className="text-[var(--features-icon-color)] text-sm">{t("TT.task.tit.r")}</div>
                  </div>
                  <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">{t("TT.task1")}</div>
                    <div>{t("TT.task1.1")}</div>
                  </div>
                  <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2 mb-2">
                    <div className="text-sm text-gray-500">{t("TT.task2")}</div>
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-[var(--loginpage-bg2)] flex items-center justify-center mr-1">
                        <span className="text-xs text-[var(--features-icon-color)]">JD</span>
                      </div>
                      <span>John Doe</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">{t("TT.task3")}</div>
                      <div>{t("TT.task3.1")}</div>
                    </div>
                    <div className="bg-[var(--bg-color)] border border-gray-200 rounded p-2">
                      <div className="text-sm text-gray-500">{t("TT.task4")}</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>{t("TT.task4.1")}</span>
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
          <h2 className="text-3xl font-bold mb-4 font-serif">{t("TTFtit")}</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          {t("TTFtitd")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/login" 
              className="bg-[var(--bg-color)] text-[var(--features-icon-color)] hover:bg-[var(--loginpage-bg2)] px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              {t("TTFtitButt")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            
          </div>
          
        </motion.div>
      </div>
    </FeaturePageTemplate>
  );
};

export default TaskTracking;