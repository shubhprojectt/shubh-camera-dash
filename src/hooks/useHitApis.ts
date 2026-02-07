import { useState, useEffect, useCallback } from 'react';

export interface HitApi {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body: Record<string, unknown>;
  bodyType: 'json' | 'form-urlencoded' | 'multipart' | 'text' | 'none';
  query_params: Record<string, string>;
  enabled: boolean;
  proxy_enabled: boolean;
  force_proxy: boolean;
  rotation_enabled: boolean;
  residential_proxy_enabled: boolean;
}

const STORAGE_KEY = 'admin_apis';

const loadApis = (): HitApi[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function useHitApis() {
  const [apis, setApis] = useState<HitApi[]>(() => loadApis());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(apis)); } catch {}
  }, [apis]);

  const addApi = useCallback((api: Omit<HitApi, 'id'>) => {
    const newApi: HitApi = { ...api, id: crypto.randomUUID() };
    setApis(prev => [...prev, newApi]);
    return newApi;
  }, []);

  const updateApi = useCallback((id: string, updates: Partial<HitApi>) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteApi = useCallback((id: string) => {
    setApis(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleApi = useCallback((id: string) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  }, []);

  const toggleAll = useCallback((enabled: boolean) => {
    setApis(prev => prev.map(a => ({ ...a, enabled })));
  }, []);

  const enabledApis = apis.filter(a => a.enabled);

  return { apis, enabledApis, addApi, updateApi, deleteApi, toggleApi, toggleAll, setApis };
}
