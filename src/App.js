import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrStudentNumber, setEmailOrStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  const registeredUsers = [
    { email: 'test@example.com', studentNumber: '123456' },
    { email: 'john.doe@example.com', studentNumber: '654321' },
  ];
  
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const userExists = registeredUsers.some(
      (user) =>
        user.email === emailOrStudentNumber || user.studentNumber === emailOrStudentNumber
    );
    if (userExists) {
      alert('Login successful!');
      setEmailOrStudentNumber('');
      setPassword('');
    } else {
      setPopupMessage('No account found with this email or student number');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (password !== retypePassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
    const userExists = registeredUsers.some(
      (user) =>
        user.email === emailOrStudentNumber || user.studentNumber === emailOrStudentNumber
    );
    if (userExists) {
      setPopupMessage('Already have an account with this email/student number');
    } else {
      registeredUsers.push({
        email: emailOrStudentNumber,
        studentNumber: emailOrStudentNumber,
      });
      alert('Registration successful!');
      setEmailOrStudentNumber('');
      setPassword('');
      setRetypePassword('');
      setIsRegistering(false); // Switch back to login after registration
    }
  };

  return (
<div
  className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
  style={{ backgroundImage: 'url(/assets/Cvsu.jpg)' }}
>
  <div className="flex w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
    {/* Image on the left side */}
    <div className="w-1/2 p-0 flex justify-center items-center relative">
      {/* Image indicator dots at the bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-2 rounded-full bg-white ${
              index === currentImage
                ? 'bg-green-500 animate-scale' // Active dot (green) with scale effect
                : 'bg-gray-400' // Inactive dot (gray)
            }`}
            style={{
              animation: index === currentImage ? 'scale-pulse 3s infinite' : 'none', // Only pulse for active image
            }}
          ></div>
        ))}
      </div>

      <img
        src={images[currentImage]} // Dynamic image source
        alt="Dynamic Image"
        onLoad={handleImageLoad} // Set loading to false once the image is loaded
        className="w-full h-auto rounded-lg transition-all duration-500"
      />
    </div>

    {/* Form on the right side */}
    <div className="w-1/2 p-6 flex justify-center items-center">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isRegistering ? 'REGISTRATION' : 'LOGIN'}
        </h2>

        {popupMessage && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-100 rounded">
            {popupMessage}
          </div>
        )}

        {/* Form Starts */}
        <form
          onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="emailOrStudentNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Student Number:
            </label>
            <input
              id="emailOrStudentNumber"
              type="text"
              value={emailOrStudentNumber}
              onChange={(e) => setEmailOrStudentNumber(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {isRegistering && (
            <div>
              <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
                Retype Password:
              </label>
              <input
                id="retypePassword"
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Toggle link for switching between login and register */}
        <div className="mt-4 text-center">
          {isRegistering ? (
            <p
              onClick={() => setIsRegistering(false)}
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Already have an account? Proceed to Sign In
            </p>
          ) : (
            <p
              onClick={() => setIsRegistering(true)}
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Don't have an account? Register
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default App;

