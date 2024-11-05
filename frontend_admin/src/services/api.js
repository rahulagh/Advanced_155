// src/utils/api.js
import axios from 'axios';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Set up the base URL for your API
export const API_URL = 'https://backend-admin-nqf3.onrender.com/api'; // Change this for production
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const api = {
  // Dashboard methods
  getDashboardData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  getInvoices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices`);
      console.log("invoice Data",  response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/invoices/${invoiceId}`, { status: newStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  // GSTReport methods
  getReportData: async (dateRange) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`, { params: dateRange });
      return response.data;
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }
  },

  exportToPDF: (reportData) => {
    const doc = new jsPDF();
    doc.text('GST Report', 20, 10);

    const tableColumn = ['Metric', 'Value'];
    const tableRows = [
      ['Total GST Collected', `₹${reportData.totalGSTCollected.toFixed(2)}`],
      ['Number of Invoices', reportData.totalInvoices],
      ['Paid Invoices', reportData.paidInvoices],
      ['Pending Invoices', reportData.pendingInvoices],
    ];

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('gst_report.pdf');
  },

  exportToCSV: (reportData) => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total GST Collected', reportData.totalGSTCollected.toFixed(2)],
      ['Number of Invoices', reportData.totalInvoices],
      ['Paid Invoices', reportData.paidInvoices],
      ['Pending Invoices', reportData.pendingInvoices],
    ];

    const csvString = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'gst_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  exportToExcel: (reportData) => {
    const wsData = [
      ['Metric', 'Value'],
      ['Total GST Collected', reportData.totalGSTCollected],
      ['Number of Invoices', reportData.totalInvoices],
      ['Paid Invoices', reportData.paidInvoices],
      ['Pending Invoices', reportData.pendingInvoices],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GST Report');
    XLSX.writeFile(wb, 'gst_report.xlsx');
  },

  // // PaymentTracker methods
  getPayments: async (filter = 'all') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments`, {
        params: { filter }
      });
      console.log("Paymnents", response.data)
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  // ReminderSidebar methods
  updateReminderSettings: async (reminderDays) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/settings`, { reminderDays });
      return response.data;
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      throw error;
    }
  },

  sendJobAlert: async (jobAlert) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/job-alerts`, jobAlert);
      return response.data;
    } catch (error) {
      console.error('Error sending job alert:', error);
      throw error;
    }
  },
  
  createInvoice: async (invoiceData) => {
    try {
      const response = await axiosInstance.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.message || 'Failed to create invoice');
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server');
      } else {
        // Request setup error
        throw new Error('Error setting up request');
      }
    }
  },

  // User methods
  getUsers: async ({ page = 1, search = "" } = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usersSS`, { params: { page, search } });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/usersSS/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  approveCertification: async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/usersSS/${id}/approve-certification`);
      return response.data;
    } catch (error) {
      console.error('Error approving certification:', error);
      throw error;
    }
  },

  rejectCertification: async (id, reason) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/usersSS/${id}/reject-certification`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting certification:', error);
      throw error;
    }
  },

  verifyUser: async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/usersSS/${id}/verify`);
      return response.data;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  },

  // Recruiter methods

  getRecruiters: async ({ page = 1, status = "all", search = "" }) => {
    try {
      console.log('Making API call to:', `http://localhost:5000/recruiters/getAllRecruiters`);
      const response = await axios.get(`http://localhost:5000/recruiters/getAllRecruiters`, {
        params: {
          page,
          status,
          search
        }
      });
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching recruiters:', error.response || error);
      throw error;
    }
  },

  approveRecruiter: async (id, reason) => {
    try {
      const response = await axios.put(`http://localhost:5000/recruiters/admin/approve/${id}`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error approving recruiter:', error);
      throw error;
    }
  },

  rejectRecruiter: async (id, reason) => {
    try {
      const response = await axios.put(`http://localhost:5000/recruiters/admin/reject/${id}`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting recruiter:', error);
      throw error;
    }
  },

  verifyRecruiter: async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/recruiters/admin/verify/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying recruiter:', error);
      throw error;
    }
  },

// SystemSettings methods
getSystemSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/system-settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },



  updateSystemSettings: async (settings) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/system-settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  },

  // New methods for generating keys (these would typically be done server-side)
  generateNewKey: () => {
    return Math.random().toString(36).substr(2, 24);
  },
};










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


export default api;