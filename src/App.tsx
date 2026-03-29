import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import RecruitersDashboard from "./components/RecruitersDashboard";
import StudentsDashboard from "./components/StudentsDashboard";
import "./index.css";

export interface ThemeProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans text-slate-900 dark:text-gray-100 transition-colors duration-500">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-300/30 dark:bg-purple-900/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-300/30 dark:bg-blue-900/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Main Content Area */}
      <div className="relative z-10 w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route
            path="/recruiter"
            element={<RecruitersDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            path="/student"
            element={<StudentsDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;