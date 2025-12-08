export function validateName(name) {
  const nameRegex = /^[A-Za-z.\s]+$/; // Letters, periods, and spaces allowed

  if (!name) {
    return { isValid: false, message: "Name is required" };
  }

  if (name.length < 3) {
    return { isValid: false, message: "Name must be at least 3 characters long" };
  }

  if (!nameRegex.test(name)) {
    return { isValid: false, message: "Name can only contain letters, periods, and spaces" };
  }

  if (name.startsWith(" ") || name.endsWith(" ")) {
    return { isValid: false, message: "Name should not start or end with a space" };
  }

  if (name.includes("  ")) {
    return { isValid: false, message: "Name should not have consecutive spaces" };
  }

  return { isValid: true, message: "Valid name" };
}

export function validateSchoolName(schoolName) {
  const schoolNameRegex = /^[A-Za-z.\s]+$/; // Only letters and spaces allowed

  if (!schoolName) {
    return { isValid: false, message: "School Name is required" };
  }

  if (schoolName.length < 3) {
    return { isValid: false, message: "School Name must be at least 3 characters long" };
  }

  if (!schoolNameRegex.test(schoolName)) {
    return { isValid: false, message: "School Name can only contain letters and spaces" };
  }

  if (schoolName.startsWith(" ") || schoolName.endsWith(" ")) {
    return { isValid: false, message: "School Name should not start or end with a space" };
  }

  if (schoolName.includes("  ")) {
    return { isValid: false, message: "School Name should not have consecutive spaces" };
  }

  return { isValid: true, message: "Valid School Name" };
}







// this use to find checksum and correct aadhar number
// const invTable = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];


export function validateAadhaar(aadhaarNumber) {
  let c = 0;

  const dTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];
  
  const pTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];
  const aadhaarRegex = /^\d{12}$/;
  if (!aadhaarRegex.test(aadhaarNumber)) {
    return {
      isValid: false,
      message: "Aadhaar number must be exactly 12 digits long and contain only numbers.",
    };
  }
  let reversed = aadhaarNumber.split("").reverse().map(Number);

  for (let i = 0; i < reversed.length; i++) {
    c = dTable[c][pTable[i % 8][reversed[i]]];
  }

  return { isValid: c === 0, message: c === 0 ? "Valid Aadhaar number." : "Invalid Aadhaar number." }; // If c is 0, Aadhaar is valid
}


export function validatePhoneNo(phoneNo) {
  const phoneRegex = /^[6-9]\d{9}$/; // Starts with 6-9 and is exactly 10 digits

  if (!phoneNo) {
    return { isValid: false, message: "Phone number is required" };
  }

  if (!phoneRegex.test(phoneNo)) {
    return { isValid: false, message: "Invalid phone number. Must be 10 digits and start with 6-9" };
  }

  return { isValid: true, message: "Valid phone number" };
}


export function validateDateOfBirth(dob) {
  // Regular Expression to match YYYY-MM-DD format
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dob || !dobRegex.test(dob)) {
    return { isValid: false, message: "Enter a valid date of birth" };
  }

  // Convert to Date object
  const birthDate = new Date(dob);
  const today = new Date();

  // Check if date is valid (e.g., not Feb 30)
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, message: "Invalid date. Please enter a real date." };
  }

  // Calculate age
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust for cases where the birthday hasn't occurred yet this year
  const exactAge = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0) ? age : age - 1;

  // Age validation (Minimum: 5, Maximum: 100)
  if (exactAge < 5) {
    return { isValid: false, message: "Age must be at least 5 years old." };
  }
  if (exactAge > 100) {
    return { isValid: false, message: "Age cannot be more than 100 years old." };
  }

  return { isValid: true, message: "Valid Date of Birth." };
}

