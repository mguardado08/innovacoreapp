import { useEffect, useMemo, useState } from 'react';

import { listResource } from '../services/api';
import { LookupConfig } from '../types/resources';

const lookupCache = new Map<string, { data: Record<string, unknown>[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export const useLookup = (config?: LookupConfig) => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config) {
      return;
    }
    const cached = lookupCache.get(config.endpoint);
    if (cached && cached.data.length > 0 && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      return;
    }
    setLoading(true);
    listResource(config.endpoint)
      .then((response) => {
        const items = Array.isArray(response) ? response : response.results ?? [];
        lookupCache.set(config.endpoint, { data: items, timestamp: Date.now() });
        setData(items);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      })
      .finally(() => setLoading(false));
  }, [config]);

  const options = useMemo(() => {
    if (!config) {
      return [];
    }
    const valueKey = config.valueKey ?? 'id';
    return data.map((item) => {
      const label = config.labelFn
        ? config.labelFn(item)
        : config.labelKey
          ? String(item[config.labelKey] ?? '')
          : String(item['nombre'] ?? item[valueKey] ?? '');
      return { label, value: item[valueKey] as string | number };
    });
  }, [config, data]);

  return { options, loading, error };
};
