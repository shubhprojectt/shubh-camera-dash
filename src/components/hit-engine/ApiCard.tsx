import { HitApi } from '@/hooks/useHitApis';
import { Switch } from '@/components/ui/switch';
import { Zap, Globe, Shield, RotateCw, Home, Edit2 } from 'lucide-react';

interface ApiCardProps {
  api: HitApi;
  onToggle: () => void;
  onToggleProxy: () => void;
  onToggleResidential: () => void;
  onToggleRotation: () => void;
  onToggleForce: () => void;
  onEdit: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-400 border-green-500/30',
  POST: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function ApiCard({ api, onToggle, onToggleProxy, onToggleResidential, onToggleRotation, onToggleForce, onEdit }: ApiCardProps) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-all ${api.enabled ? 'border-pink-500/30 bg-gray-950/80' : 'border-gray-800 bg-gray-950/40 opacity-60'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${methodColors[api.method] || methodColors.GET}`}>
              {api.method}
            </span>
            <h3 className="text-sm font-bold text-pink-400 font-mono truncate">{api.name}</h3>
          </div>
          <p className="text-[10px] text-gray-500 font-mono truncate">{api.url}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
            <Zap className="w-3 h-3" /> Enable
          </span>
          <Switch checked={api.enabled} onCheckedChange={onToggle} />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
            <Globe className="w-3 h-3" /> Proxy
          </span>
          <Switch checked={api.proxy_enabled} onCheckedChange={onToggleProxy} />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
            <Shield className="w-3 h-3" /> Force
          </span>
          <Switch checked={api.force_proxy} onCheckedChange={onToggleForce} />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> Rotate
          </span>
          <Switch checked={api.rotation_enabled} onCheckedChange={onToggleRotation} />
        </div>
      </div>

      <button onClick={() => {}} className="w-full flex items-center justify-center gap-1 p-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono">
        <Home className="w-3 h-3" /> Residential
      </button>

      <button onClick={onEdit}
        className="w-full py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 text-xs font-mono font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
        <Edit2 className="w-3.5 h-3.5" /> Edit
      </button>
    </div>
  );
}
