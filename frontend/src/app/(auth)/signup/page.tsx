'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
        // Expected payload: { companyName, country, adminName, email, password }
      const response = await apiClient.post('/auth/signup', data);
      if(response.data.success) {
          router.push('/login');
      }
    } catch (error) {
      console.error('Signup failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Register Company
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <input
              {...register('companyName', { required: true })}
              placeholder="Company Name"
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              {...register('country', { required: true })}
              placeholder="Country (e.g., India, USA)"
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              {...register('adminName', { required: true })}
              placeholder="Admin Full Name"
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Admin Email"
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="Password"
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Creating...' : 'Register System'}
          </button>
        </form>
      </div>
    </div>
  );
}