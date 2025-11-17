'use client';

import Link from 'next/link';
import TendersList from '../../src/components/TendersList';
import SubmitBid from '../../src/components/SubmitBid';
import AuditFeed from '../../src/components/AuditFeed';

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buyers Dashboard</h1>
              <p className="text-gray-600">Manage tenders and review submissions</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow">
              <TendersList />
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <SubmitBid />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <AuditFeed limit={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
