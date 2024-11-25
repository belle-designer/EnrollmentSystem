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

  // Define the regex for student email format
  const studentEmailRegex = /^bc\.[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@cvsu\.edu\.ph$/;

  // Load the user from localStorage if it exists
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Load the user from localStorage on page reload
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Determine the navigation path based on user role and email
  const getNavigationPath = (user) => {
    if (!user) return '/'; // If no user exists, go to login page

    if (user.role === 'Student') {
      if (studentEmailRegex.test(user.email)) {
        return '/StudentDashboard'; // Navigate to student dashboard if email matches
      } else {
        return '/Admission'; // Navigate to Admission page if email doesn't match
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
        {/* Login Route */}
        <Route
          path="/"
          element={<Login setUser={(user) => {
            setUser(user);  // Update the user state
            localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
          }} />}
        />

        {/* Dynamic Navigation Route */}
        <Route
          path="/dashboard"
          element={user ? (
            <Navigate to={getNavigationPath(user)} />
          ) : (
            <Navigate to="/" />
          )}
        />

        {/* Protected Routes */}
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

        {/* Admission Page for Students */}
        <Route
          path="/Admission"
          element={user && user.role === 'Student' && !studentEmailRegex.test(user.email) ? <Admission /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
