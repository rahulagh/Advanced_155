import React, { useEffect, useState } from 'react';

const PlanReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchPlanReports = async () => {
      const response = await fetch('/api/planReports'); // Placeholder API
      const data = await response.json();
      setReports(data);
    };
    fetchPlanReports();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Plan Reports</h2>
      <ul>
        {reports.map(report => (
          <li key={report.id} className="border-b py-2">
            <strong>{report.name}:</strong> {report.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanReports;
