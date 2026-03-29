import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProps } from '../App';

export type UserRole = 'student' | 'recruiter';

interface LoginProps extends ThemeProps {}

const Login = ({ isDarkMode, toggleDarkMode }: LoginProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performLogin();
  };

  const performLogin = () => {
    //Basic validation - for demo purposes, any email and password works
    const emailValue = email.trim();
    const passwordValue = password.trim();
    
    if (!emailValue || !passwordValue) {
      alert('Please enter both email and password');
      return;
    }
    
    // Demo Credentials
    const DEMO = {
    student: {
      email: 'student@skilltern.com',
      password: 'student123',
      route: '/student',
    },
    recruiter: {
      email: 'recruiter@skilltern.com',
      password: 'recruiter123',
      route: '/recruiter',
    },
  };

  const activeDemo = DEMO[role];

  if (
    emailValue === activeDemo.email &&
    passwordValue === activeDemo.password
  ) {
    console.log('✅ Demo login success:', role);
    navigate(activeDemo.route);
  } else {
    alert(
      `Invalid demo credentials.\n\n` +
      `Student → student@skilltern.com / student123\n` +
      `Recruiter → recruiter@skilltern.com / recruiter123`
    );
  }
};

  const handleSignUp = () => {
    // Handle sign up navigation
    console.log('Navigate to sign up');
  };


  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 pt-10 pb-20">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:-translate-y-0.5 transition-all duration-300 shadow-md group"
        >
          {isDarkMode ? (
            <>
              <svg className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-semibold text-slate-200">Light</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-sm font-semibold text-indigo-900">Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-md px-6">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex justify-center items-center mb-6 w-16 h-16 rounded-2xl bg-white/60 dark:bg-slate-800/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl">
             <svg className="w-8 h-8 text-blue-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Skill-TERN</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed px-4">Smart AI-assisted internship portal with intelligent matching, automated screening, and real-time application tracking.</p>
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleLogin}
          className="glass-panel p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Welcome back</h2>
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-6 bg-blue-50 dark:bg-slate-800/50 p-3 rounded-lg border border-blue-200 dark:border-white/5">
            💡 <strong>Demo Credentials</strong><br />
            Student → student@skilltern.com / student123<br />
            Recruiter → recruiter@skilltern.com / recruiter123
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/5 shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-md scale-[1.02] ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/50'
              }`}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                role === 'recruiter'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-md scale-[1.02] ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/50'
              }`}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              Recruiter
            </button>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-sm dark:text-white dark:placeholder-slate-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-sm dark:text-white dark:placeholder-slate-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:bg-slate-800"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Remember Me</span>
            </label>
            <a 
              href="#" 
              className="text-sm text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 hover:underline"
            >
              Forgot Password
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-medium hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Login securely
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-white/20 backdrop-blur-md text-slate-700 dark:text-white py-3.5 px-6 rounded-xl font-medium hover:bg-white dark:hover:bg-slate-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


