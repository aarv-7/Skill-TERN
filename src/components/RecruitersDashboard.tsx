import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

interface RecruitersDashboardProps {
  onLogout: () => void;
}

type View = 'dashboard' | 'post-internship' | 'view-applications' | 'ai-shortlisting' | 'manual-screening' | 'statistics';

const RecruitersDashboard = ({ onLogout }: RecruitersDashboardProps) => {
  //const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [applications] = useState([
    { id: 1, name: 'Rishabh Shah', email: 'rishi@example.com', status: 'pending', score: 85 },
    { id: 2, name: 'Rakshit Chauhan', email: 'rakshit@example.com', status: 'pending', score: 92 },
    { id: 3, name: 'Neleema Bansal', email: 'neelema@example.com', status: 'rejected', score: 65 },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-blue-600">Skill-TERN</h1>
            <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">Recruiter</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Recruiters Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Post New Internship Card */}
              <div
                onClick={() => setCurrentView('post-internship')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Post New Internship</h3>
                </div>
                <p className="text-gray-600">Create and publish a new internship opportunity</p>
              </div>

              {/* View Applications Card */}
              <div
                onClick={() => setCurrentView('view-applications')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">View Applications</h3>
                </div>
                <p className="text-gray-600">Review and manage all internship applications</p>
              </div>

              {/* Recruitment Statistics Card */}
              <div
                onClick={() => setCurrentView('statistics')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Recruitment Statistics</h3>
                </div>
                <p className="text-gray-600">View analytics and insights on your recruitment</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'post-internship' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Post New Internship</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Internship Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="e.g., Software Engineering Intern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Describe the internship role, responsibilities, and requirements..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="e.g., 3 months"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stipend</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="e.g., $1000/month"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="e.g., React, TypeScript, Node.js"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                Post Internship
              </button>
            </form>
          </div>
        )}

        {currentView === 'view-applications' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">View Applications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div
                onClick={() => setCurrentView('ai-shortlisting')}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-xl font-bold">AI Shortlisting</h3>
                </div>
                <p className="text-blue-100">Let AI automatically filter and rank applicants</p>
              </div>

              <div
                onClick={() => setCurrentView('manual-screening')}
                className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="text-xl font-bold">Manual Screening</h3>
                </div>
                <p className="text-green-100">Review rejected applicants manually</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">All Applications</h3>
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{app.name}</h4>
                      <p className="text-sm text-gray-600">{app.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Score: {app.score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'ai-shortlisting' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('view-applications')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Applications
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Shortlisting</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">AI-Powered Ranking</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Our AI analyzes applications based on skills, experience, and match quality to provide ranked recommendations.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Run AI Shortlisting
              </button>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Ranked Applications</h3>
              {[...applications].sort((a, b) => b.score - a.score).map((app) => (
                <div key={app.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{app.name}</h4>
                      <p className="text-sm text-gray-600">{app.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        AI Score: {app.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'manual-screening' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('view-applications')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Applications
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manual Screening of Rejected Applicants</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">
                Review rejected applicants to ensure no qualified candidates were missed. Insights from this review can help improve future internship postings.
              </p>
            </div>
            <div className="space-y-4">
              {applications.filter(app => app.status === 'rejected').map((app) => (
                <div key={app.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{app.name}</h4>
                      <p className="text-sm text-gray-600">{app.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Reconsider
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {applications.filter(app => app.status === 'rejected').length === 0 && (
                <p className="text-gray-600 text-center py-8">No rejected applicants to review.</p>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => setCurrentView('post-internship')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Post New Internship (with insights)
              </button>
            </div>
          </div>
        )}

        {currentView === 'statistics' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Recruitment Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applications</h3>
                <p className="text-3xl font-bold text-blue-600">24</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Shortlisted</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Average Score</h3>
                <p className="text-3xl font-bold text-purple-600">78</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Trends</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart visualization would go here
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitersDashboard;

