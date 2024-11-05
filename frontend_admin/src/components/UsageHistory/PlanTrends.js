import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the necessary chart components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

const PlanTrends = () => {
    const [trends, setTrends] = useState({ upgrades: 50, downgrades: 70 });
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('bar'); // Default chart type

    useEffect(() => {
        const fetchTrends = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/plans/trends', {
                    params: {
                        startDate: '2024-09-01',
                        endDate: '2024-09-30'
                    }
                });
                setTrends(response.data);
            } catch (error) {
                console.error('Error fetching trends:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    const data = {
        labels: ['Upgrades', 'Downgrades'],
        datasets: [
            {
                label: 'Plan Change Trends',
                data: [trends.upgrades, trends.downgrades],
                backgroundColor: ['#4caf50', '#f44336'],
                borderColor: ['#4caf50', '#f44336'],
                borderWidth: 1,
            },
        ],
    };

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
            case 'line':
                return <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
            case 'pie':
                return <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
            default:
                return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
        }
    };

    return (
        <div>
            <h2>Plan Upgrade/Downgrade Trends</h2>
            <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
            </select>
            {loading ? (
                <p>Loading trends...</p>
            ) : (
                <div style={{ width: '80%', height: '400px' }}>
                    {renderChart()}
                </div>
            )}
        </div>
    );
};

export default PlanTrends;
