import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'student' | 'recruiter';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login = () => {
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
    
    // Handle login logic here
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Role:', role);
    console.log('Email:', emailValue);
    console.log('Password:', passwordValue);
    
    // Navigate based on role
    if (role === 'student') {
      navigate('/student');
    } else if (role === 'recruiter') {
      navigate('/recruiter');
    }
  };

  const handleSignUp = () => {
    // Handle sign up navigation
    console.log('Navigate to sign up');
  };


  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Skill-TERN</h1>
          <p className="text-white text-sm">Smart AI-assisted internship portal with intelligent matching, automated screening, and real-time application tracking.</p>
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-black mb-4">Login</h2>
          <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-200">
            💡 <strong>Demo Mode</strong>
          </p>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium transition-all ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
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
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium transition-all ${
                role === 'recruiter'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
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
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Enter your password"
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember Me</span>
            </label>
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Forgot Password
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="flex-1 bg-transparent border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Sign-Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


