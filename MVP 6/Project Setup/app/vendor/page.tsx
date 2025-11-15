'use client';

import { useState } from 'react';
import Link from 'next/link';
import TendersList from '../../src/components/TendersList';
import CreateTender from '../../src/components/CreateTender';
import SubmitBid from '../../src/components/SubmitBid';
import AwardTender from '../../src/components/AwardTender';
import AuditFeed from '../../src/components/AuditFeed';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('open-tenders');

  const tabs = [
    { id: 'open-tenders', label: 'Open Tenders' },
    { id: 'clarifications', label: 'Clarifications' },
    { id: 'my-submissions', label: 'My Submissions' },
    { id: 'notice-to-award', label: 'Notice to Award' },
    { id: 'awarded', label: 'Awarded' },
    { id: 'active', label: 'Active' },
    { id: 'closed', label: 'Closed' },
    { id: 'my-disputes', label: 'My Disputes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendors Dashboard</h1>
              <p className="text-gray-600">Browse tenders and manage submissions</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'open-tenders' && (
              <div className="space-y-6">
                <TendersList />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CreateTender />
                  <SubmitBid />
                </div>
                
                <AwardTender />
              </div>
            )}
            
            {activeTab !== 'open-tenders' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500">
                  This section is available in Preview Mode. Content will be populated with real data.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Audit Feed */}
        <div className="bg-white rounded-lg shadow">
          <AuditFeed limit={20} />
        </div>
      </div>
    </div>
  );
}
