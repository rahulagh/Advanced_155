import React, { useState, useEffect } from 'react';
import { 
  fetchUsers, 
  generateOTP, 
  validateOTP, 
  deactivateAccount, 
  reactivateAccount 
} from '../../services/api'; // Adjust the import path based on your project structure

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const adminEmail = "b20cn032@kitsw.ac.in";

  useEffect(() => {
    loadRecruiters();
  }, []);

  const loadRecruiters = async () => {
    setLoading(true);
    try {
      const result = await fetchUsers();
      setRecruiters(result);
    } catch (error) {
      showMessage('Failed to fetch recruiters', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 1000);
  };

  const handleOpenOtpModal = async (recruiter, action) => {
    if (window.confirm(`Are you sure you want to ${action} this account?`)) {
      setSelectedRecruiter(recruiter);
      setActionType(action);
      setShowOtpModal(true);
      
      setOtpLoading(true);
      try {
        await generateOTP({ recipient: adminEmail, userId: recruiter.id, action });
        showMessage('OTP sent to email', 'success');
      } catch (error) {
        showMessage('Failed to send OTP', 'error');
        setShowOtpModal(false);
      } finally {
        setOtpLoading(false);
      }
    }
  };

  const handleAction = async () => {
    if (!otp || processing) return;

    setProcessing(true);
    try {
      const isValid = await validateOTP({ otp, userId: selectedRecruiter.id });

      if (isValid) {
        const response = actionType === 'deactivate' 
          ? await deactivateAccount(selectedRecruiter.id)
          : await reactivateAccount(selectedRecruiter.id);

        showMessage(`Account successfully ${actionType}d!`, 'success');

        setRecruiters(prev =>
          prev.map(rec =>
            rec.id === selectedRecruiter.id
              ? { ...rec, active: actionType !== 'deactivate' }
              : rec
          )
        );

        setShowOtpModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showMessage('Invalid OTP', 'error');
      }
    } catch (error) {
      showMessage('Failed to process request', 'error');
    } finally {
      setProcessing(false);
      setOtp('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Recruiter Accounts</h2>
      
      {/* Message Toast */}
      {message.text && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {message.text}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((recruiter) => (
                <tr key={recruiter.id} className="border-b">
                  <td className="p-3">{recruiter.name}</td>
                  <td className="p-3">{recruiter.email}</td>
                  <td className="p-3">{recruiter.company}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      recruiter.active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {recruiter.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenOtpModal(
                        recruiter,
                        recruiter.active ? 'deactivate' : 'reactivate'
                      )}
                      className={`px-4 py-2 rounded ${
                        recruiter.active 
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {recruiter.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Enter OTP to {actionType} account
            </h3>
            
            {otpLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin">Loading...</div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border rounded"
                  maxLength={6}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowOtpModal(false);
                      setOtp('');
                    }}
                    className="px-4 py-2 border rounded text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecruiters;