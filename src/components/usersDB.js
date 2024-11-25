export const usersDB = [
  {
    email: 'bc.student.nama@cvsu.edu.ph',
    userID: 'student123',
    role: 'Student',
    password: '123', 
    hasStudentNumber: true,
    hasAdminNumber: false,
    hasOfficerNumber: false,
  },
  {
    email: 'admin@example.com',
    userID: 'admin789',
    role: 'Admin',
    password: 'adminPassword123', 
    hasStudentNumber: false,
    hasAdminNumber: true,
    hasOfficerNumber: false,
  },
  {
    email: 'officer@example.com',
    userID: 'officer456',
    role: 'Officer',
    password: '123', 
    hasStudentNumber: false,
    hasAdminNumber: false,
    hasOfficerNumber: true,
  },
  {
    email: 'new@example.com',
    userID: 'student123',
    role: 'Student',
    password: '123', 
    hasStudentNumber: false,
    hasAdminNumber: false,
    hasOfficerNumber: false,
  },
];

export const getUserData = (emailOrUserID, password) => {
  if (!emailOrUserID) {
    return null; 
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
