import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../services/api'; // Adjust the path as necessary

const RecruiterList = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getRecruiters = async () => {
      try {
        const data = await fetchUsers(); // Fetch users from API
        console.log(data); // Log the data for debugging
        setRecruiters(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getRecruiters();
  }, []);

  if (loading) return <p className="text-center text-blue-500 font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Recruiters</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200 text-left bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">#</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Name</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Email</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Plan</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Status</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Type</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Joined Date</th>
              <th className="p-3 border border-gray-200 text-gray-600 font-semibold">Plan Expiration</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((recruiter, index) => (
              <tr
                key={recruiter.id}
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}
              >
                <td className="p-3 border border-gray-200 text-gray-700">{index + 1}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{recruiter.name}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{recruiter.email}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{recruiter.plan}</td>
                <td className="p-3 border border-gray-200 text-gray-700">
                  {recruiter.status === 'Active' ? (
                    <span className="text-green-500 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-3 border border-gray-200 text-gray-700">{recruiter.type}</td>
                <td className="p-3 border border-gray-200 text-gray-700">
                  {recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-3 border border-gray-200 text-gray-700">
                  {recruiter.planExpiration
                    ? new Date(recruiter.planExpiration).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecruiterList;
