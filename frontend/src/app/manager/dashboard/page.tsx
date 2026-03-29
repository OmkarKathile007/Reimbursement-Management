// 'use client';

// import { useEffect, useState } from 'react';
// import { apiClient } from '@/lib/axios';

// interface TeamReimbursement {
//   id: string;
//   amount: number;
//   currency: string;
//   description: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
//   createdAt: string;
//   user: {
//     name: string;
//     email: string;
//   };
// }

// export default function ManagerDashboard() {
//   const [teamRequests, setTeamRequests] = useState<TeamReimbursement[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTeamRequests = async () => {
//     try {
//       const res = await apiClient.get('/reimbursements/team');
//       if (res.data.success) {
//         setTeamRequests(res.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch team requests', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamRequests();
//   }, []);

//   const handleAction = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
//     try {
//       const res = await apiClient.put(`/reimbursements/${id}/status`, { status: newStatus });
//       if (res.data.success) {
//         fetchTeamRequests(); // Refresh the list after action
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Failed to update status');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="mx-auto max-w-6xl space-y-8">
//         <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard - Team Expenses</h1>

//         <div className="rounded-xl bg-white shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr><td colSpan={6} className="px-6 py-4 text-center">Loading team data...</td></tr>
//               ) : teamRequests.length === 0 ? (
//                 <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No pending requests from your team.</td></tr>
//               ) : teamRequests.map((item) => (
//                 <tr key={item.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{item.user?.name || 'Unknown'}</div>
//                     <div className="text-sm text-gray-500">{item.user?.email}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
//                     {item.currency} {item.amount.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                       ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
//                         item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
//                         'bg-yellow-100 text-yellow-800'}`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                     {item.status === 'PENDING' ? (
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleAction(item.id, 'APPROVED')}
//                           className="rounded bg-green-50 text-green-600 px-3 py-1 hover:bg-green-100 transition"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => handleAction(item.id, 'REJECTED')}
//                           className="rounded bg-red-50 text-red-600 px-3 py-1 hover:bg-red-100 transition"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     ) : (
//                       <span className="text-gray-400">Processed</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';
import { Expense, PaginatedResponse } from '@/types';

// Extend the Expense type locally to include the new fields we added to the DTO
interface TeamExpense extends Expense {
  employeeName: string;
  employeeEmail: string;
}

export default function ManagerDashboard() {
  const [teamExpenses, setTeamExpenses] = useState<TeamExpense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTeamExpenses = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/expenses/team?page=${currentPage}&size=10`);
      if (res.data.success) {
        const pageData: PaginatedResponse<TeamExpense> = res.data.data;
        setTeamExpenses(pageData.content);
        setTotalPages(pageData.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch team expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamExpenses(page);
  }, [page]);

  const handleAction = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await apiClient.put(`/expenses/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchTeamExpenses(page); // Refresh the current page
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard - Approvals</h1>

        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Team Expense Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Converted</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading team requests...</td></tr>
                ) : teamExpenses.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No pending requests from your team.</td></tr>
                ) : teamExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{expense.employeeName}</div>
                      <div className="text-xs text-gray-500">{expense.employeeEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(expense.expenseDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 font-semibold">{expense.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.originalCurrency} {expense.originalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {expense.convertedAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {expense.status === 'PENDING' ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleAction(expense.id, 'APPROVED')}
                            className="rounded-md bg-green-50 text-green-700 px-4 py-1.5 text-sm font-medium hover:bg-green-100 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(expense.id, 'REJECTED')}
                            className="rounded-md bg-red-50 text-red-700 px-4 py-1.5 text-sm font-medium hover:bg-red-100 transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {expense.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && teamExpenses.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}