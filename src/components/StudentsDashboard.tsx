import { useState, useEffect, useRef } from 'react';
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
} from 'recharts';
import { api, getCurrentUser, setCurrentUser, clearToken } from '../api/client';

type View =
  | 'dashboard'
  | 'skillswap'
  | 'swaps'
  | 'chat'
  | 'wallet'
  | 'explore'
  | 'applications'
  | 'resume';

const SLOGAN = "Identify your skill gaps → Swap skills with peers to master them → Earn credits and boost your readiness → Get matched with internships.";

const StudentsDashboard = ({ isDarkMode, toggleDarkMode }: ThemeProps) => {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElementTagNameMap['nav'] | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [teachingSkillId, setTeachingSkillId] = useState('');
  const [learningSkillId, setLearningSkillId] = useState('');
  const [user, setUser] = useState<any>(getCurrentUser());

  // Data states
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [receivedSwaps, setReceivedSwaps] = useState<any[]>([]);
  const [sentSwaps, setSentSwaps] = useState<any[]>([]);
  const [activeSwaps, setActiveSwaps] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>({ credits: 100, transactions: [] });
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [swapModalUser, setSwapModalUser] = useState<any>(null);
  const [selectedOfferSkill, setSelectedOfferSkill] = useState('');
  const [selectedWantSkill, setSelectedWantSkill] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [applyModalInternship, setApplyModalInternship] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const visibleMatches = matches.filter((peer) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      peer.name?.toLowerCase().includes(q) ||
      peer.location?.toLowerCase().includes(q) ||
      peer.bio?.toLowerCase().includes(q) ||
      (peer.skillsToTeach || []).some((s: any) => (s.name || s).toLowerCase().includes(q))
    );
  });

  const switchView = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Fetch current user & data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 6000);
  };

  const refreshData = async () => {
    try {
      const meRes = await api.users.getMe().catch(() => null);
      if (meRes?.user) {
        setUser(meRes.user);
        setCurrentUser(meRes.user);
      }

      const [internRes, appRes, matchRes, skillRes, recRes, sentRes, actRes, wallRes] = await Promise.all([
        api.internships.getAll().catch(() => ({ internships: [] })),
        api.applications.getMy().catch(() => ({ applications: [] })),
        api.users.getMatches().catch(() => ({ matches: [] })),
        api.skills.getAll().catch(() => ({ skills: [] })),
        api.swaps.getReceived().catch(() => ({ requests: [] })),
        api.swaps.getSent().catch(() => ({ requests: [] })),
        api.swaps.getActive().catch(() => ({ requests: [] })),
        api.wallet.get().catch(() => ({ credits: 100, transactions: [] }))
      ]);

      setInternships(internRes.internships || []);
      setApplications(appRes.applications || []);
      setMatches(matchRes.matches || matchRes.users || []);
      setSkills(skillRes.skills || []);
      setReceivedSwaps(recRes.swaps || recRes.requests || []);
      setSentSwaps(sentRes.swaps || sentRes.requests || []);
      setActiveSwaps(actRes.swaps || actRes.requests || []);
      setWallet(wallRes);
    } catch (err) {
      console.warn('Failed to load live data, using mock fallback:', err);
    }
  };

  // Poll chat messages if in chat view
  useEffect(() => {
    if (currentView === 'chat' && chatUser?._id) {
      const loadMessages = async () => {
        try {
          const res = await api.messages.getThread(chatUser._id);
          setMessages(res.messages || []);
        } catch (err) {
          console.warn('Failed to fetch messages:', err);
        }
      };
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [currentView, chatUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatUser?._id) return;
    try {
      await api.messages.send(chatUser._id, newMessage.trim());
      setNewMessage('');
      const res = await api.messages.getThread(chatUser._id);
      setMessages(res.messages || []);
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  const handleSendSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapModalUser || !selectedOfferSkill || !selectedWantSkill) {
      alert('Please select both a skill you can offer and a skill you want to learn.');
      return;
    }
    try {
      await api.swaps.create({
        receiver: swapModalUser._id,
        skillOffered: selectedOfferSkill,
        skillWanted: selectedWantSkill,
        message: swapMessage
      });
      showToast(` Swap request sent to ${swapModalUser.name}!`);
      setSwapModalUser(null);
      setSwapMessage('');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to send swap request');
    }
  };

  const handleAcceptSwap = async (swapId: string) => {
    try {
      await api.swaps.accept(swapId);
      showToast(' Swap request accepted! You can now chat and coordinate learning sessions.');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Error accepting swap');
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      await api.swaps.reject(swapId);
      showToast('Swap request rejected.');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Error rejecting swap');
    }
  };

  const handleCompleteSwap = async (swapId: string) => {
    try {
      await api.swaps.complete(swapId);
      showToast(' Swap marked Complete! +5 Skill Credits earned & Radar Score boosted!');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Error completing swap');
    }
  };

  const handleApplyInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalInternship) return;
    try {
      await api.internships.apply(applyModalInternship._id || applyModalInternship.id, coverLetter);
      showToast(`Application sent to ${applyModalInternship.company}. Your readiness score and completed swaps were included.`);
      setApplyModalInternship(null);
      setCoverLetter('');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Error applying for internship');
    }
  };

  const handleAddProfileSkill = async (list: 'teach' | 'learn') => {
    const skillId = list === 'teach' ? teachingSkillId : learningSkillId;
    if (!skillId) return;
    try {
      const response = await api.users.addSkill(skillId, list);
      setUser(response.user);
      setCurrentUser(response.user);
      if (list === 'teach') setTeachingSkillId('');
      else setLearningSkillId('');
      showToast(list === 'teach' ? 'Skill added to your teaching portfolio.' : 'Skill added to your learning goals.');
    } catch (err: any) {
      showToast(err.message || 'Could not update your skill profile.');
    }
  };

  const handleRemoveProfileSkill = async (skillId: string, list: 'teach' | 'learn') => {
    try {
      const response = await api.users.removeSkill(skillId, list);
      setUser(response.user);
      setCurrentUser(response.user);
      showToast('Skill removed from your profile.');
    } catch (err: any) {
      showToast(err.message || 'Could not remove that skill.');
    }
  };

  // Build Radar Data from user's metrics
  const radarMetrics = user?.radarMetrics || {
    resume: 72,
    skills: 80,
    projects: 65,
    aiMatch: 78,
    consistency: 60,
    interview: 70
  };

  const radarData = [
    { metric: 'Resume', score: radarMetrics.resume ?? 75 },
    { metric: 'Skills', score: radarMetrics.skills ?? 80 },
    { metric: 'Projects', score: radarMetrics.projects ?? 65 },
    { metric: 'Internship Fit', score: radarMetrics.aiMatch ?? 78 },
    { metric: 'Consistency', score: radarMetrics.consistency ?? 60 },
    { metric: 'Interview', score: radarMetrics.interview ?? 70 }
  ];

  const overallScore = Math.round(
    radarData.reduce((acc, curr) => acc + curr.score, 0) / radarData.length
  );

  return (
    <div className="app-dashboard min-h-screen w-full relative z-10 pt-2 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-6 z-50 max-w-md bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">

          <span className="text-sm font-semibold">{notification}</span>
          <button type="button" onClick={() => setNotification(null)} aria-label="Dismiss notification" className="ml-auto rounded-full px-2 py-1 text-white/80 hover:bg-white/15 hover:text-white">×</button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="dashboard-header glass-panel mx-4 sm:mx-6 mb-6 mt-2 sticky top-3 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-3 flex flex-nowrap items-center gap-3 min-w-0">
          {/* Logo & Tag */}
          <div className="flex shrink-0 items-center gap-3 cursor-pointer" onClick={() => switchView('dashboard')}>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Skill-TERN</h1>
                <span className="dashboard-brand-tag hidden xl:inline-flex text-[10px] font-semibold text-blue-700 dark:text-sky-300 bg-blue-100/80 dark:bg-sky-900/50 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-sky-700">
                  Student & Peer Hub
                </span>
              </div>
            </div>
          </div>

        <nav ref={navRef} className="dashboard-nav flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: ' Overview & Radar', mobileLabel: 'Overview' },
            { id: 'skillswap', label: ' SkillSwap & Peer Matching', mobileLabel: 'Peers' },
            { id: 'swaps', label: ` Active Swaps (${activeSwaps.length})`, mobileLabel: `Swaps (${activeSwaps.length})` },
            { id: 'wallet', label: ' Skill Wallet', mobileLabel: 'Wallet' },
            { id: 'explore', label: ` Internships (${internships.length})`, mobileLabel: `Internships (${internships.length})` },
            { id: 'applications', label: ` My Applications (${applications.length})`, mobileLabel: `Apps (${applications.length})` },
            { id: 'resume', label: ' Profile & Skills', mobileLabel: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchView(tab.id as View)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                currentView === tab.id
                  ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
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
                {(user?.name || 'Student').split(/\s+/).map((part: string) => part[0]).slice(0, 2).join('').toUpperCase()}
              </button>
              {profileOpen && (
                <div className="profile-popover absolute right-0 top-full z-50 mt-3 w-72 rounded-xl border p-4 shadow-xl" role="dialog" aria-label="Profile details">
                  <div className="mb-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{user?.name || 'Student'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Student profile</div>
                  </div>
                  <div className="profile-stats-row grid grid-cols-2 gap-2 border-t pt-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Self-reported ID</div>
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.erpId || 'Not linked'}</div>
                    </div>
                    <div className="min-w-0 border-l pl-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Credits</div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                        <svg className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12h8m-5-3 3 3-3 3" /></svg>
                        <span>{user?.credits ?? 100}</span>
                      </div>
                    </div>
                  </div>
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

      {/* Main Content Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Unified Slogan Strip */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200/50 dark:border-blue-700/30 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-sky-400">
                Learning to internship
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {SLOGAN}
              </div>
            </div>
          </div>
          <button
            onClick={() => switchView('skillswap')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all whitespace-nowrap"
          >
            Find a Peer to Swap Skills →
          </button>
        </div>

        {/* ── 1. DASHBOARD & RADAR VIEW ── */}
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Radar Chart (Left 7 Cols) */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                      Profile Readiness Overview
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Readiness Score: {overallScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
                    This demo score combines your profile metrics with recorded peer-swap activity.
                  </p>
                </div>

                <div className="w-full h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="65%" margin={{ top: 12, right: 12, bottom: 16, left: 12 }}>
                      <PolarGrid stroke={'rgb(var(--border))'} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgb(var(--surface))', borderRadius: 12, borderColor: 'rgb(var(--border))' }} />
                      <Radar name="Readiness Score" dataKey="score" stroke="rgb(var(--brand))" fill="rgb(var(--brand))" fillOpacity={0.4} />
                      <Legend wrapperStyle={{ color: 'rgb(var(--text-secondary))' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Metric Summary Chips */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                  {radarData.map((m) => (
                    <div key={m.metric} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{m.metric}</div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-sky-400">{m.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Insights & Actions (Right 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-5">

                {/* Profile Insights Card */}
                <div className="glass-panel p-5 border border-indigo-200/60 dark:border-indigo-800/40">
                  <div className="flex items-center gap-2 mb-3">

                    <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-900 dark:text-slate-100">
                      Suggested next steps
                    </h4>
                  </div>

                  <ul className="space-y-2 mb-4">
                    <li className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-amber-800 dark:text-amber-300"> Interview Readiness Gap</span>
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md font-semibold">Score: {radarMetrics.interview}%</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">Practice live mock interviews with peers to elevate your confidence.</p>
                      <button
                        onClick={() => switchView('skillswap')}
                        className="text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                      >
                         Swap Skills with a Peer to Practice Interviewing →
                      </button>
                    </li>

                    <li className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-blue-800 dark:text-blue-300"> Technical Project Real-world Impact</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-semibold">Score: {radarMetrics.projects}%</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">Partner with another student on a full-stack project or design thinking case study.</p>
                      <button
                        onClick={() => switchView('skillswap')}
                        className="text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                      >
                         Find a Project Collaborator on SkillSwap →
                      </button>
                    </li>

                  </ul>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => switchView('skillswap')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-md transition-all text-center"
                    >
                      Browse Peer Matches
                    </button>
                    <button
                      onClick={() => switchView('explore')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 text-center"
                    >
                      View Internships ({internships.length})
                    </button>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => switchView('swaps')}
                    className="glass-panel p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="text-2xl mb-2"></div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600">Swap Requests</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {receivedSwaps.length} pending • {activeSwaps.length} active
                    </div>
                  </div>

                  <div
                    onClick={() => switchView('wallet')}
                    className="glass-panel p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="text-2xl mb-2"></div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600">Credit Wallet</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {user?.credits ?? 100} credits available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. SKILLSWAP & PEER DISCOVERY VIEW ── */}
        {currentView === 'skillswap' && (
          <div className="glass-panel p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  SkillSwap: Peer Matching
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Compatibility is based on reciprocal skill-list overlaps, with a small bonus when both directions match. It is a simple heuristic, not an AI prediction.
                </p>
              </div>

              {/* Search Box */}
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  aria-label="Search peers by name, skill, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, or location..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Peer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleMatches.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">No peers match that search</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try another name, skill, or location.</p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-4 rounded-full px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : visibleMatches.map((peer) => (
                  <div
                    key={peer._id}
                    className="glass-panel p-5 rounded-xl flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/80 dark:border-slate-700/80 group"
                  >
                    <div>
                      {/* Peer Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={peer.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${peer.name}`}
                            alt={peer.name}
                            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100"
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                              {peer.name}
                            </h4>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                               {peer.location || 'Location not set'} • Skill-TERN member
                            </span>
                          </div>
                        </div>

                        {/* Match Percent Badge */}
                        <div className="text-right">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {peer.matchPercent ?? 0}% Compatibility
                          </span>
                          {typeof peer.rating === 'number' && (
                            <div className="text-[10px] text-amber-500 font-semibold mt-1" aria-label={`Peer rating ${peer.rating}`}>
                              {peer.rating.toFixed(1)} rating
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                        {peer.bio || 'Passionate student eager to collaborate and exchange knowledge.'}
                      </p>

                      {/* Skills Can Teach */}
                      <div className="mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                           Can Teach:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(peer.skillsToTeach || []).map((sk: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                            >
                              {sk.name || sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Skills Wants to Learn */}
                      <div className="mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                           Wants to Learn:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(peer.skillsToLearn || []).map((sk: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40"
                            >
                              {sk.name || sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      disabled={!user?.skillsToTeach?.length || !peer?.skillsToTeach?.length}
                      title={!user?.skillsToTeach?.length || !peer?.skillsToTeach?.length ? 'Both students need a teaching skill in their profile before proposing a swap.' : undefined}
                      onClick={() => {
                        setSwapModalUser(peer);
                        const offer = user?.skillsToTeach?.[0]?._id || user?.skillsToTeach?.[0];
                        const want = peer?.skillsToTeach?.[0]?._id || peer?.skillsToTeach?.[0];
                        setSelectedOfferSkill(String(offer || ''));
                        setSelectedWantSkill(String(want || ''));
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      Propose Skill Swap
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── 3. SWAP REQUESTS & ACTIVE SWAPS VIEW ── */}
        {currentView === 'swaps' && (
          <div className="glass-panel p-6 sm:p-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Skill Swap Management
            </h2>

            {/* Active Swaps Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-emerald-500 font-semibold">●</span>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Active Swaps ({activeSwaps.length})
                </h3>
              </div>

              {activeSwaps.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/40 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                  No active swaps right now. Propose a swap in the Peer Matching tab!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSwaps.map((sw) => {
                    const other = sw.sender?._id === user?._id ? sw.receiver : sw.sender;
                    return (
                      <div key={sw._id} className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                              Swap with {other?.name || 'Peer'}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Accepted & Active
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-4">
                            <div><strong>You Offer:</strong> {sw.skillOffered?.name || 'Subject A'}</div>
                            <div><strong>You Learn:</strong> {sw.skillWanted?.name || 'Subject B'}</div>
                            {sw.message && <div className="italic text-slate-500">"{sw.message}"</div>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => {
                              setChatUser(other);
                              switchView('chat');
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors text-center"
                          >
                             Open Chat
                          </button>
                          <button
                            onClick={() => handleCompleteSwap(sw._id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors text-center"
                          >
                             Mark as Completed (+5 Credits)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Received Requests Section */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
                Received Requests ({receivedSwaps.length})
              </h3>
              {receivedSwaps.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/40 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                  No pending swap requests received.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receivedSwaps.map((sw) => (
                    <div key={sw._id} className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          From: {sw.sender?.name} ({sw.sender?.erpId || 'Student'})
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                        Wants to learn <strong>{sw.skillWanted?.name}</strong> and offers <strong>{sw.skillOffered?.name}</strong>.
                      </p>
                      {sw.message && <p className="text-xs italic text-slate-500 mb-4">"{sw.message}"</p>}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptSwap(sw._id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => handleRejectSwap(sw._id)}
                          className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-semibold hover:bg-slate-300 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
                Sent Requests ({sentSwaps.length})
              </h3>
              {sentSwaps.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/40 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                  No sent requests waiting for response.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sentSwaps.map((sw) => (
                    <div key={sw._id} className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between mb-1 font-semibold">
                        <span>To: {sw.receiver?.name}</span>
                        <span className="text-[10px] text-amber-600">{sw.status}</span>
                      </div>
                      <div className="text-slate-500">
                        Offered: {sw.skillOffered?.name} → Wanted: {sw.skillWanted?.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 4. LIVE CHAT VIEW ── */}
        {currentView === 'chat' && (
          <div className="glass-panel p-6 rounded-xl animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <button onClick={() => switchView('swaps')} className="text-xs font-semibold text-blue-600 hover:underline">
                  ← Back to Swaps
                </button>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Chatting with {chatUser?.name || 'Matched Peer'}
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                Active Swap Session
              </span>
            </div>

            {/* Chat Messages Box */}
            <div className="h-96 overflow-y-auto p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3 mb-4">
              {messages.length === 0 ? (
                <div className="m-auto text-center text-xs text-slate-400">
                  No messages yet. Say hello and coordinate your swap session!
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isMine = m.sender === user?._id || m.sender?._id === user?._id;
                  return (
                    <div
                      key={idx}
                      className={`max-w-[75%] p-3 rounded-xl text-xs leading-relaxed ${
                        isMine
                          ? 'ml-auto bg-blue-600 text-white rounded-br-none shadow-md'
                          : 'mr-auto bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-70 block mt-1 text-right">
                        {new Date(m.timestamp || m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message (e.g. Let's practice calculus problems on Google Meet)..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* ── 5. CREDIT WALLET VIEW ── */}
        {currentView === 'wallet' && (
          <div className="glass-panel p-6 sm:p-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Skill Credits & Transaction Ledger
            </h2>

            {/* Balance Card */}
            <div className="p-6 rounded-xl bg-indigo-600 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-100">Available Balance</span>
                <div className="text-4xl font-semibold mt-1 flex items-center gap-2">
                  <span> {wallet?.credits ?? user?.credits ?? 100}</span>
                  <span className="text-lg font-normal text-amber-100">Skill Credits</span>
                </div>
                <p className="text-xs text-amber-100 mt-2">
                  Members start with 100 Skill Credits. Complete peer swaps to earn +5 bonus credits per completed exchange!
                </p>
              </div>
              <button
                onClick={() => switchView('skillswap')}
                className="px-4 py-2.5 rounded-xl bg-white text-amber-800 font-semibold text-xs hover:bg-amber-50 shadow-md transition-all whitespace-nowrap"
              >
                Earn Credits by Swapping →
              </button>
            </div>

            {/* Transaction History */}
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
              Transaction History
            </h3>
            <div className="space-y-3">
              {(wallet?.transactions || []).length === 0 ? (
                <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                  Your 100-credit welcome bonus is recorded at account creation. ERP or student IDs are not verified by this prototype.
                </div>
              ) : (
                wallet.transactions.map((tx: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">{tx.description || tx.type}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`font-semibold text-sm ${tx.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} Credits
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── 6. EXPLORE INTERNSHIPS VIEW ── */}
        {currentView === 'explore' && (
          <div className="glass-panel p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Explore Internships & Fit Estimates
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fit estimates use a role baseline (30%), profile readiness (40%), listed-skill overlap (20%), and a completed-swap bonus (up to 10 points), clamped to 65–99. This is a transparent heuristic, not an AI prediction or hiring recommendation.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {internships.length === 0 && <div className="rounded-xl border border-white/50 bg-white/35 p-8 text-center text-sm text-slate-600 dark:text-slate-300">No open internships are available right now. Check back when a recruiter posts a role.</div>}
              {internships.map((intern) => (
                <div
                  key={intern._id || intern.id}
                  className="p-6 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{intern.title}</h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {intern.company}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                         {intern.location || 'Pune / Remote'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {intern.description || 'Join our team to build scalable systems, collaborate with engineering leads, and solve real customer problems.'}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 mr-1">Skills:</span>
                      {(intern.requiredSkills || []).map((sk: string, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                       Stipend: {intern.stipend || '₹20,000 / month'} • Duration: {intern.duration || '3-6 Months'}
                    </div>
                  </div>

                  {/* Match Score & Apply */}
                  <div className="flex flex-col items-end gap-3 min-w-[160px]">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800 block">
                        Profile-fit estimate: {intern.matchScore ?? intern.score ?? 0}%
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        +{Math.min(10, (user?.completedSwaps || 0) * 2)}% Swap Bonus
                      </span>
                    </div>

                    <button
                      onClick={() => setApplyModalInternship(intern)}
                      className="w-full py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all text-center"
                    >
                      Apply with Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 7. MY APPLICATIONS VIEW ── */}
        {currentView === 'applications' && (
          <div className="glass-panel p-6 sm:p-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Track My Applications
            </h2>

            {applications.length === 0 ? (
              <div className="p-8 rounded-xl bg-white/40 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                You haven't submitted any internship applications yet. Head over to the Explore tab!
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id || app.id} className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {app.internship?.title || app.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {app.internship?.company || app.company} • Applied on {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-blue-600">
                        Profile-fit estimate: {app.profileFitScore ?? app.aiMatchScore ?? app.score ?? 0}%
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                        app.status === 'shortlisted' || app.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 8. PROFILE & RESUME VIEW ── */}
        {currentView === 'resume' && (
          <div className="glass-panel p-6 sm:p-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              My Profile & Skill Portfolio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                <img
                  src={user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-24 h-24 rounded-xl mb-4 border border-blue-500/30"
                />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{user?.name}</h3>
                <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">{user?.erpId ? `Self-reported ID: ${user.erpId}` : 'No student ID linked'}</span>
                <p className="text-xs text-slate-500 mt-2">{user?.bio || 'Passionate student learner'}</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">Skills I Can Teach</h4>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(user?.skillsToTeach || []).map((sk: any, i: number) => (
                      <span key={sk._id || sk || i} className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {sk.name || sk}
                        <button type="button" aria-label={`Remove ${sk.name || 'skill'} from teaching skills`} className="ml-1 min-h-0 rounded-full px-1 text-current opacity-70 hover:opacity-100" onClick={() => handleRemoveProfileSkill(String(sk._id || sk), 'teach')}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select aria-label="Add a skill you can teach" value={teachingSkillId} onChange={(e) => setTeachingSkillId(e.target.value)} className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs dark:text-white">
                      <option value="">Choose a skill to teach</option>
                      {Array.from(new Set(skills.map((skill) => skill.category))).map((category) => (
                        <optgroup key={category} label={category}>
                          {skills.filter((skill) => skill.category === category && !(user?.skillsToTeach || []).some((item: any) => String(item._id || item) === String(skill._id))).map((skill) => <option key={skill._id} value={skill._id}>{skill.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <button type="button" disabled={!teachingSkillId} onClick={() => handleAddProfileSkill('teach')} className="rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white disabled:opacity-50">Add</button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">Skills I Want to Learn</h4>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(user?.skillsToLearn || []).map((sk: any, i: number) => (
                      <span key={sk._id || sk || i} className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {sk.name || sk}
                        <button type="button" aria-label={`Remove ${sk.name || 'skill'} from learning goals`} className="ml-1 min-h-0 rounded-full px-1 text-current opacity-70 hover:opacity-100" onClick={() => handleRemoveProfileSkill(String(sk._id || sk), 'learn')}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select aria-label="Add a skill you want to learn" value={learningSkillId} onChange={(e) => setLearningSkillId(e.target.value)} className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs dark:text-white">
                      <option value="">Choose a learning goal</option>
                      {Array.from(new Set(skills.map((skill) => skill.category))).map((category) => (
                        <optgroup key={category} label={category}>
                          {skills.filter((skill) => skill.category === category && !(user?.skillsToLearn || []).some((item: any) => String(item._id || item) === String(skill._id))).map((skill) => <option key={skill._id} value={skill._id}>{skill.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <button type="button" disabled={!learningSkillId} onClick={() => handleAddProfileSkill('learn')} className="rounded-xl bg-indigo-600 px-3 text-xs font-semibold text-white disabled:opacity-50">Add</button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Activity & Readiness
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><strong>Completed Swaps:</strong> {user?.completedSwaps ?? 0} exchanges</div>
                    <div><strong>Peer Rating:</strong>  {user?.rating ?? 0} / 5.0</div>
                    <div><strong>Skill Credits:</strong>  {user?.credits ?? 0}</div>
                    <div><strong>Readiness Score:</strong> {overallScore}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL: PROPOSE SKILL SWAP ── */}
      {swapModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-xl max-w-lg w-full shadow-2xl bg-white dark:bg-slate-900 border border-blue-500/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Propose Skill Swap with {swapModalUser.name}
              </h3>
              <button type="button" aria-label="Close swap request" onClick={() => setSwapModalUser(null)} className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">×</button>
            </div>

            <form onSubmit={handleSendSwap} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Skill You Offer (From Your Portfolio)
                </label>
                <select
                  value={selectedOfferSkill}
                  onChange={(e) => setSelectedOfferSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  required
                >
                  <option value="">Select skill you can teach...</option>
                  {(user?.skillsToTeach || []).map((s: any) => (
                    <option key={s._id || s} value={s._id || s}>{s.name || s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Skill You Want to Learn from {swapModalUser.name}
                </label>
                <select
                  value={selectedWantSkill}
                  onChange={(e) => setSelectedWantSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  required
                >
                  <option value="">Select skill you want to learn...</option>
                  {(swapModalUser.skillsToTeach || []).map((s: any) => (
                    <option key={s._id || s} value={s._id || s}>{s.name || s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Message / Goal
                </label>
                <textarea
                  rows={3}
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  placeholder="Hey, let's swap skills to solve practice assignments and boost our interview readiness!"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSwapModalUser(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg"
                >
                  Send Swap Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: APPLY FOR INTERNSHIP ── */}
      {applyModalInternship && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-xl max-w-lg w-full shadow-2xl bg-white dark:bg-slate-900 border border-blue-500/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Apply for {applyModalInternship.title}
                </h3>
                <p className="text-xs text-blue-600 dark:text-sky-400 font-semibold">
                  {applyModalInternship.company} • Profile-fit estimate: {applyModalInternship.matchScore ?? 0}%
                </p>
              </div>
              <button type="button" aria-label="Close application form" onClick={() => setApplyModalInternship(null)} className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">×</button>
            </div>

            <form onSubmit={handleApplyInternship} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300">
                 <strong>Application profile summary:</strong><br />
                Your readiness score ({overallScore}%), {user?.completedSwaps ?? 0} completed peer swaps, and skill portfolio will be included.
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Cover Note / Pitch
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, mention key projects, and highlight how peer collaboration has prepared you for this role..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalInternship(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsDashboard;
