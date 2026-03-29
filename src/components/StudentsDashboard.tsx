import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProps } from '../App';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

const radarData = [
  { metric: "Resume", score: 72 },
  { metric: "Skills", score: 80 },
  { metric: "Projects", score: 65 },
  { metric: "AI Match", score: 78 },
  { metric: "Consistency", score: 60 },
  { metric: "Interview", score: 70 },
];

type View = 'dashboard' | 'explore' | 'applications' | 'applied-internship' | 'ai-recommendation' | 'ai-suggestions' | 'resume' | 'edit-cv' | 'connect-profiles' | 'add-projects';

const StudentsDashboard = ({ isDarkMode, toggleDarkMode }: ThemeProps) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [internships] = useState([
    { id: 1, title: 'Software Engineering Intern', company: 'Tech Corp', score: 95 },
    { id: 2, title: 'Data Science Intern', company: 'Data Inc', score: 88 },
    { id: 3, title: 'Frontend Developer Intern', company: 'Web Solutions', score: 82 },
  ]);
  const [applications] = useState([
    { id: 1, title: 'Software Engineering Intern', company: 'Tech Corp', status: 'applied' },
    { id: 2, title: 'Data Science Intern', company: 'Data Inc', status: 'pending' },
  ]);

const insights = [
  {
    type: "good",
    text: "Strong resume and skills profile",
  },
  {
    type: "warning",
    text: "Projects section needs stronger real-world impact",
  },
  {
    type: "info",
    text: "Interview readiness can be improved with mock practice",
  },
];

const actions = [
  {
    label: "Improve Resume",
    action: () => setCurrentView("resume"),
  },
  {
    label: "Add Projects",
    action: () => setCurrentView("add-projects"),
  },
  {
    label: "View AI Suggestions",
    action: () => setCurrentView("ai-suggestions"),
  },
];

  return (
    <div className="min-h-screen w-full relative z-10 pt-4 pb-12">
      {/* Header */}
      <header className="glass-panel mx-6 mb-8 mt-2 sticky top-4 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-blue-700 dark:text-sky-400 tracking-tight">Skill-TERN</h1>
            <span className="text-xs font-semibold text-blue-700 dark:text-sky-300 bg-blue-100/80 dark:bg-sky-900/50 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-200 dark:border-sky-700">Student Area</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">Dashboard Overview</h2>
            
            {/* Main Container - Split Left and Right */}
            <div className="flex gap-6 h-[calc(100vh-220px)]">
              
              {/* LEFT HALF - RADAR GRAPH SECTION */}
              <div className="w-1/2 glass-panel p-8 flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                  Profile Evaluation
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                  AI-based multi-dimensional student assessment
                </p>

                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                    <PolarGrid stroke={isDarkMode ? "#334155" : "#e5e7eb"} />
                     <PolarAngleAxis dataKey="metric" tick={{ fill: isDarkMode ? "#e2e8f0" : "#23272eff", fontSize: 17 }}/>
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false}/>
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1e293b" : "#fff", borderColor: isDarkMode ? "#334155" : "#e5e7eb", color: isDarkMode ? "#fff" : "#000" }}/>

                     <Radar
                     name="Score"
                     dataKey="score"
                     stroke="#38bdf8"
                     fill="#38bdf8"
                     fillOpacity={0.4}
                     />
                      <Legend wrapperStyle={{ color: isDarkMode ? "#e2e8f0" : "#000" }}/>
                      </RadarChart>
                    </ResponsiveContainer>
                    </div>

                      {/* Overall Score */}
                     <div className="mt-4 flex justify-center gap-6">
                     <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">71</p>
                   <p className="text-sm text-gray-500">Overall Score</p>
                  </div>
                 </div>
                </div>

              {/* RIGHT HALF - BUTTONS SECTION */}
              <div className="w-1/2 flex justify-start">
              <div className="w-full flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* AI INSIGHTS CARD */}
              <div className="col-span-2 bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-indigo-900/40 dark:to-blue-900/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-indigo-100/50 dark:border-indigo-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <svg className="w-32 h-32 text-indigo-600 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-wider relative z-10">
                <span className="p-1.5 bg-indigo-100 rounded-lg">✨</span> Smart AI Insights
              </h3> 

              {/* Insights */}
              <ul className="space-y-3 mb-6 relative z-10">
              {insights.map((insight, index) => (
             <li
             key={index}
             className={`text-sm flex items-start gap-3 p-3 rounded-xl bg-white/60 shadow-sm border ${ insight.type === "good" ? "border-green-100 text-green-800" : insight.type === "warning" ? "border-amber-100 text-amber-800" : "border-blue-100 text-blue-800"}`}
             >
            <span className="text-lg leading-none mt-0.5">{insight.type === "good" ? "✓" : insight.type === "warning" ? "!" : "i"}</span>
            <span className="font-medium">{insight.text}</span>
            </li>
            ))} </ul>

           {/* Next Actions */}
           <h4 className="text-xs font-bold text-indigo-800 mb-3 uppercase tracking-wider relative z-10"> 🎯 Recommended Next Steps </h4>

            <div className="flex flex-wrap gap-2 relative z-10">
            {actions.map((item, index) => (
            <button
             key={index}
             onClick={item.action}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:scale-[1.02] transition-all duration-300 shadow-sm">
             {item.label}
             </button>
              ))}
             </div>
              </div>
                  
                {/* Explore Internships Card */}
                <div
                  onClick={() => setCurrentView('explore')}
                  className="glass-panel p-5 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="bg-blue-50 dark:bg-blue-900/40 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Explore Internships</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Browse available internship opportunities</p>
                </div>

                {/* My Applications Card */}
                <div
                  onClick={() => setCurrentView('applications')}
                  className="glass-panel p-5 cursor-pointer hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-500/5 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="bg-green-50 dark:bg-green-900/40 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">My Applications</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Track your internship applications</p>
                </div>

                {/* AI Suggestions Card */}
                <div
                  onClick={() => setCurrentView('ai-suggestions')}
                  className="glass-panel p-5 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="bg-purple-50 dark:bg-purple-900/40 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">AI Suggestions</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Get personalized internship recommendations</p>
                </div>

                {/* My Resume Card */}
                <div
                  onClick={() => setCurrentView('resume')}
                  className="glass-panel p-5 cursor-pointer hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="bg-orange-50 dark:bg-orange-900/40 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">My Resume</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage and enhance your resume</p>
                </div>
                </div>
              </div>
            </div>
            
          </div>
          </div>
        )}

        {currentView === 'explore' && (
          <div className="glass-panel p-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Explore Internships</h2>
            <div className="space-y-4">
              {internships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{internship.title}</h3>
                      <p className="text-gray-600 mt-1">{internship.company}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'applications' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div
                onClick={() => setCurrentView('applied-internship')}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-bold">Applied Internship</h3>
                </div>
                <p className="text-blue-100">View details of your applied internships</p>
              </div>

              <div
                onClick={() => setCurrentView('ai-recommendation')}
                className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-xl font-bold">AI Recommendation</h3>
                </div>
                <p className="text-purple-100">Get AI-powered recommendations for your applications</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Your Applications</h3>
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{app.title}</h4>
                      <p className="text-sm text-gray-600">{app.company}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === 'applied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'applied-internship' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('applications')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Applications
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Applied Internship Details</h2>
            {applications.filter(app => app.status === 'applied').map((app) => (
              <div key={app.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-4">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{app.title}</h3>
                <p className="text-gray-600 mb-4">Company: {app.company}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><strong>Status:</strong> <span className="text-green-600">Applied</span></p>
                  <p className="text-sm text-gray-600"><strong>Applied Date:</strong> March 15, 2024</p>
                  <p className="text-sm text-gray-600"><strong>Application ID:</strong> #{app.id}234</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'ai-recommendation' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('applications')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Applications
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Recommendation</h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Personalized Recommendations</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Based on your profile, skills, and application history, here are our AI-powered recommendations:
              </p>
            </div>
            <div className="space-y-4">
              {internships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{internship.title}</h4>
                      <p className="text-sm text-gray-600">{internship.company}</p>
                      <p className="text-sm text-purple-600 mt-2">Match Score: {internship.score}%</p>
                    </div>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'ai-suggestions' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Suggestions</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Smart Recommendations</h3>
              </div>
              <p className="text-gray-700">
                Discover internships that match your skills, interests, and career goals.
              </p>
            </div>
            <div className="space-y-4">
              {internships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{internship.title}</h4>
                      <p className="text-sm text-gray-600">{internship.company}</p>
                      <p className="text-sm text-blue-600 mt-2">Recommended for you - {internship.score}% match</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'resume' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Resume</h2>
            </div>

            {/* Main Layout - 2 Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* LEFT COLUMN - Profile Overview */}
              <div className="space-y-6">

                {/* Profile Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    {/* Avatar with Initials */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      YN
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Name</h3>
                      <p className="text-slate-600 dark:text-slate-400">Aspiring Software Engineer</p>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript'].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Experience</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Frontend Developer Intern</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Tech Company • 2023 - Present</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Personal Projects</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Self-taught development • 2022 - 2023</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked Profiles Section */}
                <div className="bg-white/50 backdrop-blur-lg border border-white/20 rounded-xl shadow-sm p-4 hover:shadow-md transition-all">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Linked Profiles</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'GitHub', icon: 'GH', connected: false },
                      { name: 'LeetCode', icon: 'LC', connected: false },
                      { name: 'Codeforces', icon: 'CF', connected: true },
                      { name: 'LinkedIn', icon: 'LI', connected: false }
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                            {platform.icon}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">{platform.name}</span>
                        </div>
                        <button
                          onClick={() => setCurrentView('connect-profiles')}
                          className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                            platform.connected
                              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                              : 'text-blue-600 dark:text-sky-400 hover:underline'
                          }`}
                        >
                          {platform.connected ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                    <span className="text-green-500">+5</span> score boost per connected profile
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentView('edit-cv')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    Improve Resume
                  </button>
                  <button
                    onClick={() => setCurrentView('add-projects')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    Add Projects
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN - AI Insights & Score */}
              <div className="space-y-6">

                {/* AI Resume Analysis Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    AI Resume Analysis
                  </h3>

                  {/* Overall Score */}
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-blue-600 dark:text-sky-400 mb-2">71</div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Overall Score</p>
                  </div>

                  {/* Insights */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">Strength</p>
                        <p className="text-sm text-green-700 dark:text-green-400">Strong technical skills and project experience</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                      <span className="text-orange-600 text-xl">⚠</span>
                      <div>
                        <p className="font-semibold text-orange-800 dark:text-orange-300">Weakness</p>
                        <p className="text-sm text-orange-700 dark:text-orange-400">Limited professional experience</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <span className="text-blue-600 text-xl">💡</span>
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300">Suggestion</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">Add more quantifiable achievements</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Strength Indicator */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Profile Strength</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-sky-400">71%</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {currentView === 'edit-cv' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('resume')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Resume
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit CV / AI Suggestions</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">AI-Powered Resume Enhancement</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Get AI suggestions to improve your resume and make it stand out to recruiters.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Get AI Suggestions
              </button>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="List your skills (e.g., React, Python, Machine Learning)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Describe your work experience and projects..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {currentView === 'connect-profiles' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('resume')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Resume
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Connect Your Profiles</h2>
            <p className="text-gray-600 mb-6">Link your coding profiles to showcase your skills and achievements</p>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">GitHub</h3>
                      <p className="text-sm text-gray-600">Connect your GitHub profile</p>
                    </div>
                  </div>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-yellow-600">LC</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">LeetCode</h3>
                      <p className="text-sm text-gray-600">Link your LeetCode profile</p>
                    </div>
                  </div>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-red-600">CF</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Codeforces</h3>
                      <p className="text-sm text-gray-600">Link your Codeforces profile</p>
                    </div>
                  </div>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">LinkedIn</h3>
                      <p className="text-sm text-gray-600">Connect your LinkedIn profile</p>
                    </div>
                  </div>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'add-projects' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('resume')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Resume
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Your Projects</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="e.g., E-commerce Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Describe your project, technologies used, and key features..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project URL (Optional)</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="https://your-project.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository (Optional)</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="https://github.com/username/project"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                Add Project
              </button>
            </form>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800">Sample Project</h4>
                  <p className="text-sm text-gray-600 mt-1">A web application built with React and Node.js</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsDashboard;

