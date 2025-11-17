'use client';

import { useState, useEffect } from 'react';
import { actorFactory, CANISTER_IDS } from '../ic/agent';
import { idlFactory as coreIdl } from '../ic/declarations/core';

interface TenderSummary {
  tender_id: bigint;
  title: string;
  closing_ts: bigint;
}

export default function TendersList() {
  const [tenders, setTenders] = useState<TenderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        if (!CANISTER_IDS.core) {
          console.warn('Core canister ID not configured');
          setLoading(false);
          return;
        }

        const coreActor = actorFactory(CANISTER_IDS.core, coreIdl);
        const result = await coreActor.list_open_tenders();
        setTenders(result);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  if (loading) {
    return <div className="p-4">Loading tenders...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Open Tenders</h3>
      {tenders.length === 0 ? (
        <p className="text-gray-500">No open tenders available.</p>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => (
            <div key={tender.tender_id.toString()} className="border rounded-lg p-4">
              <h4 className="font-medium">{tender.title}</h4>
              <p className="text-sm text-gray-600">
                Tender ID: {tender.tender_id.toString()}
              </p>
              <p className="text-sm text-gray-600">
                Closing: {new Date(Number(tender.closing_ts)).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
