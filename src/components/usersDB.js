// usersDB.js
export const usersDB = [
  {
    email: 'bc.student.nama@cvsu.edu.ph',
    userID: 'student123',
    role: 'Student',
    password: '123', // Simulated password for Student
    hasStudentNumber: true,
    hasAdminNumber: false,
    hasOfficerNumber: false,
  },
  {
    email: 'admin@example.com',
    userID: 'admin789',
    role: 'Admin',
    password: 'adminPassword123', // Simulated password for Admin
    hasStudentNumber: false,
    hasAdminNumber: true,
    hasOfficerNumber: false,
  },
  {
    email: 'officer@example.com',
    userID: 'officer456',
    role: 'Officer',
    password: '123', // Simulated password for Officer
    hasStudentNumber: false,
    hasAdminNumber: false,
    hasOfficerNumber: true,
  },
  {
    email: 'new@example.com',
    userID: 'student123',
    role: 'Student',
    password: '123', // Simulated password for Student
    hasStudentNumber: false,
    hasAdminNumber: false,
    hasOfficerNumber: false,
  },
];

// usersDB.js
export const getUserData = (emailOrUserID, password) => {
  if (!emailOrUserID) {
    return null; // If emailOrUserID is undefined, return null to prevent errors
  }

  const user = usersDB.find(
    (user) =>
      (user.email && user.email.toLowerCase() === emailOrUserID.toLowerCase()) ||
      (user.userID && user.userID === emailOrUserID)
  );

  if (user && user.password === password) {
    return user;
  } else {
    return null;
  }
};
