"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      login(data.user, data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create your profile</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#1cb0f6] outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#1cb0f6] outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#1cb0f6] outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-[#ffdfe0] text-[#ff4b4b] p-3 rounded-xl border-2 border-[#ff4b4b] text-sm font-bold text-center">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" fullWidth disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        <div className="text-center">
          <span className="text-[#777777]">Already have an account? </span>
          <Link href="/login" className="text-[#1cb0f6] font-bold uppercase tracking-wide">Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
