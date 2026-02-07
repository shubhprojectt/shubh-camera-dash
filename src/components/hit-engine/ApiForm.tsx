import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { HitApi } from '@/hooks/useHitApis';

type ApiFormData = Omit<HitApi, 'id'>;

const emptyForm: ApiFormData = {
  name: '', url: '', method: 'POST',
  headers: {}, body: {}, bodyType: 'json',
  query_params: {}, enabled: true,
  proxy_enabled: false, force_proxy: false,
  rotation_enabled: false, residential_proxy_enabled: false,
};

interface ApiFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApiFormData) => void;
  editApi?: HitApi | null;
}

export default function ApiForm({ open, onClose, onSubmit, editApi }: ApiFormProps) {
  const [form, setForm] = useState<ApiFormData>(emptyForm);
  const [headersStr, setHeadersStr] = useState('{}');
  const [bodyStr, setBodyStr] = useState('{}');
  const [queryStr, setQueryStr] = useState('{}');

  useEffect(() => {
    if (editApi) {
      setForm({ ...editApi });
      setHeadersStr(JSON.stringify(editApi.headers, null, 2));
      setBodyStr(JSON.stringify(editApi.body, null, 2));
      setQueryStr(JSON.stringify(editApi.query_params, null, 2));
    } else {
      setForm(emptyForm);
      setHeadersStr('{}');
      setBodyStr('{}');
      setQueryStr('{}');
    }
  }, [editApi, open]);

  const handleSubmit = () => {
    try {
      const headers = JSON.parse(headersStr);
      let body = {};
      
      // Smart parsing for form-urlencoded
      if (form.bodyType === 'form-urlencoded' && bodyStr.includes('=') && !bodyStr.startsWith('{')) {
        const params = new URLSearchParams(bodyStr);
        body = Object.fromEntries(params);
      } else {
        body = JSON.parse(bodyStr || '{}');
      }
      
      const query_params = JSON.parse(queryStr || '{}');
      onSubmit({ ...form, headers, body, query_params });
      onClose();
    } catch (err) {
      alert('Invalid JSON in headers, body, or query params');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-pink-500/30 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pink-400 font-mono">{editApi ? 'Edit API' : 'Add API'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-cyan-400 font-mono text-xs">Name</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="bg-gray-900 border-gray-700 text-white font-mono" placeholder="API Name" />
          </div>
          <div>
            <Label className="text-cyan-400 font-mono text-xs">URL</Label>
            <Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              className="bg-gray-900 border-gray-700 text-white font-mono" placeholder="https://api.example.com/{PHONE}" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-cyan-400 font-mono text-xs">Method</Label>
              <Select value={form.method} onValueChange={v => setForm(p => ({ ...p, method: v as HitApi['method'] }))}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                    <SelectItem key={m} value={m} className="text-white font-mono">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-cyan-400 font-mono text-xs">Body Type</Label>
              <Select value={form.bodyType} onValueChange={v => setForm(p => ({ ...p, bodyType: v as HitApi['bodyType'] }))}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {['json', 'form-urlencoded', 'multipart', 'text', 'none'].map(t => (
                    <SelectItem key={t} value={t} className="text-white font-mono">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-cyan-400 font-mono text-xs">Headers (JSON)</Label>
            <Textarea value={headersStr} onChange={e => setHeadersStr(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs h-20" placeholder='{"Content-Type": "application/json"}' />
          </div>
          <div>
            <Label className="text-cyan-400 font-mono text-xs">Body (JSON)</Label>
            <Textarea value={bodyStr} onChange={e => setBodyStr(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs h-20" placeholder='{"phone": "{PHONE}"}' />
          </div>
          <div>
            <Label className="text-cyan-400 font-mono text-xs">Query Params (JSON)</Label>
            <Textarea value={queryStr} onChange={e => setQueryStr(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs h-16" placeholder='{"key": "value"}' />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
              <span className="text-[10px] text-gray-400 font-mono">Enabled</span>
              <Switch checked={form.enabled} onCheckedChange={v => setForm(p => ({ ...p, enabled: v }))} />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
              <span className="text-[10px] text-gray-400 font-mono">Proxy</span>
              <Switch checked={form.proxy_enabled} onCheckedChange={v => setForm(p => ({ ...p, proxy_enabled: v }))} />
            </div>
          </div>

          <button onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-mono font-bold hover:opacity-90 transition-all">
            {editApi ? 'Update API' : 'Add API'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
