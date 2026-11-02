import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProps } from '../App';
import { api, getCurrentUser, clearToken } from '../api/client';

type View = 'dashboard' | 'post-internship' | 'view-applications' | 'shortlisted';

const SLOGAN = "Identify your skill gaps → Swap skills with peers to master them → Earn credits and boost your readiness → Get matched with internships.";

const RecruitersDashboard = ({ isDarkMode, toggleDarkMode }: ThemeProps) => {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElementTagNameMap['nav'] | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [user] = useState<any>(getCurrentUser());

  // Data states
  const [applications, setApplications] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for posting internship
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user?.company || '');
  const [location, setLocation] = useState('Pune / Hybrid');
  const [type, setType] = useState('Internship');
  const [duration, setDuration] = useState('3 Months');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [requiredSkills, setRequiredSkills] = useState('React, TypeScript, Node.js, Problem Solving');
  const [description, setDescription] = useState('');

  const switchView = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appRes, intRes] = await Promise.all([
        api.applications.getRecruiter().catch(() => ({ applications: [] })),
        api.internships.getMine().catch(() => ({ internships: [] }))
      ]);

      setApplications(appRes?.applications || []);
      setInternships(intRes?.internships || []);
    } catch (err) {
      console.warn('Error loading recruiter data:', err);
    }
  };

  const handlePostInternship = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !company) {
      alert('Title and company are required.');
      return;
    }

    try {
      await api.internships.create({
        title,
        company,
        location,
        type,
        duration,
        stipend,
        requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        description
      });

      showToast(` New Internship "${title}" published successfully!`);
      setTitle('');
      setDescription('');
      switchView('dashboard');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to post internship');
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.applications.updateStatus(appId, newStatus);
      showToast(`Applicant status updated to ${newStatus.toUpperCase()}`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Could not update applicant status. Please try again.');
    }
  };

  const shortlistedCount = applications.filter(a => a.status === 'shortlisted' || a.status === 'accepted').length;
  const averageRating = applications.length
    ? (applications.reduce((sum, application) => sum + Number(application.applicant?.rating || 0), 0) / applications.length).toFixed(1)
    : '—';
  const visibleApplications = applications.filter(
    (application) => currentView !== 'shortlisted' || application.status === 'shortlisted' || application.status === 'accepted'
  );

  return (
    <div className="app-dashboard min-h-screen w-full relative z-10 pt-2 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-6 z-50 max-w-md bg-indigo-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">

          <span className="text-sm font-semibold">{notification}</span>
          <button onClick={() => setNotification(null)} aria-label="Dismiss notification" className="ml-auto rounded-full px-2 py-1 text-white/80 hover:bg-white/15 hover:text-white">×</button>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header glass-panel mx-4 sm:mx-6 mb-6 mt-2 sticky top-3 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-3 flex flex-nowrap items-center gap-3 min-w-0">
          <div className="flex shrink-0 items-center gap-3 cursor-pointer" onClick={() => switchView('dashboard')}>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Skill-TERN</h1>
                <span className="dashboard-brand-tag hidden xl:inline-flex text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/50 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  Recruiter & Hiring Portal
                </span>
              </div>
            </div>
          </div>

        <nav ref={navRef} className="dashboard-nav flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: ' Recruiter Overview', mobileLabel: 'Overview' },
            { id: 'view-applications', label: ` Candidate Applicants (${applications.length})`, mobileLabel: `Applicants (${applications.length})` },
            { id: 'shortlisted', label: ` Shortlisted (${shortlistedCount})`, mobileLabel: `Shortlist (${shortlistedCount})` },
            { id: 'post-internship', label: ' Post New Internship', mobileLabel: 'Post Role' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchView(tab.id as View)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                currentView === tab.id
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </nav>
          <button type="button" className="nav-scroll-hint shrink-0" aria-label="Show more navigation tabs" title="Scroll to more tabs" onClick={() => navRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7.5 4 6 6-6 6" /></svg>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="theme-toggle flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
            >
              <svg className={`h-5 w-5 ${isDarkMode ? 'theme-icon is-sun' : 'theme-icon is-moon'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {isDarkMode ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></> : <path d="M20.8 14.1A8.4 8.4 0 0 1 9.9 3.2 8.6 8.6 0 1 0 20.8 14.1Z" />}
              </svg>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-label="Open profile details"
                className="profile-trigger flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
              >
                {(user?.name || 'Recruiter').split(/\s+/).map((part: string) => part[0]).slice(0, 2).join('').toUpperCase()}
              </button>
              {profileOpen && (
                <div className="profile-popover absolute right-0 top-full z-50 mt-3 w-72 rounded-xl border p-4 shadow-xl" role="dialog" aria-label="Profile details">
                  <div className="font-semibold text-slate-900 dark:text-white">{user?.name || 'Recruiter'}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user?.company || 'Tech Corp'} · Recruiter profile</div>
                </div>
              )}
            </div>
            <button
              onClick={() => { clearToken(); navigate('/'); }}
              aria-label="Sign out"
              title="Sign out"
              className="signout-control px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
            >
              <span className="signout-label">Sign out</span>
              <svg className="signout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>
            </button>
          </div>
        </div>


      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Unified Slogan Strip */}
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/50 dark:border-indigo-700/30 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Hiring with Skill-TERN
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {SLOGAN}
              </div>
            </div>
          </div>
          <button
            onClick={() => switchView('post-internship')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all whitespace-nowrap"
          >
            + Post Placement Role
          </button>
        </div>

        {/* ── 1. DASHBOARD OVERVIEW ── */}
        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Applicants</span>
                <div className="text-3xl font-semibold text-slate-900 dark:text-white mt-1">{applications.length}</div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Student applications</span>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Shortlisted / offered</span>
                <div className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{shortlistedCount}</div>
                <span className="text-[10px] text-indigo-500 font-semibold mt-1 block">Updated by your team</span>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Active Listings</span>
                <div className="text-3xl font-semibold text-purple-600 dark:text-purple-400 mt-1">{internships.length}</div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Open roles</span>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Avg. Profile Rating</span>
                <div className="text-3xl font-semibold text-amber-500 mt-1">{averageRating}</div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Applicant peer ratings</span>
              </div>
            </div>

            {/* Candidate Review Feed */}
            <div className="glass-panel p-6 sm:p-8 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Candidate Applications</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fit estimates are heuristics. Profile metrics and peer ratings include demo or self-reported data and should be reviewed directly.
                  </p>
                </div>
                <button
                  onClick={() => switchView('view-applications')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View All ({applications.length}) →
                </button>
              </div>

              <div className="space-y-4">
                {applications.length === 0 && <div className="rounded-xl border border-white/50 bg-white/35 p-8 text-center text-sm text-slate-600 dark:text-slate-300">No applications yet. Publish an open role to receive student applications.</div>}
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={app.applicant?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${app.applicant?.name}`}
                        alt={app.applicant?.name}
                        className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{app.applicant?.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {app.applicant?.erpId ? `Self-reported ID: ${app.applicant.erpId}` : 'No student ID'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Applied for: <strong>{app.internship?.title || 'Internship'}</strong> • {app.applicant?.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200">
                             {app.applicant?.completedSwaps ?? app.verifiedSwaps ?? 0} Completed Peer Swaps
                          </span>
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                             {app.applicant?.rating ?? 0} Peer Rating
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-xl border border-indigo-200 block">
                          Profile-fit estimate: {app.profileFitScore ?? app.aiMatchScore ?? 0}%
                        </span>
                        <span className={`text-[10px] font-semibold uppercase mt-1 block ${
                          app.status === 'shortlisted' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status !== 'shortlisted' && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all"
                          >
                            Shortlist
                          </button>
                        )}
                        {app.status !== 'accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'accepted')}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all"
                          >
                            Hire
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. VIEW APPLICATIONS & SHORTLIST ── */}
        {(currentView === 'view-applications' || currentView === 'shortlisted') && (
          <div className="glass-panel p-6 sm:p-8 rounded-xl animate-in fade-in duration-300">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              {currentView === 'shortlisted' ? 'Shortlisted Candidates' : 'Candidate Applications Management'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Fit estimates are heuristics based on the applicant profile, role skills, and completed swaps. They are not AI predictions or hiring recommendations.
            </p>

            <div className="space-y-4">
              {visibleApplications.length === 0 && <div className="rounded-xl border border-white/50 bg-white/35 p-8 text-center text-sm text-slate-600 dark:text-slate-300">{currentView === 'shortlisted' ? 'No candidates have been shortlisted yet.' : 'No applications yet. Publish an open role to receive student applications.'}</div>}
              {visibleApplications.map((app) => (
                  <div
                    key={app._id}
                    className="p-6 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.applicant?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${app.applicant?.name}`}
                          alt={app.applicant?.name}
                          className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <h4 className="text-base font-semibold text-slate-900 dark:text-white">{app.applicant?.name}</h4>
                          <span className="text-xs text-slate-500">
                            {app.applicant?.erpId ? `Self-reported ID: ${app.applicant.erpId}` : 'No student ID'} • {app.applicant?.email} • {app.applicant?.location || 'Location not set'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                          Profile-fit estimate: {app.profileFitScore ?? app.aiMatchScore ?? 0}%
                        </span>
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase ${
                          app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Radar Profile Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Resume Quality</span>
                        <span className="font-semibold text-blue-600">{app.applicant?.radarMetrics?.resume ?? 0}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Skills Portfolio</span>
                        <span className="font-semibold text-blue-600">{app.applicant?.radarMetrics?.skills ?? 0}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Real-world Projects</span>
                        <span className="font-semibold text-blue-600">{app.applicant?.radarMetrics?.projects ?? 0}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Interview Readiness</span>
                        <span className="font-semibold text-blue-600">{app.applicant?.radarMetrics?.interview ?? 0}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Consistency Score</span>
                        <span className="font-semibold text-blue-600">{app.applicant?.radarMetrics?.consistency ?? 0}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Completed Swaps</span>
                        <span className="font-semibold text-emerald-600"> {app.applicant?.completedSwaps ?? app.verifiedSwaps ?? 0}</span>
                      </div>
                    </div>

                    {/* Cover Note */}
                    {app.coverLetter && (
                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-slate-800 border border-blue-100 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Candidate Pitch:</strong> "{app.coverLetter}"
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                      >
                        Shortlist Candidate
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'accepted')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        Extend Offer
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'rejected')}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-semibold hover:bg-slate-300"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── 3. POST NEW INTERNSHIP VIEW ── */}
        {currentView === 'post-internship' && (
          <div className="glass-panel p-6 sm:p-8 rounded-xl animate-in fade-in duration-300 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Post Placement / Internship Opportunity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Published roles become discoverable to students. Profile-fit estimates use a transparent heuristic based on self-reported skills and readiness; they are not verified or hiring recommendations.
            </p>

            <form onSubmit={handlePostInternship} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Internship Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Tech Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Location / Mode
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Pune / Hybrid"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time Placement</option>
                    <option value="Remote Project">Remote Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="6 Months"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Stipend
                </label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="₹25,000 / month"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js, C++"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Role Description & Scope
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key responsibilities, mentorship provided, and eligibility criteria..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => switchView('dashboard')}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg"
                >
                  Publish Internship Role
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitersDashboard;
