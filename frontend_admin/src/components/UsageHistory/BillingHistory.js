import React, { useEffect, useState } from 'react';
import { billingService } from '../../services/api';

const BillingHistory = () => {
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await billingService.fetchBillingHistory();
        setBillingHistory(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setBillingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const downloadCSV = () => {
    if (billingHistory.length === 0) {
      alert("No billing history to download.");
      return;
    }

    const csvData = [
      ['Invoice Number', 'Amount', 'Renewal Date', 'User Email'],
      ...billingHistory.map(item => [
        item.invoiceNumber,
        `$${item.amount}`,
        new Date(item.renewalDate).toLocaleDateString(),
        item.user?.email || 'N/A'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'billing_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Billing History</h2>
        <div className="space-x-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Refresh Data
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {billingHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No billing records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b">Invoice Number</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Renewal Date</th>
                <th className="py-2 px-4 border-b">User Email</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map(item => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.invoiceNumber}</td>
                  <td className="py-2 px-4 border-b text-right">${item.amount}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(item.renewalDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{item.user?.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillingHistory;
