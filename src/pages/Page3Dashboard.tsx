import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, List, Code, Settings, AlertTriangle, Plus, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useHitApis } from '@/hooks/useHitApis';
import { useHitLogs } from '@/hooks/useHitLogs';
import { useHitSiteSettings } from '@/hooks/useHitSiteSettings';
import HitEngine from '@/components/hit-engine/HitEngine';
import ApiCard from '@/components/hit-engine/ApiCard';
import ApiForm from '@/components/hit-engine/ApiForm';
import ApiImporter from '@/components/hit-engine/ApiImporter';
import LogsPanel from '@/components/hit-engine/LogsPanel';
import SiteSettingsPanel from '@/components/hit-engine/SiteSettingsPanel';
import type { HitApi } from '@/hooks/useHitApis';

type TabType = 'apis' | 'import' | 'settings';

const Page3Dashboard = () => {
  const navigate = useNavigate();
  const { apis, addApi, updateApi, deleteApi, toggleApi, toggleAll } = useHitApis();
  const { logs, addLog, clearLogs } = useHitLogs();
  const { settings, updateSettings, resetSettings } = useHitSiteSettings();
  const [activeTab, setActiveTab] = useState<TabType>('apis');
  const [showApiForm, setShowApiForm] = useState(false);
  const [editingApi, setEditingApi] = useState<HitApi | null>(null);
  const [allEnabled, setAllEnabled] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('hitAdminAuth') !== 'true') {
      navigate('/page3/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('hitAdminAuth');
    navigate('/page3/admin');
  };

  const handleAddApi = (data: Omit<HitApi, 'id'>) => {
    addApi(data);
    setShowApiForm(false);
  };

  const handleEditApi = (data: Omit<HitApi, 'id'>) => {
    if (editingApi) {
      updateApi(editingApi.id, data);
      setEditingApi(null);
    }
  };

  const handleImport = (data: Omit<HitApi, 'id'>) => {
    addApi(data);
  };

  const handleToggleAll = (enabled: boolean) => {
    setAllEnabled(enabled);
    toggleAll(enabled);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(236,72,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-purple-900/10 to-transparent" />
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 border-b border-pink-500/20 bg-black/60 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              {settings.logoUrl && (
                <img src={settings.logoUrl} alt="Logo" className="w-9 h-9 rounded-full object-cover border border-pink-500/30" />
              )}
              <h1 className="text-sm font-bold text-pink-400 font-mono">{settings.adminPanelTitle}</h1>
            </div>
            <button onClick={handleLogout}
              className="w-10 h-10 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 space-y-4 max-w-2xl mx-auto w-full pb-20">
          {/* Disclaimer */}
          <div className="p-3 rounded-xl border border-pink-500/30 bg-pink-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-yellow-400 font-mono">{settings.disclaimerTitle}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">{settings.disclaimerText}</p>
              </div>
            </div>
          </div>

          {/* Hit Engine */}
          <HitEngine apis={apis} onLog={addLog} residentialProxyUrl={settings.residentialProxyUrl} />

          {/* Bottom Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-900/50 border border-gray-800">
            <button onClick={() => setActiveTab('apis')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'apis' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <List className="w-3.5 h-3.5" /> ({apis.length})
            </button>
            <button onClick={() => setActiveTab('import')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'import' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <Code className="w-3.5 h-3.5" /> Import
            </button>
            <button onClick={() => setActiveTab('settings')}
              className={`py-2 px-3 rounded-lg text-xs font-mono transition-all ${activeTab === 'settings' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'apis' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold text-green-400 font-mono">{settings.apiListTitle}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">ALL</span>
                    <Switch checked={allEnabled} onCheckedChange={handleToggleAll} />
                  </div>
                  <button onClick={() => { setEditingApi(null); setShowApiForm(true); }}
                    className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-mono font-bold flex items-center gap-1 hover:bg-pink-700 transition-all">
                    <Plus className="w-3.5 h-3.5" /> {settings.addApiButtonText}
                  </button>
                </div>
              </div>

              {apis.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-gray-900/30 border border-gray-800">
                  <Database className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                  <p className="text-sm font-medium text-gray-500 font-mono">{settings.noApisText}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {apis.map(api => (
                    <ApiCard key={api.id} api={api}
                      onToggle={() => toggleApi(api.id)}
                      onToggleProxy={() => updateApi(api.id, { proxy_enabled: !api.proxy_enabled })}
                      onToggleResidential={() => updateApi(api.id, { residential_proxy_enabled: !api.residential_proxy_enabled })}
                      onToggleRotation={() => updateApi(api.id, { rotation_enabled: !api.rotation_enabled })}
                      onToggleForce={() => updateApi(api.id, { force_proxy: !api.force_proxy })}
                      onEdit={() => { setEditingApi(api); setShowApiForm(true); }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div className="animate-in fade-in duration-200">
              <ApiImporter onImport={handleImport} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <SiteSettingsPanel settings={settings} onUpdate={updateSettings} onReset={resetSettings} />
              
              <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 font-mono">Preview</span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono">Changes will reflect instantly on the main page.</p>
              </div>
            </div>
          )}

          {/* Logs (always visible at bottom) */}
          <LogsPanel logs={logs} onClear={clearLogs} />
        </main>
      </div>

      {/* API Form Dialog */}
      <ApiForm
        open={showApiForm}
        onClose={() => { setShowApiForm(false); setEditingApi(null); }}
        onSubmit={editingApi ? handleEditApi : handleAddApi}
        editApi={editingApi}
      />
    </div>
  );
};

export default Page3Dashboard;
