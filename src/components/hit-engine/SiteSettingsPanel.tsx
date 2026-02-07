import { useState } from 'react';
import { Settings, RotateCw, Save, Image, Type, AlertTriangle, Lock, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HitSiteSettings } from '@/hooks/useHitSiteSettings';

interface SiteSettingsPanelProps {
  settings: HitSiteSettings;
  onUpdate: (updates: Partial<HitSiteSettings>) => void;
  onReset: () => void;
}

export default function SiteSettingsPanel({ settings, onUpdate, onReset }: SiteSettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
  };

  const update = (key: keyof HitSiteSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-xl border border-pink-500/30 bg-gray-950/80 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono">Site Settings</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-red-500/20">
            <RotateCw className="w-3 h-3" /> Reset
          </button>
          <button onClick={handleSave} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-cyan-500/30">
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['logo']} className="space-y-2">
        <AccordionItem value="logo" className="border border-cyan-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-cyan-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Image className="w-4 h-4" /> Logo / Image</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono">Logo URL (Direct Image Link)</label>
              <Input value={localSettings.logoUrl} onChange={e => update('logoUrl', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs mt-1" placeholder="https://..." />
            </div>
            {localSettings.logoUrl && (
              <div className="p-2 rounded-lg bg-gray-800/50">
                <p className="text-[10px] text-gray-500 font-mono mb-1">Preview:</p>
                <img src={localSettings.logoUrl} alt="Logo" className="w-10 h-10 rounded object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="header" className="border border-pink-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-pink-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Header Texts</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 font-mono">Site Name</label>
                <Input value={localSettings.siteName} onChange={e => update('siteName', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white font-mono text-xs mt-1" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-mono">Admin Button</label>
                <Input value={localSettings.adminButtonText} onChange={e => update('adminButtonText', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white font-mono text-xs mt-1" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="warning" className="border border-yellow-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-yellow-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Warning Banner</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono">Warning Text</label>
              <Input value={localSettings.warningText} onChange={e => update('warningText', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs mt-1" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono">Disclaimer Title</label>
              <Input value={localSettings.disclaimerTitle} onChange={e => update('disclaimerTitle', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs mt-1" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono">Disclaimer Text</label>
              <Textarea value={localSettings.disclaimerText} onChange={e => update('disclaimerText', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs mt-1 h-20" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="quickhit" className="border border-green-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-green-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Quick Hit Engine</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <Input value={localSettings.quickHitTitle} onChange={e => update('quickHitTitle', e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Quick Hit Title" />
            <div className="grid grid-cols-2 gap-3">
              <Input value={localSettings.phoneLabel} onChange={e => update('phoneLabel', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Phone Label" />
              <Input value={localSettings.phonePlaceholder} onChange={e => update('phonePlaceholder', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Placeholder" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input value={localSettings.hitButtonText} onChange={e => update('hitButtonText', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Hit Button" />
              <Input value={localSettings.stopButtonText} onChange={e => update('stopButtonText', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Stop Button" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="admin" className="border border-purple-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-purple-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Admin Panel</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <Input value={localSettings.adminPanelTitle} onChange={e => update('adminPanelTitle', e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Admin Panel Title" />
            <Input value={localSettings.logoutButtonText} onChange={e => update('logoutButtonText', e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Logout Button" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security" className="border border-orange-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-orange-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Security (Admin Password)</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <Input type="password" value={localSettings.adminPassword} onChange={e => update('adminPassword', e.target.value)}
              className="bg-gray-900 border-gray-700 text-white font-mono text-xs" placeholder="Admin Password" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proxy" className="border border-green-500/20 rounded-lg px-3 bg-gray-900/30">
          <AccordionTrigger className="text-xs font-bold text-green-400 font-mono py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Home className="w-4 h-4" /> Residential Proxy</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <Input value={localSettings.residentialProxyUrl} onChange={e => update('residentialProxyUrl', e.target.value)}
              className="bg-gray-900 border-gray-700 text-purple-400 font-mono text-xs" placeholder="http://user:pass@host:port" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
