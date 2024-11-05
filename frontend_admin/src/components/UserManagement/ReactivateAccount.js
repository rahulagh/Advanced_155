import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateOTP, reactivateAccount } from '../../services/api'; // Import from api.js

const ReactivateAccount = () => {
  const { id } = useParams(); // Account ID
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false); // Modal state
  const [email, setEmail] = useState(''); // State to hold email for OTP
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  // Function to validate email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
  };

  // Function to open the OTP modal
  const handleOpenOtpModal = async () => {
    setErrorMessage(''); // Reset error message
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.'); // Email validation alert
      return;
    }

    setLoading(true); // Start loading
    try {
      await generateOTP(email); // Call generateOTP with the user's email
      setShowOtpModal(true); // Open the OTP modal if OTP is generated successfully
      alert('OTP sent successfully!'); // Success message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Please try again later.'); // Set error message
    } finally {
      setLoading(false); // End loading
    }
  };

  // Function to close the OTP modal
  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtp(''); // Clear the OTP input when closing the modal
  };

  // Function to handle reactivation
  const handleReactivate = async () => {
    setErrorMessage(''); // Reset error message
    setLoading(true); // Start loading
    try {
      const response = await reactivateAccount(id, otp); // Verify OTP and reactivate
      alert(response.message); // Display success message
      handleCloseOtpModal(); // Close the modal
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error reactivating account.'); // Set error message
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <h2 className="text-xl">Reactivate Account</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border p-2 mb-2 w-full"
        disabled={loading} // Disable input while loading
      />
      <button 
        onClick={handleOpenOtpModal} 
        className={`mt-2 ${loading ? 'bg-gray-400' : 'bg-green-500'} text-white px-4 py-2`} 
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Sending...' : 'Reactivate Account'}
      </button>

      {/* Display error message if any */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg mb-4">Enter OTP</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border p-2 mb-4 w-full"
              disabled={loading} // Disable input while loading
            />
            <div className="flex justify-end">
              <button
                onClick={handleReactivate}
                className={`bg-green-500 text-white px-4 py-2 mr-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={handleCloseOtpModal}
                className="bg-red-500 text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactivateAccount;
