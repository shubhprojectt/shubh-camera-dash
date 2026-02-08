import { HitApi } from '@/hooks/useHitApis';
import { Switch } from '@/components/ui/switch';
import { Zap, Globe, Shield, RotateCw, Home, Edit2, Trash2 } from 'lucide-react';

interface ApiCardProps {
  api: HitApi;
  onToggle: () => void;
  onToggleProxy: () => void;
  onToggleResidential: () => void;
  onToggleRotation: () => void;
  onToggleForce: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/20',
  PATCH: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
};

export default function ApiCard({ api, onToggle, onToggleProxy, onToggleResidential, onToggleRotation, onToggleForce, onEdit, onDelete }: ApiCardProps) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-all ${
      api.enabled 
        ? 'border-white/[0.08] bg-white/[0.03]' 
        : 'border-white/[0.04] bg-white/[0.01] opacity-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${methodColors[api.method] || methodColors.GET}`}>
              {api.method}
            </span>
            <h3 className="text-sm font-medium text-white/90 truncate">{api.name}</h3>
          </div>
          <p className="text-[10px] text-white/25 truncate">{api.url}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {[
          { icon: Zap, label: 'Enable', checked: api.enabled, onChange: onToggle },
          { icon: Globe, label: 'Proxy', checked: api.proxy_enabled, onChange: onToggleProxy },
          { icon: Shield, label: 'Force', checked: api.force_proxy, onChange: onToggleForce },
          { icon: RotateCw, label: 'Rotate', checked: api.rotation_enabled, onChange: onToggleRotation },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-white/35 flex items-center gap-1">
              <item.icon className="w-3 h-3" /> {item.label}
            </span>
            <Switch checked={item.checked} onCheckedChange={item.onChange} />
          </div>
        ))}
      </div>

      <button onClick={() => {}} className="w-full flex items-center justify-center gap-1 p-1.5 rounded-lg bg-violet-500/[0.06] border border-violet-500/[0.1] text-violet-400/60 text-[10px]">
        <Home className="w-3 h-3" /> Residential
      </button>

      <div className="flex gap-2">
        <button onClick={onEdit}
          className="flex-1 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 text-xs font-medium hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2">
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button onClick={onDelete}
          className="h-9 px-4 rounded-xl bg-red-500/[0.08] border border-red-500/[0.15] text-red-400/70 text-xs font-medium hover:bg-red-500/[0.15] transition-colors flex items-center justify-center gap-2">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
