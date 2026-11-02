import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import type { ReactNode } from "react";
const Login = lazy(() => import("./components/Login"));
const RecruitersDashboard = lazy(() => import("./components/RecruitersDashboard"));
const StudentsDashboard = lazy(() => import("./components/StudentsDashboard"));
import { getCurrentUser } from "./api/client";
import "./index.css";

export interface ThemeProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

function RoleRoute({ role, children }: { role: 'student' | 'recruiter'; children: ReactNode }) {
  return getCurrentUser()?.role === role ? <>{children}</> : <Navigate to="/" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }, [pathname]);
  return null;
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-gray-950 font-sans text-slate-900 dark:text-gray-100">
      <div className="relative z-10 w-full min-h-screen">
        <ScrollToTop />
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-600 dark:text-slate-300">Loading Skill-TERN…</div>}>
        <Routes>
          <Route path="/" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route
            path="/recruiter"
            element={<RoleRoute role="recruiter"><RecruitersDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /></RoleRoute>}
          />
          <Route
            path="/student"
            element={<RoleRoute role="student"><StudentsDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /></RoleRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
