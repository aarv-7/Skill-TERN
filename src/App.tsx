import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import RecruitersDashboard from "./components/RecruitersDashboard";
import StudentsDashboard from "./components/StudentsDashboard";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/recruiter"
        element={<RecruitersDashboard/>}
      />
      <Route
        path="/student"
        element={<StudentsDashboard />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;