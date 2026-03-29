// 'use client';

// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { apiClient } from '@/lib/axios';
// import { Reimbursement } from '@/types';

// export default function EmployeeDashboard() {
//   const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { register, handleSubmit, reset } = useForm();

//   const fetchReimbursements = async () => {
//     try {
//       const res = await apiClient.get('/reimbursements/me');
//       if (res.data.success) {
//         setReimbursements(res.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReimbursements();
//   }, []);

//   const onSubmit = async (data: any) => {
//     try {
//       // Amount must be sent as a number
//       const payload = { ...data, amount: parseFloat(data.amount) };
//       const res = await apiClient.post('/reimbursements', payload);
//       if (res.data.success) {
//         reset();
//         fetchReimbursements(); // Refresh list
//       }
//     } catch (error) {
//       console.error('Failed to submit', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="mx-auto max-w-5xl space-y-8">
//         <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>

//         {/* Submit Form */}
//         <div className="rounded-xl bg-white p-6 shadow">
//           <h2 className="mb-4 text-xl font-semibold">Submit New Expense</h2>
//           <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
//             <input
//               {...register('amount', { required: true, min: 0.01 })}
//               type="number"
//               step="0.01"
//               placeholder="Amount"
//               className="w-1/4 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             />
//             <input
//               {...register('description', { required: true })}
//               type="text"
//               placeholder="Description (e.g., Client Dinner)"
//               className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             />
//             <button
//               type="submit"
//               className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 transition-colors"
//             >
//               Submit
//             </button>
//           </form>
//         </div>

//         {/* Expense List */}
//         <div className="rounded-xl bg-white shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
//               ) : reimbursements.map((item) => (
//                 <tr key={item.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  managerName: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, watch } = useForm();
  const selectedRole = watch('role');

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        managerId: data.managerId === "" ? null : data.managerId
      };
      const res = await apiClient.post('/admin/users', payload);
      if (res.data.success) {
        reset();
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user', error);
      alert('Error creating user. Check console.');
    }
  };

  // Filter out managers so we can assign them to employees
  const availableManagers = users.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard - User Management</h1>

        {/* Create User Form */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Create New User</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              {...register('name', { required: true })}
              placeholder="Full Name"
              className="rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email"
              className="rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="Temporary Password"
              className="rounded-md border border-gray-300 px-3 py-2"
            />
            <select
              {...register('role', { required: true })}
              className="rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select Role...</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>

            {/* Only show Manager dropdown if creating an Employee */}
            {selectedRole === 'EMPLOYEE' && (
              <select
                {...register('managerId')}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Assign to Manager (Optional)</option>
                {availableManagers.map((mgr) => (
                  <option key={mgr.id} value={mgr.id}>
                    {mgr.name} ({mgr.role})
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              className="col-span-full rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 md:col-span-1"
            >
              Create User
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="rounded-xl bg-white shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports To</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.managerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}