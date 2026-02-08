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

  const inputClass = "bg-white/[0.04] border-white/[0.08] text-white text-xs placeholder:text-white/15 focus:border-violet-500/40";

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
            <Settings className="w-4 h-4 text-white/50" />
          </div>
          <h3 className="text-sm font-semibold text-white/90">Settings</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset} className="h-8 px-3 rounded-lg bg-red-500/[0.08] border border-red-500/[0.15] text-red-400/70 text-[11px] font-medium flex items-center gap-1 hover:bg-red-500/[0.15] transition-colors">
            <RotateCw className="w-3 h-3" /> Reset
          </button>
          <button onClick={handleSave} className="h-8 px-3 rounded-lg bg-violet-600 text-white text-[11px] font-medium flex items-center gap-1 hover:bg-violet-700 transition-colors">
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['logo']} className="space-y-2">
        <AccordionItem value="logo" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Image className="w-4 h-4" /> Logo / Image</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30">Logo URL</label>
              <Input value={localSettings.logoUrl} onChange={e => update('logoUrl', e.target.value)}
                className={inputClass} placeholder="https://..." />
            </div>
            {localSettings.logoUrl && (
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <p className="text-[10px] text-white/25 mb-1">Preview:</p>
                <img src={localSettings.logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="header" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Header Texts</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/30">Site Name</label>
                <Input value={localSettings.siteName} onChange={e => update('siteName', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/30">Admin Button</label>
                <Input value={localSettings.adminButtonText} onChange={e => update('adminButtonText', e.target.value)} className={inputClass} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="warning" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Warning Banner</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30">Warning Text</label>
              <Input value={localSettings.warningText} onChange={e => update('warningText', e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30">Disclaimer Title</label>
              <Input value={localSettings.disclaimerTitle} onChange={e => update('disclaimerTitle', e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30">Disclaimer Text</label>
              <Textarea value={localSettings.disclaimerText} onChange={e => update('disclaimerText', e.target.value)}
                className={`${inputClass} h-20`} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="quickhit" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Quick Hit Engine</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <Input value={localSettings.quickHitTitle} onChange={e => update('quickHitTitle', e.target.value)} className={inputClass} placeholder="Title" />
            <div className="grid grid-cols-2 gap-3">
              <Input value={localSettings.phoneLabel} onChange={e => update('phoneLabel', e.target.value)} className={inputClass} placeholder="Phone Label" />
              <Input value={localSettings.phonePlaceholder} onChange={e => update('phonePlaceholder', e.target.value)} className={inputClass} placeholder="Placeholder" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input value={localSettings.hitButtonText} onChange={e => update('hitButtonText', e.target.value)} className={inputClass} placeholder="Hit Button" />
              <Input value={localSettings.stopButtonText} onChange={e => update('stopButtonText', e.target.value)} className={inputClass} placeholder="Stop Button" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="admin" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Admin Panel</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <Input value={localSettings.adminPanelTitle} onChange={e => update('adminPanelTitle', e.target.value)} className={inputClass} placeholder="Title" />
            <Input value={localSettings.logoutButtonText} onChange={e => update('logoutButtonText', e.target.value)} className={inputClass} placeholder="Logout Button" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Security</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <Input type="password" value={localSettings.adminPassword} onChange={e => update('adminPassword', e.target.value)}
              className={inputClass} placeholder="Admin Password" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proxy" className="border border-white/[0.06] rounded-xl px-3 bg-white/[0.02]">
          <AccordionTrigger className="text-xs font-medium text-white/60 py-3 hover:no-underline">
            <span className="flex items-center gap-2"><Home className="w-4 h-4" /> Residential Proxy</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <Input value={localSettings.residentialProxyUrl} onChange={e => update('residentialProxyUrl', e.target.value)}
              className={inputClass} placeholder="http://user:pass@host:port" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
