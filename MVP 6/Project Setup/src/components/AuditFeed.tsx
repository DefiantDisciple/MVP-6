'use client';

import { useState, useEffect } from 'react';
import { actorFactory, CANISTER_IDS } from '../ic/agent';
import { idlFactory as auditIdl } from '../ic/declarations/audit';

interface AuditEvent {
  ts: bigint;
  source: string;
  kind: string;
  data: string;
}

interface AuditFeedProps {
  limit?: number;
}

export default function AuditFeed({ limit = 10 }: AuditFeedProps) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!CANISTER_IDS.audit) {
          console.warn('Audit canister ID not configured');
          setLoading(false);
          return;
        }

        const auditActor = actorFactory(CANISTER_IDS.audit, auditIdl);
        const result = await auditActor.get_events(limit);
        setEvents(result);
      } catch (error) {
        console.error('Error fetching audit events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  if (loading) {
    return <div className="p-4">Loading audit events...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Audit Feed</h3>
      {events.length === 0 ? (
        <p className="text-gray-500">No audit events available.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{event.kind}</span>
                  <span className="text-xs text-gray-500 ml-2">from {event.source}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(Number(event.ts)).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{event.data}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
