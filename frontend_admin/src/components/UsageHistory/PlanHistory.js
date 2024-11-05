import React, { useEffect, useState } from 'react';
import { fetchPlanUsageReports } from '../../services/api'; // Adjust the import path

const PlanHistory = () => {
  const [planUsage, setPlanUsage] = useState([]);

  useEffect(() => {
    const getPlanUsageData = async () => {
      try {
        const data = await fetchPlanUsageReports();
        setPlanUsage(data); // Update state with plan usage data
      } catch (error) {
        console.error("Failed to fetch plan usage data:", error);
      }
    };
    getPlanUsageData();
  }, []);

  return (
    <div>
      <h2>Plan Usage Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Plan Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Number of Users</th>
            <th>Revenue</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {planUsage.map((plan, index) => (
            <tr key={index}>
              <td>{plan.plan}</td>
              <td>{new Date(plan.startDate).toLocaleDateString()}</td>
              <td>{new Date(plan.endDate).toLocaleDateString()}</td>
              <td>{plan.count}</td>
              <td>${plan.revenue}</td>
              <td>{plan.isActive ? 'Active' : 'Expired'}</td> {/* Example for status */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanHistory;
