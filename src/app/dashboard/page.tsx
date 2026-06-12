import React, { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
