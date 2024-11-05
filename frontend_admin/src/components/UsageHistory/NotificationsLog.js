// src/components/UsageHistory/NotificationsLog.js
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import Swal from SweetAlert2
import { notificationService } from '../../services/api';

const NotificationsLog = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotificationsLog();
        
        // Check if the data exists and is an array
        if (Array.isArray(data) && data.length) {
          setNotifications(data);
        } else {
          // If no data is returned, set dummy notifications
          console.warn("No notifications found, loading dummy data.");
          setDummyNotifications();
        }
      } catch (error) {
        console.error('Failed to fetch notifications log:', error);
        
        // Show a user-friendly error message
        Swal.fire('Error', 'Failed to fetch notifications log. Showing dummy data instead.', 'error');
        
        // Use dummy data if fetch fails
        setDummyNotifications();
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    const setDummyNotifications = () => {
      setNotifications([
        { id: 1, message: 'Welcome to the platform! Enjoy your experience.', type: 'Welcome', createdAt: '2024-10-28T10:00:00.000Z' },
        { id: 2, message: 'Your plan has been successfully upgraded.', type: 'Plan Update', createdAt: '2024-10-28T10:30:00.000Z' },
        { id: 3, message: 'A new feature has been added to your account.', type: 'Feature Update', createdAt: '2024-10-28T11:00:00.000Z' },
      ]);
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>; // Display a loading message
  }

  return (
    <div>
      <h2>Notifications Log</h2>
      <ul>
        {notifications.length > 0 ? notifications.map((notif) => (
          <li key={notif.id}>
            <p><strong>Type:</strong> {notif.type}</p>
            <p><strong>Message:</strong> {notif.message}</p>
            <p><strong>Date:</strong> {new Date(notif.createdAt).toLocaleString()}</p>
          </li>
        )) : (
          <p>No notifications available.</p> // Inform the user if there are no notifications
        )}
      </ul>
    </div>
  );
};

export default NotificationsLog;
