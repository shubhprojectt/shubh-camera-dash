import { Link } from 'react-router-dom';
import { Info, Settings2 } from 'lucide-react';
import { useHitApis } from '@/hooks/useHitApis';
import { useHitLogs } from '@/hooks/useHitLogs';
import { useHitSiteSettings } from '@/hooks/useHitSiteSettings';
import QuickHitEngine from '@/components/hit-engine/QuickHitEngine';
import LogsPanel from '@/components/hit-engine/LogsPanel';

const Page3 = () => {
  const { apis } = useHitApis();
  const { logs, addLog, clearLogs } = useHitLogs();
  const { settings } = useHitSiteSettings();

  return (
    <div className="min-h-[100dvh] bg-[#09090b] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="px-4 py-4 bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-20">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {settings.siteName.charAt(0)}
                </div>
              )}
              <h1 className="text-base font-semibold text-white tracking-tight">{settings.siteName}</h1>
            </div>
            <Link to="/page3/admin"
              className="h-9 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/70 text-xs font-medium transition-all flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5" /> {settings.adminButtonText}
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-5 space-y-4 max-w-xl mx-auto w-full">
          {/* Info Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.12]">
            <Info className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/50 leading-relaxed">{settings.warningText}</p>
          </div>

          {/* Quick Hit Engine 1 */}
          <QuickHitEngine
            apis={apis}
            onLog={addLog}
            title={settings.quickHitTitle || 'HIT ENGINE 1'}
            phoneLabel={settings.phoneLabel}
            phonePlaceholder={settings.phonePlaceholder}
            hitButtonText={settings.hitButtonText}
            stopButtonText={settings.stopButtonText}
            noApisWarning={settings.noApisWarning}
          />

          {/* Quick Hit Engine 2 */}
          <QuickHitEngine
            apis={apis}
            onLog={addLog}
            title="HIT ENGINE 2"
            phoneLabel={settings.phoneLabel}
            phonePlaceholder={settings.phonePlaceholder}
            hitButtonText={settings.hitButtonText}
            stopButtonText={settings.stopButtonText}
            noApisWarning={settings.noApisWarning}
          />

          {/* Logs */}
          <LogsPanel logs={logs} onClear={clearLogs} />

          {/* Back */}
          <Link to="/"
            className="block w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs font-medium text-center hover:bg-white/[0.07] hover:text-white/60 transition-all">
            ← Back to Main
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Page3;
