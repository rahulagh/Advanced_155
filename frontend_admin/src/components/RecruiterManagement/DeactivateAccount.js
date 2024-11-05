import React, { useState, useEffect } from 'react';
import { deactivateAccount, reactivateAccount, fetchUsers, generateOTP, validateOTP } from '../../services/api'; 
import Swal from 'sweetalert2'; 

const DeactivateAccount = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecruiters = async () => {
      try {
        const result = await fetchUsers();
        setRecruiters(result);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        Swal.fire('Error', 'Failed to fetch recruiters', 'error');
      }
    };
    loadRecruiters();
  }, []);

  const handleOpenConfirmModal = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setShowConfirmModal(true); 
  };

  const handleConfirmAction = async () => {
    if (!selectedRecruiter) return; 
    setShowConfirmModal(false); 

    try {
      const response = await generateOTP(selectedRecruiter.id, selectedRecruiter.email);
      if (response && response.success) {
        Swal.fire('Info', 'OTP has been sent to the admin. Please check your email.', 'info');
        setShowOtpModal(true);
        setOtp('');
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire('Error', error.message || 'Failed to send OTP', 'error');
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtp('');
    setSelectedRecruiter(null);
  };

  const handleStatusChange = async () => {
    if (!selectedRecruiter || !otp) return;

    setLoading(true);
    try {
      const isOtpValid = await validateOTP(selectedRecruiter.id, otp, selectedRecruiter.email);
      if (isOtpValid) {
        const response = selectedRecruiter.status === 'Active'
          ? await deactivateAccount(selectedRecruiter.id, otp)
          : await reactivateAccount(selectedRecruiter.id, otp);

        Swal.fire('Success', response.message, 'success');
        setRecruiters(recruiters.map((rec) => 
          rec.id === selectedRecruiter.id 
            ? { ...rec, status: rec.status === 'Active' ? 'Inactive' : 'Active' }
            : rec
        ));
        handleCloseOtpModal();
      } else {
        Swal.fire('Error', 'Invalid OTP, please try again.', 'error');
      }
    } catch (error) {
      console.error('Error processing status change:', error);
      Swal.fire('Error', error.message || 'Error processing the request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl">Manage Recruiter Accounts</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Plan</th>
            <th className="py-2">Email</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((recruiter, index) => (
            <tr key={`${recruiter.id}-${index}`} className="border-b">
              <td className="py-2">{recruiter.name}</td>
              <td className="py-2">{recruiter.plan}</td>
              <td className="py-2">{recruiter.email}</td>
              <td className="py-2">{recruiter.status || 'Unknown'}</td>
              <td className="py-2">
                <button
                  onClick={() => handleOpenConfirmModal(recruiter)}
                  className={`px-4 py-2 ${recruiter.status === 'Active' ? 'bg-red-500' : 'bg-green-500'} text-white`}
                >
                  {recruiter.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg mb-4">
              Are you sure you want to {selectedRecruiter?.status === 'Active' ? 'deactivate' : 'reactivate'} {selectedRecruiter?.name}?
            </h3>
            <button onClick={handleConfirmAction} className="bg-red-500 text-white px-4 py-2 mr-2">
              Yes
            </button>
            <button onClick={() => setShowConfirmModal(false)} className="bg-gray-500 text-white px-4 py-2">
              No
            </button>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg mb-4">Enter OTP for {selectedRecruiter?.name}</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border p-2 mb-2 w-full"
            />
            <button 
              onClick={handleStatusChange} 
              className="bg-red-500 text-white px-4 py-2 mr-2"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={handleCloseOtpModal} className="bg-gray-500 text-white px-4 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeactivateAccount;