import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, Zap } from 'lucide-react';
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
    <div className="min-h-[100dvh] bg-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-pink-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 border-b border-pink-500/20 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              {settings.logoUrl && (
                <img src={settings.logoUrl} alt="Logo" className="w-9 h-9 rounded-full object-cover border border-pink-500/30" />
              )}
              <h1 className="text-lg font-bold font-mono">
                <span className="text-green-400">{settings.siteName.split(' ')[0] || 'SHUBH'}</span>
                {' '}
                <span className="text-pink-400">{settings.siteName.split(' ').slice(1).join(' ') || 'OSINT'}</span>
              </h1>
            </div>
            <Link to="/page3/admin"
              className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/10 transition-all flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> {settings.adminButtonText}
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
          {/* Warning Banner */}
          <div className="p-3 rounded-xl border border-pink-500/30 bg-pink-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 font-mono">{settings.warningText}</p>
            </div>
          </div>

          {/* Logs */}
          <LogsPanel logs={logs} onClear={clearLogs} />

          {/* Quick Hit Engine */}
          <QuickHitEngine
            apis={apis}
            onLog={addLog}
            title={settings.quickHitTitle}
            phoneLabel={settings.phoneLabel}
            phonePlaceholder={settings.phonePlaceholder}
            hitButtonText={settings.hitButtonText}
            stopButtonText={settings.stopButtonText}
            noApisWarning={settings.noApisWarning}
          />

          {/* Back to main */}
          <Link to="/"
            className="block w-full py-3 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-mono font-bold text-center hover:bg-green-500/10 transition-all">
            ← Back to Main Page
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Page3;
