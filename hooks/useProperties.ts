// hooks/useProperties.ts
'use client';

import { useEffect, useState } from 'react';
import { getClientDb } from '@/lib/db/client-db';
import { properties, agents, images } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export function useProperties(filters?: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const db = getClientDb();
        
        let query = db
          .select({
            property: properties,
            agent: agents,
          })
          .from(properties)
          .leftJoin(agents, eq(properties.agentId, agents.id))
          .where(eq(properties.status, 'active'))
          .orderBy(desc(properties.createdAt))
          .limit(20);

        const results = await query;
        setData(results);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [filters]);

  return { data, loading, error };
}