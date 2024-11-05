
import React, { useEffect, useState } from 'react';
import { fetchAnalyticsData } from '../services/api';

function Analytics() {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        fetchAnalyticsData().then((data) => setAnalyticsData(data));
    }, []);

    return (
        <div>
            <h2>Analytics Dashboard</h2>
            {analyticsData ? (
                <div>
                    <p>Total Users: {analyticsData.totalUsers}</p>
                    <p>Total Posts: {analyticsData.totalPosts}</p>
                    <p>Active Users: {analyticsData.activeUsers}</p>
                    {/* Additional analytics data */}
                </div>
            ) : (
                <p>Loading analytics data...</p>
            )}
        </div>
    );
}

export default Analytics;
