// src/utils/api.js
import axios from 'axios';
import Swal from 'sweetalert2';

// Set up the base URL for your API
export const API_URL = 'https://backend-admin-nqf3.onrender.com/api'; // Change this for production

// Error handling utility function
const handleError = (action, error) => {
  if (error.response) {
    console.error(`Error ${action}:`, error.response.data);
    Swal.fire('Error', error.response.data.message || error.response.status, 'error');
    throw new Error(error.response.data.message || error.response.status);
  } else {
    console.error(`Error ${action}: No response received`, error);
    Swal.fire('Error', 'No response from server', 'error');
    throw new Error('No response from server');
  }
};

// Billing service functions
export const billingService = {
  async fetchBillingHistory() {
    try {
      const response = await axios.get(`${API_URL}/billing`);
      return response.data;
    } catch (error) {
      handleError('fetching billing history', error);
    }
  },

  async getBillingById(id) {
    try {
      const response = await axios.get(`${API_URL}/billing/${id}`);
      return response.data;
    } catch (error) {
      handleError('fetching billing record', error);
    }
  },

  async createBilling(billingData) {
    try {
      const response = await axios.post(`${API_URL}/billing`, billingData);
      return response.data;
    } catch (error) {
      handleError('creating billing record', error);
    }
  },

  async updateBilling(id, billingData) {
    try {
      const response = await axios.patch(`${API_URL}/billing/${id}`, billingData);
      return response.data;
    } catch (error) {
      handleError('updating billing record', error);
    }
  }
};

// Assign a new plan to a user
export const assignChangePlan = async (userId, newPlanId) => {
  try {
    const response = await axios.post(`${API_URL}/plans/assign`, { userId, newPlanId });
    return response.data;
  } catch (error) {
    handleError('assigning new plan', error);
  }
};

// Bulk assign plans to multiple users
export const bulkAssignPlans = async (userIds, newPlanId) => {
  try {
    const response = await axios.post(`${API_URL}/plans/bulk-assign`, { userIds, newPlanId });
    return response.data;
  } catch (error) {
    handleError('bulk assigning plans', error);
  }
};

// Notification service for sending and fetching notifications
export const notificationService = {
  async sendNotification(userId, message) {
    try {
      const response = await axios.post(`${API_URL}/notifications/send`, { userId, message });
      return response.data;
    } catch (error) {
      handleError('sending notification', error);
    }
  },

  async fetchUserNotifications(userId) {
    try {
      const response = await axios.get(`${API_URL}/notifications/${userId}`);
      return response.data;
    } catch (error) {
      handleError('fetching user notifications', error);
    }
  },
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    handleError('fetching users', error);
  }
};

// Fetch all user profiles
export const fetchUserProfiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profiles`);
    return response.data;
  } catch (error) {
    handleError('fetching user profiles', error);
  }
};

// Fetch user profile by ID
export const fetchUserProfile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}/profile`);
    return response.data;
  } catch (error) {
    handleError('fetching user profile', error);
  }
};

// Update user plan
export const updateUserPlan = async (id, planData) => {
  try {
    const response = await axios.patch(`${API_URL}/plans/${id}/update-plan`, planData);
    return response.data;
  } catch (error) {
    handleError('updating user plan', error);
  }
};

// Example API function to fetch analytics data
export const fetchAnalyticsData = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`);
    return response.data;
  } catch (error) {
    handleError('fetching analytics data', error);
  }
};

export const fetchPlans = async () => {
  const response = await axios.get(`${API_URL}/plans`); // Adjust endpoint accordingly
  return response.data;
};

// Fetch features for a specific plan
export const fetchFeatures = async (planId) => {
  try {
      const response = await fetch(`${API_URL}/plans/${planId}/features`); // Fetch features for the specific plan ID
      if (!response.ok) {
          throw new Error('Failed to fetch features');
      }
      const data = await response.json();
      return data; // Return the features data
  } catch (error) {
      console.error('Error fetching features:', error);
      throw error; // Propagate the error
  }
};


export const addFeatureToPlan = async (planId, feature) => {
  const response = await axios.post(`${API_URL}/plans/add-feature`, { planId, feature });
  return response.data;
};

export const removeFeatureFromPlan = async (planId, featureId) => {
  const response = await axios.delete(`${API_URL}/plans/remove-feature`, {
    data: { planId, featureId },
  });
  return response.data;
}
// Delete a plan
export const deletePlan = async (planId) => {
  try {
    const response = await axios.delete(`${API_URL}/plans/${planId}`);
    return response.data;
  } catch (error) {
    handleError('deleting plan', error);
  }
};

// Renew user plan
export const renewPlan = async (userId, additionalDays) => {
  try {
    const response = await axios.post(`${API_URL}/renewals/renew`, {
      userId,
      additionalDays,
    });
    return response.data;
  } catch (error) {
    handleError('renewing plan', error);
  }
};

// Fetch plan usage reports
export const fetchPlanUsageReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/plan-usage`);
    return response.data;
  } catch (error) {
    handleError('fetching plan usage reports', error);
  }
};

// Fetch feature usage data
export const fetchFeatureUsage = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/feature-usage`);
    return response.data;
  } catch (error) {
    handleError('fetching feature usage data', error);
  }
};

// Fetch notifications log
export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/log`);
    return response.data;
  } catch (error) {
    handleError('fetching notifications', error);
  }
};

// Send notification to a single user
export const sendNotificationToUser = async (userId, message, type) => {
  try {
    const response = await axios.post(`${API_URL}/notifications/send`, { userId, message, type });
    return response.data;
  } catch (error) {
    handleError('sending notification to user', error);
  }
};

// Send bulk notifications to multiple users
export const sendBulkNotifications = async (userIds, message, type) => {
  try {
    const response = await axios.post(`${API_URL}/notifications/send-bulk`, { userIds, message, type });
    return response.data;
  } catch (error) {
    handleError('sending bulk notifications', error);
  }
};

// Fetch audit data
export const fetchAuditData = async () => {
  try {
    const response = await axios.get(`${API_URL}/audit`);
    return response.data;
  } catch (error) {
    handleError('fetching audit data', error);
  }
};

// Generate OTP function
export const generateOTP = async (recipient, userId, action) => {
  try {
    const response = await axios.post(`${API_URL}/otp/generate`, { recipient, userId, action });
    return response.data;
  } catch (error) {
    console.error("Error generating OTP:", error.response || error.message || error);
    Swal.fire('Error', 'Error sending OTP', 'error');
    throw new Error('Error sending OTP');
  }
};

// Reactivate account function
export const reactivateAccount = async (userId, otp) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/reactivate`, { userId, otp });
    return response.data;
  } catch (error) {
    console.error("Error reactivating account:", error.response || error.message || error);
    Swal.fire('Error', 'Failed to reactivate account', 'error');
    throw new Error('Failed to reactivate account');
  }
};

// Validate OTP
export const validateOTP = async (userId, otp, recipient) => {
  try {
    const response = await axios.post(`${API_URL}/otp/validate`, { userId, otp, recipient, action: 'deactivate' });
    return response.data;
  } catch (error) {
    handleError('validating OTP', error);
  }
};

// Deactivate account
export const deactivateAccount = async (id, otp) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/deactivate`, { id, otp });
    return response.data;
  } catch (error) {
    console.error("Error deactivating account:", error.response || error.message || error);
    Swal.fire('Error', 'Failed to deactivate account', 'error');
    throw new Error('Failed to deactivate account');
  }
};

// Fetch account details
export const fetchAccountDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/${id}`);
    return response.data;
  } catch (error) {
    handleError('fetching account details', error);
  }
};



export const sendOtp = async (adminId, recipient) => {
  return await axios.post(`${API_URL}/otp/generate`, { adminId, recipient });
};

export const verifyOtp = async (otp, adminId, recipient) => {
  return await axios.post(`${API_URL}/otp/validate`, { otp, adminId, recipient });
};

// Create User
export const createUser = async (userData) => {
  try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response;
  } catch (error) {
      console.error('Error creating user:', error);
      throw error;
  }
};

// Update User Quotas
export const updateUserQuotas = async (userId, quotas) => {
  try {
      const response = await axios.put(`${API_URL}/users/${userId}/quotas`, { quotas });
      return response;
  } catch (error) {
      console.error('Error updating user quotas:', error);
      throw error;
  }
};

// Get All Users
export const getAllUsers = async () => {
  try {
      const response = await axios.get(`${API_URL}/users`);
      return response;
  } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
  }
};
// Function to update a plan
export const updatePlan = async (id, updatedPlan) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPlan),
  });
  if (!response.ok) throw new Error('Failed to update plan');
  return await response.json();
};

// // Fetch the expiring plans from the API
// export const fetchExpiringPlans = async () => {
//   const response = await fetch('${API_URL}/plans/expiring'); // Replace with your actual API endpoint
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// };

export const fetchUpcomingExpirations = async () => {
  try {
      const response = await axios.get(`${API_URL}/plans/upcoming-expirations`);
      return response.data;
  } catch (error) {
      console.error('Error fetching upcoming expirations:', error);
      throw error;
  }
};
 
// In api.js

export const updateFeatureQuotas = async (userId, quotas) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/updateQuotas`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotas),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update quotas');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating quotas:", error);
    throw error;
  }
};


