import axios from 'axios';

// Update your backend URL
const API_URL = 'http://localhost:5000/api'; // Or the correct backend server URL

// Function to generate OTP
export const generateOTP = async (userId, recipient) => {
  try {
    const response = await axios.post(`${API_URL}/otp/generate`, { userId, recipient });
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

// Function to validate OTP
export const validateOTP = async (userId, otp, recipient) => {
  try {
    const response = await axios.post(`${API_URL}/otp/validate`, { userId, otp, recipient });
    return response.data;
  } catch (error) {
    console.error('Error validating OTP:', error);
    throw error;
  }
};
