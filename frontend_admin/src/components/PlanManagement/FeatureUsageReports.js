import React, { useEffect, useState } from 'react';
import { fetchFeatureUsage } from '../../services/api'; // Assuming your API functions are in api.js

const FeatureUsageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeatureUsageReports = async () => {
      setLoading(true);
      try {
        const data = await fetchFeatureUsage();
        setReports(data);
      } catch (err) {
        setError(err.message); // Set the error message to display
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };
    getFeatureUsageReports();
  }, []);

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div>Error: {error}</div>; // Error handling

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feature Usage Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id} className="border-b py-2">
            <strong>{report.featureName}:</strong> {report.usageDetails}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureUsageReports;