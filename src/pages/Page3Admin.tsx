import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useHitSiteSettings } from '@/hooks/useHitSiteSettings';

const Page3Admin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { settings } = useHitSiteSettings();

  const handleLogin = () => {
    if (password === settings.adminPassword) {
      sessionStorage.setItem('hitAdminAuth', 'true');
      navigate('/page3/dashboard');
    } else {
      setError('Incorrect password');
      setShake(true);
      setTimeout(() => { setError(''); setShake(false); }, 1500);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-violet-600/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className={`relative z-10 w-full max-w-sm space-y-6 transition-transform ${shake ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
        {/* Login Card */}
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 space-y-8">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/[0.08] flex items-center justify-center">
              <Lock className="w-7 h-7 text-white/60" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-white tracking-tight">Admin Access</h1>
            <p className="text-xs text-white/30">Enter password to continue</p>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="h-12 bg-white/[0.04] border-white/[0.08] text-white text-center text-base tracking-[0.3em] placeholder:text-white/20 placeholder:tracking-normal focus:border-violet-500/40 focus:ring-violet-500/20"
              placeholder="••••••••"
            />
            {error && (
              <p className="text-red-400/80 text-[11px] text-center">{error}</p>
            )}
          </div>

          {/* Login Button */}
          <button onClick={handleLogin}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-white/20 text-[11px]">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default Page3Admin;
