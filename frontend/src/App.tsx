import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DailyTracker from './pages/DailyTracker';
import Analysis from './pages/Analysis';
import Calendar from './pages/Calendar';
import Home from './pages/Home';

const DashboardPlaceholder = () => (
  <div className="p-8 text-center text-2xl font-bold">Welcome to the Dashboard!</div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50"></div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPlaceholder /> : <Navigate to="/login" />}
        />

        <Route
          path="/tracker"
          element={isAuthenticated ? <DailyTracker /> : <Navigate to="/login" />}
        />

        <Route
          path="/analysis"
          element={isAuthenticated ? <Analysis /> : <Navigate to="/login" />}
        />

        <Route
          path="/calendar"
          element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />}
        />


        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;