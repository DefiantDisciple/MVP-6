'use client';

import { useState } from 'react';
import { actorFactory, CANISTER_IDS } from '../ic/agent';
import { idlFactory as coreIdl } from '../ic/declarations/core';

export default function CreateTender() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      if (!CANISTER_IDS.core) {
        throw new Error('Core canister ID not configured');
      }

      const coreActor = actorFactory(CANISTER_IDS.core, coreIdl);
      const closingTs = BigInt(new Date(closingDate).getTime());
      
      const response = await coreActor.create_tender(title, description, closingTs);
      setResult(`Tender created successfully! ID: ${response.tender_id}`);
      setTitle('');
      setDescription('');
      setClosingDate('');
    } catch (error) {
      console.error('Error creating tender:', error);
      setResult('Error creating tender. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Create Tender (Preview)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Closing Date</label>
          <input
            type="datetime-local"
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Tender'}
        </button>
      </form>
      {result && (
        <div className={`mt-4 p-3 rounded ${result.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  );
}
