import axios from 'axios';

const API_URL = 'https://api.example.com/notifications';

export const sendNotification = async (userId, message) => {
    const response = await axios.post(`${API_URL}/send`, {
        userId,
        message,
    });
    return response.data;
};

export const fetchNotifications = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
};
