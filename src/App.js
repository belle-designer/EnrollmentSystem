import React, { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import Admission from './pages/Admission';

function App() {
  const [user, setUser] = useState(null);

  const studentEmailRegex = /^bc\.[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@cvsu\.edu\.ph$/;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getNavigationPath = (user) => {
    if (!user) return '/';

    if (user.role === 'Student') {
      if (studentEmailRegex.test(user.email)) {
        return '/StudentDashboard'; 
      } else {
        return '/Admission'; 
      }
    }

    switch (user.role) {
      case 'Admin':
        return '/AdminDashboard';
      case 'Officer':
        return '/OfficerDashboard';
      default:
        return '/';
    }
  };

  return (
    <Router>
      <Routes>
        {}
        <Route
          path="/"
          element={<Login setUser={(user) => {
            setUser(user); 
            localStorage.setItem('user', JSON.stringify(user)); 
          }} />}
        />

        {}
        <Route
          path="/dashboard"
          element={user ? (
            <Navigate to={getNavigationPath(user)} />
          ) : (
            <Navigate to="/" />
          )}
        />

        {}
        <Route
          path="/StudentDashboard"
          element={user && user.role === 'Student' ? (
            studentEmailRegex.test(user.email) ? (
              <StudentDashboard logout={handleLogout} />
            ) : (
              <Navigate to="/Admission" />
            )
          ) : (
            <Navigate to="/" />
          )}
        />

        <Route
          path="/AdminDashboard"
          element={user && user.role === 'Admin' ? <AdminDashboard logout={handleLogout} /> : <Navigate to="/" />}
        />

        <Route
          path="/OfficerDashboard"
          element={user && user.role === 'Officer' ? <OfficerDashboard logout={handleLogout} /> : <Navigate to="/" />}
        />

        {}
        <Route
          path="/Admission"
          element={user && user.role === 'Student' && !studentEmailRegex.test(user.email) ? <Admission /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
