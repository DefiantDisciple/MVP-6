'use client';

import { useState } from 'react';
import { actorFactory, CANISTER_IDS } from '../ic/agent';
import { idlFactory as coreIdl } from '../ic/declarations/core';

export default function AwardTender() {
  const [tenderId, setTenderId] = useState('');
  const [winnerBidId, setWinnerBidId] = useState('');
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
      const success = await coreActor.award_tender(
        parseInt(tenderId),
        parseInt(winnerBidId)
      );
      
      if (success) {
        setResult(`Tender ${tenderId} awarded successfully to bid ${winnerBidId}!`);
        setTenderId('');
        setWinnerBidId('');
      } else {
        setResult('Failed to award tender. Please check the IDs and try again.');
      }
    } catch (error) {
      console.error('Error awarding tender:', error);
      setResult('Error awarding tender. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Award Tender (Preview)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tender ID</label>
          <input
            type="number"
            value={tenderId}
            onChange={(e) => setTenderId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Winner Bid ID</label>
          <input
            type="number"
            value={winnerBidId}
            onChange={(e) => setWinnerBidId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Awarding...' : 'Award Tender'}
        </button>
      </form>
      {result && (
        <div className={`mt-4 p-3 rounded ${result.includes('Error') || result.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  );
}
