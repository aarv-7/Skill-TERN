import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type View = 'dashboard' | 'explore' | 'applications' | 'applied-internship' | 'ai-recommendation' | 'ai-suggestions' | 'resume' | 'edit-cv' | 'connect-profiles' | 'add-projects';

const StudentsDashboard = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-blue-600">Skill-TERN</h1>
            <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">Student</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-7">
        {currentView === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h2>
            <h2 className="text-xl font-regular text-gray-800 mb-8">👋 Welcome back, Student</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Explore Internships Card */}
              <div
                onClick={() => setCurrentView('explore')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Explore Internships</h3>
                </div>
                <p className="text-gray-600 text-sm">Browse available internship opportunities</p>
              </div>

              {/* My Applications Card */}
              <div
                onClick={() => setCurrentView('applications')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">My Applications</h3>
                </div>
                <p className="text-gray-600 text-sm">Track your internship applications</p>
              </div>

              {/* AI Suggestions Card */}
              <div
                onClick={() => setCurrentView('ai-suggestions')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">AI Suggestions</h3>
                </div>
                <p className="text-gray-600 text-sm">Get personalized internship recommendations</p>
              </div>

              {/* My Resume Card */}
              <div
                onClick={() => setCurrentView('resume')}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">My Resume</h3>
                </div>
                <p className="text-gray-600 text-sm">Manage and enhance your resume</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'explore' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore Internships</h2>
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
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Resume</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div
                onClick={() => setCurrentView('edit-cv')}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h3 className="text-lg font-bold">Edit CV / AI Suggestions</h3>
                </div>
                <p className="text-blue-100 text-sm">Edit your resume with AI-powered suggestions</p>
              </div>

              <div
                onClick={() => setCurrentView('connect-profiles')}
                className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <h3 className="text-lg font-bold">Connect Profiles</h3>
                </div>
                <p className="text-green-100 text-sm">Link Leetcode, Codeforces, etc.</p>
              </div>

              <div
                onClick={() => setCurrentView('add-projects')}
                className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-bold">Add Projects</h3>
                </div>
                <p className="text-orange-100 text-sm">Showcase your work and projects</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Resume</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Name:</strong> Your Name</p>
                <p><strong>Email:</strong> your.email@example.com</p>
                <p><strong>Skills:</strong> React, TypeScript, Node.js</p>
                <p><strong>Experience:</strong> 2 years</p>
              </div>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Download Resume
              </button>
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

