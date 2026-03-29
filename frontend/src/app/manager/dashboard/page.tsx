'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';

interface TeamReimbursement {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function ManagerDashboard() {
  const [teamRequests, setTeamRequests] = useState<TeamReimbursement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamRequests = async () => {
    try {
      const res = await apiClient.get('/reimbursements/team');
      if (res.data.success) {
        setTeamRequests(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch team requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamRequests();
  }, []);

  const handleAction = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await apiClient.put(`/reimbursements/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchTeamRequests(); // Refresh the list after action
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard - Team Expenses</h1>

        <div className="rounded-xl bg-white shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center">Loading team data...</td></tr>
              ) : teamRequests.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No pending requests from your team.</td></tr>
              ) : teamRequests.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.user?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{item.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.currency} {item.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {item.status === 'PENDING' ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleAction(item.id, 'APPROVED')}
                          className="rounded bg-green-50 text-green-600 px-3 py-1 hover:bg-green-100 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'REJECTED')}
                          className="rounded bg-red-50 text-red-600 px-3 py-1 hover:bg-red-100 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}