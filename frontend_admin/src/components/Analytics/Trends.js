import React, { useEffect, useState } from 'react';

const Trends = () => {
  const [trendsData, setTrendsData] = useState([]);

  useEffect(() => {
    const fetchTrendsData = async () => {
      const response = await fetch('/api/trends'); // Placeholder API
      const data = await response.json();
      setTrendsData(data);
    };
    fetchTrendsData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trends</h2>
      <ul>
        {trendsData.map(trend => (
          <li key={trend.id} className="border-b py-2">
            <strong>{trend.name}:</strong> {trend.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trends;
