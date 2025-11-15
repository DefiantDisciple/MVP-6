'use client';

import { useState } from 'react';
import { actorFactory, CANISTER_IDS } from '../ic/agent';
import { idlFactory as coreIdl } from '../ic/declarations/core';

interface SubmitBidProps {
  tenderId?: number;
}

export default function SubmitBid({ tenderId }: SubmitBidProps) {
  const [selectedTenderId, setSelectedTenderId] = useState(tenderId?.toString() || '');
  const [amount, setAmount] = useState('');
  const [docHash, setDocHash] = useState('');
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
      const response = await coreActor.submit_bid(
        parseInt(selectedTenderId),
        BigInt(parseInt(amount)),
        docHash || `doc-hash-${Date.now()}`
      );
      
      setResult(`Bid submitted successfully! ID: ${response.bid_id}`);
      setAmount('');
      setDocHash('');
      if (!tenderId) setSelectedTenderId('');
    } catch (error) {
      console.error('Error submitting bid:', error);
      setResult('Error submitting bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Submit Bid (Preview)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!tenderId && (
          <div>
            <label className="block text-sm font-medium mb-1">Tender ID</label>
            <input
              type="number"
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Bid Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Document Hash (Optional)</label>
          <input
            type="text"
            value={docHash}
            onChange={(e) => setDocHash(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Leave empty for auto-generated hash"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
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
