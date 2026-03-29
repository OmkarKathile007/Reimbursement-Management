'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/axios';
import { Reimbursement } from '@/types';

export default function EmployeeDashboard() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const fetchReimbursements = async () => {
    try {
      const res = await apiClient.get('/reimbursements/me');
      if (res.data.success) {
        setReimbursements(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      // Amount must be sent as a number
      const payload = { ...data, amount: parseFloat(data.amount) };
      const res = await apiClient.post('/reimbursements', payload);
      if (res.data.success) {
        reset();
        fetchReimbursements(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to submit', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>

        {/* Submit Form */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Submit New Expense</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
            <input
              {...register('amount', { required: true, min: 0.01 })}
              type="number"
              step="0.01"
              placeholder="Amount"
              className="w-1/4 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              {...register('description', { required: true })}
              type="text"
              placeholder="Description (e.g., Client Dinner)"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="rounded-xl bg-white shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : reimbursements.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}