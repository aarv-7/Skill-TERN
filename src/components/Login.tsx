import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProps } from '../App';
import { api, setToken, setCurrentUser } from '../api/client';

export type UserRole = 'student' | 'recruiter';

interface LoginProps extends ThemeProps {}

const Login = ({ isDarkMode, toggleDarkMode }: LoginProps) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performLogin = async (idVal?: string, passVal?: string, forcedRole?: UserRole) => {
    const loginId = (idVal !== undefined ? idVal : identifier).trim();
    const loginPass = (passVal !== undefined ? passVal : password).trim();
    const activeRole = forcedRole || role;

    if (!loginId || !loginPass) {
      setError('Please provide your login credentials.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.auth.login(loginId, loginPass);
      setToken(res.token);
      setCurrentUser(res.user);

      const targetRole = res.user?.role || activeRole;
      if (targetRole === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setError(err?.status ? err.message : 'Skill-TERN could not reach the server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const performRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !username || !identifier || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.auth.register({
        name,
        username,
        email: identifier,
        password,
        confirmPassword: password,
        role,
        company: role === 'recruiter' ? company : undefined
      });

      setToken(res.token);
      setCurrentUser(res.user);
      if (res.user?.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (emailVal: string, passVal: string, demoRole: UserRole) => {
    setIdentifier(emailVal);
    setPassword(passVal);
    setRole(demoRole);
    performLogin(emailVal, passVal, demoRole);
  };

  return (
    <div className="login-page min-h-screen flex flex-col justify-center relative z-10 px-4 py-20 md:py-12">
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="theme-toggle flex h-10 w-10 items-center justify-center rounded-full glass-panel text-slate-700 dark:text-slate-200"
        >
          <svg className={`h-5 w-5 ${isDarkMode ? 'theme-icon is-sun' : 'theme-icon is-moon'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isDarkMode ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></> : <path d="M20.8 14.1A8.4 8.4 0 0 1 9.9 3.2 8.6 8.6 0 1 0 20.8 14.1Z" />}
          </svg>
        </button>
      </div>

      {/* Main Container */}
      <div className="login-layout relative z-20 grid w-full max-w-6xl mx-auto items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:gap-20">
        {/* Brand Header */}
        <div className="login-intro text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-black dark:text-white mb-5 tracking-tight">
            Skill-TERN
          </h1>

          <p className="mt-2 max-w-2xl text-xl sm:text-2xl leading-relaxed text-slate-700 dark:text-slate-200">
            Identify your skill gaps <span aria-hidden="true">·</span> Swap skills with peers to master them <span aria-hidden="true">·</span> Earn credits and boost your readiness <span aria-hidden="true">·</span> Get matched with internships.
          </p>
        </div>

        {/* Auth Panel */}
        <div className="glass-panel login-card p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Role Toggle */}
          <div className="role-toggle inline-flex w-fit p-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-full border border-white/60 dark:border-white/10 shadow-inner mb-6" role="group" aria-label="Choose account type">
            <button
              type="button"
              onClick={() => setRole('student')}
              aria-label="Student account"
              title="Student account"
              aria-pressed={role === 'student'}
              className={`role-icon-button flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                role === 'student'
                  ? 'is-selected bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20v-1.2a6.5 6.5 0 0 1 13 0V20M4 5.5l8-3 8 3-8 3-8-3Zm3 1.2v4.1c2.8 2 7.2 2 10 0V6.7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              aria-label="Recruiter account"
              title="Recruiter account"
              aria-pressed={role === 'recruiter'}
              className={`role-icon-button flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                role === 'recruiter'
                  ? 'is-selected bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V5.8a1.8 1.8 0 0 1 1.8-1.8h2.4A1.8 1.8 0 0 1 15 5.8v1.7M3.5 12h17M10 12v1.8h4V12" /></svg>
            </button>
          </div>

          <form onSubmit={isRegister ? performRegister : (e) => { e.preventDefault(); performLogin(); }}>
            {isRegister && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. johndoe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                    />
                  </div>
                </div>

                {role === 'recruiter' && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Tech Corp"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                    />
                  </div>
                )}
              </>
            )}

            {/* Email / ERP / Username */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                {isRegister ? 'Email Address' : 'Email, Username, or ERP ID'}
              </label>
              <input
                type={isRegister ? 'email' : 'text'}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isRegister ? 'yourname@domain.com' : 'e.g. ERP202601, anchal, or email'}
                className="w-full px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegister ? 'Create Account & Claim 100 Skill Credits' : 'Sign In to Skill-TERN'}
            </button>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
                className="font-semibold text-blue-600 dark:text-sky-400 hover:underline"
              >
                {isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign up with 100 Free Credits'}
              </button>
            </div>
          </form>

          {/* Quick 1-Click Demo Section */}
          <div className="demo-logins mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              className="demo-logins-toggle flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300"
              aria-expanded={demoOpen}
              onClick={() => setDemoOpen((open) => !open)}
            >
              <span>Demo logins</span>
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-normal text-emerald-700 dark:text-emerald-300">
                Ready to test
                <svg className={`h-4 w-4 transition-transform duration-300 ${demoOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>
              </span>
            </button>

            <div className={`demo-logins-list grid grid-cols-2 sm:grid-cols-3 gap-2 ${demoOpen ? 'is-open mt-3' : 'hidden'}`} hidden={!demoOpen}>
              <p className="col-span-full px-1 text-[11px] text-slate-500 dark:text-slate-300">Demo IDs and profile data are sample values; no institution verification is connected.</p>
              <button
                type="button"
                onClick={() => handleQuickDemo('anchal@skillswap.dev', 'Password123', 'student')}
                className="p-2 text-left rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 flex items-center justify-between">
                  <span>Anchal Singh</span>
                  <span className="text-[10px] text-blue-500">ERP202601</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Active Swaps & Chat</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('gargi@skillswap.dev', 'Password123', 'student')}
                className="p-2 text-left rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 flex items-center justify-between">
                  <span>Gargi Bothara</span>
                  <span className="text-[10px] text-blue-500">ERP202602</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Design & Graphics</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('shreya@skillswap.dev', 'Password123', 'student')}
                className="p-2 text-left rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 flex items-center justify-between">
                  <span>Shreya Ashtekar</span>
                  <span className="text-[10px] text-blue-500">ERP202603</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Physics & Mechanics</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('shravani@skillswap.dev', 'Password123', 'student')}
                className="p-2 text-left rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 flex items-center justify-between">
                  <span>Shravani Deshmukh</span>
                  <span className="text-[10px] text-blue-500">ERP202604</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Electrical & Electronics</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('student@skilltern.com', 'student123', 'student')}
                className="p-2 text-left rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 flex items-center justify-between">
                  <span>Demo Student</span>
                  <span className="text-[10px] text-blue-500">ERP202600</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Fresh Radar Profile</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter@skilltern.com', 'recruiter123', 'recruiter')}
                className="p-2 text-left rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs transition-all group"
              >
                <div className="font-semibold text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-600 flex items-center justify-between">
                  <span>Tech Corp HR</span>
                  <span className="text-[10px] text-purple-500">Recruiter</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Post & Screen Interns</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
