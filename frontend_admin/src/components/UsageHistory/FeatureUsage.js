// FeatureUsage.js
import React, { useState, useEffect } from 'react';
import { fetchFeatureUsage } from '../../services/api'; // Adjust the path based on your directory structure

const FeatureUsage = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeatureUsage = async () => {
      try {
        const data = await fetchFeatureUsage(); // Fetch data using the API call
        setUsageData(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching feature usage data');
        setLoading(false);
      }
    };

    getFeatureUsage();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Feature Usage</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Feature</th>
            <th className="py-2 px-4 border-b">Usage Count</th>
          </tr>
        </thead>
        <tbody>
          {usageData.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{item._id}</td>
              <td className="py-2 px-4 border-b">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureUsage;
