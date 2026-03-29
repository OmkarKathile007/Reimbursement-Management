'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/auth/login', data);
      if (response.data.success) {
        // Assume API returns: { success: true, data: { token: "..." } }
        login(response.data.data.token);
        // Route based on role would go here; for now, go to dashboard
        router.push('/admin/dashboard'); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign In
        </h2>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email address"
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center text-sm">
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register a new company instead
          </Link>
        </div>
      </div>
    </div>
  );
}