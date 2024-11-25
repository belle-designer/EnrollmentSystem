import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../service/api';

const Login = ({ setUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrUserID, setEmailOrUserID] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const navigate = useNavigate();

  const images = [
    './assets/01.jpg?text=Image+1',
    './assets/02.jpg?text=Image+2',
    './assets/03.jpg?text=Image+3',
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      setIsImageLoading(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSwitchForm = () => {
    setEmailOrUserID('');
    setPassword('');
    setRetypePassword('');
    setErrorMessage('');
    setPopupMessage('');
    setIsRegistering(!isRegistering);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailOrUserID)) {
      setPopupMessage('Please enter a valid email address.');
      return;
    }

    if (isRegistering) {
      // Password match validation
      if (password !== retypePassword) {
        setPopupMessage('Passwords do not match.');
        return;
      }

      // Password strength validation
      if (
        password.length < 8 || // Minimum 8 characters
        !/[A-Z]/.test(password) || // At least one uppercase letter
        !/[a-z]/.test(password) || // At least one lowercase letter
        !/[!@#$%^&*()]/.test(password) // At least one special character
      ) {
        setPopupMessage(
          'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character.'
        );
        return;
      }

      const newUser = {
        email: emailOrUserID,
        password: password,
        role: 'Student', // Default role
      };

      try {
        // API call for registration
        const response = await axios.post('http://localhost:5000/api/auth/signup', newUser);
        setPopupMessage('Registration successful!');
        setEmailOrUserID('');
        setPassword('');
        setRetypePassword('');
        setErrorMessage('');
        setIsRegistering(false); // Switch to login form
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Error during registration. Please try again.';
        setPopupMessage(errorMessage);
      }
    } else {
      // Handle Login Logic
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: emailOrUserID,
          password: password,
        });
        
        const { role, adminum, officernum, email } = response.data;
  
        // Set user data
        setUser({ email: emailOrUserID, role });
        setPopupMessage('Login successful!');
        
        // Save user data to localStorage for persistence
        localStorage.setItem('user', JSON.stringify({ email: emailOrUserID, role }));
  
        // Navigate to dashboard after successful login
        navigate('/dashboard');
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Invalid login credentials.';
        setPopupMessage(errorMessage);
      }
    }
  };
 
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/assets/Cvsu.jpg)' }}
    >
      <div className="flex w-full p-3 max-w-5xl bg-white rounded-lg shadow-lg">
        {/* Left Image Section with Slider */}
        <div className="w-1/2 p-2 flex justify-center items-center relative">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-2 rounded-full ${
                  index === currentImage ? 'bg-green-500 animate-scale' : 'bg-gray-400'
                }`}
              ></div>
            ))}
          </div>

          <img
            src={images[currentImage]}
            alt="Dynamic Image"
            onLoad={handleImageLoad}
            className={`w-full h-auto rounded-lg transition-all duration-500 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Right Form Section */}
        <div className="w-1/2 p-2 flex justify-center items-center">
          <div className="w-full max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {isRegistering ? 'SIGN UP' : 'LOG IN'}
            </h2>

            {popupMessage && (
              <div className="text-green-500 text-sm mb-4 p-2 bg-green-100 rounded">
                {popupMessage}
              </div>
            )} 

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="emailOrUserID" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  id="emailOrUserID"
                  type="text"
                  value={emailOrUserID}
                  onChange={(e) => setEmailOrUserID(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {!isRegistering && (
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password:
                  </label>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-9 right-3 text-gray-500 hover:text-indigo-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              )}

{isRegistering && (
  <>
    {/* Password and Retype Password Fields Side by Side */}
    <div className="flex space-x-4">
      {/* Password Field with Requirements and Toggle */}
      <div className="relative flex-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-password-field w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-9 right-3 text-gray-500 hover:text-indigo-500"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        <div className="text-xs text-gray-500 mt-1">
          <ul>
            <li
              className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}
            >
              {/[A-Z]/.test(password) ? '✓' : '✗'} One uppercase letter
            </li>
            <li
              className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}
            >
              {/[a-z]/.test(password) ? '✓' : '✗'} One lowercase letter
            </li>
            <li
              className={`flex items-center ${/[!@#$%^&*()]/.test(password) ? 'text-green-500' : 'text-red-500'}`}
            >
              {/[!@#$%^&*()]/.test(password) ? '✓' : '✗'} One special character
            </li>
            <li
              className={`flex items-center ${password.length >= 8 ? 'text-green-500' : 'text-red-500'}`}
            >
              {password.length >= 8 ? '✓' : '✗'} Minimum 8 characters
            </li>
          </ul>
        </div>
      </div>

      {/* Retype Password Field with Match Indicator and Toggle */}
      <div className="relative flex-1">
        <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
          Retype Password:
        </label>
        <input
          id="retypePassword"
          type={showRetypePassword ? 'text' : 'password'}
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          required
          className="signup-retype-password-field w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => setShowRetypePassword((prev) => !prev)}
          className="absolute top-9 right-3 text-gray-500 hover:text-indigo-500"
        >
          {showRetypePassword ? 'Hide' : 'Show'}
        </button>
        <div className="text-xs mt-1">
          <p
            className={`flex items-center ${password === retypePassword && retypePassword !== '' ? 'text-green-500' : 'text-red-500'}`}
          >
            {password === retypePassword && retypePassword !== ''
              ? '✓ Passwords match'
              : '✗ Passwords do not match'}
          </p>
        </div>
      </div>
    </div>
  </>
)}

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-800 text-white font-bold rounded-md shadow-md"
                >
                  {isRegistering ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              {isRegistering
                  ? 'Already have an account? '
                  : "Don't have an account? "}
              <button
                onClick={handleSwitchForm}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {isRegistering
                  ? 'Log In'
                  : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
