import React, { useEffect, useState } from 'react';
import { fetchAuditData } from '../../services/api'; // Adjust the import based on your file structure

const AuditTrail = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch audit data when the component mounts
  useEffect(() => {
    const loadAuditData = async () => {
      try {
        const data = await fetchAuditData(); // Fetch audit data using the utility function
        setAuditData(data);
      } catch (err) {
        setError(err.message); // Set error message based on the error caught
      } finally {
        setLoading(false); // Always stop loading state
      }
    };

    loadAuditData();
  }, []);

  if (loading) {
    return <div className="loading">Loading audit trail...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="audit-trail-container">
      <h2>Admin Audit Trail</h2>

      <table className="audit-trail-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Change Type</th>
            <th>Admin ID</th>
            <th>OTP Validation Status</th>
          </tr>
        </thead>
        <tbody>
          {auditData.length > 0 ? (
            auditData.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                <td>{record.changeType}</td>
                <td>{record.adminId}</td>
                <td>{record.otpStatus ? 'Success' : 'Failed'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No audit records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTrail;
