import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useHitSiteSettings } from '@/hooks/useHitSiteSettings';

const Page3Admin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { settings } = useHitSiteSettings();

  const handleLogin = () => {
    if (password === settings.adminPassword) {
      sessionStorage.setItem('hitAdminAuth', 'true');
      navigate('/page3/dashboard');
    } else {
      setError('Wrong password!');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Warning */}
        <div className="p-3 rounded-xl border border-pink-500/30 bg-pink-500/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 font-mono">Yeh tool sirf authorized testing ke liye hai.</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-pink-500/30 bg-gray-950/80 p-8 space-y-6 shadow-2xl shadow-pink-500/10">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Lock className="w-8 h-8 text-pink-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center font-mono">
            <span className="text-cyan-400">ADMIN PANEL</span>
            <span className="text-pink-400 animate-pulse">_</span>
          </h1>

          {/* Password Input */}
          <div>
            <label className="text-xs font-bold text-gray-400 font-mono block mb-2">MASTER PASSWORD</label>
            <Input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="bg-gray-900 border-pink-500/30 text-white font-mono text-center h-12 text-lg focus:border-cyan-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono text-center">{error}</p>
          )}

          {/* Login Button */}
          <button onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-mono font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20">
            <Shield className="w-4 h-4" /> UNLOCK ADMIN
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs font-mono flex items-center justify-center gap-1.5">
          🔐 Secure access required
        </p>
      </div>
    </div>
  );
};

export default Page3Admin;
