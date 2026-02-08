import { useState, useRef } from 'react';
import { Upload, FileJson, CheckCircle } from 'lucide-react';
import type { HitApi } from '@/hooks/useHitApis';
import { toast } from 'sonner';

interface BulkImporterProps {
  onBulkImport: (apis: Omit<HitApi, 'id'>[]) => void;
}

function validateApi(obj: Record<string, unknown>): Omit<HitApi, 'id'> | null {
  if (!obj.url || typeof obj.url !== 'string') return null;
  return {
    name: (obj.name as string) || 'Imported API',
    url: obj.url as string,
    method: (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(String(obj.method).toUpperCase()) 
      ? String(obj.method).toUpperCase() 
      : 'GET') as HitApi['method'],
    headers: (typeof obj.headers === 'object' && obj.headers !== null ? obj.headers : {}) as Record<string, string>,
    body: (typeof obj.body === 'object' && obj.body !== null ? obj.body : {}) as Record<string, unknown>,
    bodyType: (['json', 'form-urlencoded', 'multipart', 'text', 'none'].includes(String(obj.bodyType || obj.body_type))
      ? String(obj.bodyType || obj.body_type)
      : 'none') as HitApi['bodyType'],
    query_params: (typeof obj.query_params === 'object' && obj.query_params !== null ? obj.query_params : {}) as Record<string, string>,
    enabled: obj.enabled !== false,
    proxy_enabled: !!obj.proxy_enabled,
    force_proxy: !!obj.force_proxy,
    rotation_enabled: !!obj.rotation_enabled,
    residential_proxy_enabled: !!obj.residential_proxy_enabled,
  };
}

export default function BulkImporter({ onBulkImport }: BulkImporterProps) {
  const [preview, setPreview] = useState<Omit<HitApi, 'id'>[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed)) {
          toast.error('JSON file must contain an array of APIs');
          return;
        }
        const valid = parsed.map(validateApi).filter(Boolean) as Omit<HitApi, 'id'>[];
        if (valid.length === 0) {
          toast.error('No valid APIs found in file');
          return;
        }
        setPreview(valid);
        toast.success(`${valid.length} APIs parsed from file`);
      } catch {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportAll = () => {
    if (!preview) return;
    onBulkImport(preview);
    setPreview(null);
  };

  return (
    <div className="rounded-xl border border-orange-500/30 bg-gray-950/80 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="w-5 h-5 text-orange-400" />
        <h3 className="text-sm font-bold text-orange-400 font-mono">Bulk Import (JSON)</h3>
      </div>

      <p className="text-[10px] text-gray-500 font-mono">
        Export kiya hua JSON file select karo — saari APIs ek sath import ho jayegi.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFile}
        className="hidden"
      />

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full py-3 rounded-xl border-2 border-dashed border-orange-500/30 bg-orange-500/5 text-orange-400 font-mono text-sm font-bold hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2"
      >
        <FileJson className="w-4 h-4" /> Select JSON File
      </button>

      {preview && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-gray-900/50 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-400 font-mono">{preview.length} APIs Ready</span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {preview.map((api, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{api.method}</span>
                  <span className="text-pink-400 truncate">{api.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleImportAll}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 text-white font-mono font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Import All {preview.length} APIs
          </button>
        </div>
      )}
    </div>
  );
}
