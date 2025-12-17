import React, { useState } from 'react';
import { User, Users, MessageSquare, BarChart3, Shield, AtSign, History, Sticker, UserPlus, Loader2, ExternalLink, Lock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const JWT_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4MjcwODU1NTI3IiwianRpIjoiNDhiMmFjODktN2VkZS00NTRlLWE5MjAtODE0Nzg0OGEzYWE0IiwiZXhwIjoxNzk3NDQ0NjQ0fQ.SToaZbha-xTT5WDeJrUFoSzgmCVuBKxHVR6mpvGcwjUPXxcfWQFLqwOlqUtO99r9rRnR_ZNd229rg_qbLxUKLdQhQCeHYgwr-fDhesy0QwKJBLCE34hvDXjD9F1_SEsrynx-hBGBKWlZ13MjkYwSQs_vjm7WobIeY9MSMykzp1E";
const BASE_URL = "https://funstat.info";

interface ToolButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  cost: string;
  needsUsername?: boolean;
}

const tools: ToolButton[] = [
  { id: 'basic_info', label: 'BASIC INFO', icon: <User size={24} />, color: 'green', cost: '0.10 credit' },
  { id: 'groups', label: 'GROUPS', icon: <Users size={24} />, color: 'cyan', cost: '5 credits' },
  { id: 'group_count', label: 'GROUP COUNT', icon: <Users size={24} />, color: 'yellow', cost: 'FREE' },
  { id: 'messages_count', label: 'MESSAGES COUNT', icon: <MessageSquare size={24} />, color: 'green', cost: 'FREE' },
  { id: 'messages', label: 'MESSAGES (LIMITED)', icon: <MessageSquare size={24} />, color: 'pink', cost: '10 credits' },
  { id: 'stats_min', label: 'BASIC STATS', icon: <BarChart3 size={24} />, color: 'purple', cost: 'FREE' },
  { id: 'stats', label: 'FULL STATS', icon: <BarChart3 size={24} />, color: 'green', cost: '1 credit' },
  { id: 'reputation', label: 'REPUTATION', icon: <Shield size={24} />, color: 'pink', cost: 'FREE' },
  { id: 'resolve_username', label: 'USERNAME RESOLVE', icon: <AtSign size={24} />, color: 'yellow', cost: '0.10 credit', needsUsername: true },
  { id: 'username_usage', label: 'USERNAME USAGE', icon: <UserPlus size={24} />, color: 'green', cost: '0.1 credit', needsUsername: true },
  { id: 'usernames', label: 'USERNAMES HISTORY', icon: <History size={24} />, color: 'pink', cost: '3 credits' },
  { id: 'names', label: 'NAMES HISTORY', icon: <History size={24} />, color: 'purple', cost: '3 credits' },
  { id: 'stickers', label: 'STICKERS', icon: <Sticker size={24} />, color: 'cyan', cost: '1 credit' },
  { id: 'common_groups', label: 'COMMON GROUPS', icon: <Users size={24} />, color: 'yellow', cost: '5 credits' },
];

const colorClasses: Record<string, string> = {
  green: 'border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
  pink: 'border-neon-pink text-neon-pink hover:bg-neon-pink/20 hover:shadow-[0_0_20px_rgba(255,0,128,0.3)]',
  yellow: 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20 hover:shadow-[0_0_20px_rgba(255,255,0,0.3)]',
  purple: 'border-neon-purple text-neon-purple hover:bg-neon-purple/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
};

const TelegramOSINT: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToolClick = (tool: ToolButton) => {
    setActiveTool(tool.id);
    setResult(null);
    setError(null);
  };

  const getEndpoint = (toolId: string): string => {
    switch (toolId) {
      case 'basic_info':
        return `/api/v1/users/basic_info_by_id?id=${userId}`;
      case 'groups':
        return `/api/v1/users/${userId}/groups`;
      case 'group_count':
        return `/api/v1/users/${userId}/groups_count`;
      case 'messages_count':
        return `/api/v1/users/${userId}/messages_count`;
      case 'messages':
        return `/api/v1/users/${userId}/messages`;
      case 'stats_min':
        return `/api/v1/users/${userId}/stats_min`;
      case 'stats':
        return `/api/v1/users/${userId}/stats`;
      case 'reputation':
        return `/api/v1/users/reputation?id=${userId}`;
      case 'resolve_username':
        return `/api/v1/users/resolve_username?username=${username}`;
      case 'username_usage':
        return `/api/v1/users/username_usage?username=${username}`;
      case 'usernames':
        return `/api/v1/users/${userId}/usernames`;
      case 'names':
        return `/api/v1/users/${userId}/names`;
      case 'stickers':
        return `/api/v1/users/${userId}/stickers`;
      case 'common_groups':
        return `/api/v1/users/${userId}/common_groups_stat`;
      default:
        return '';
    }
  };

  const fetchData = async () => {
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return;

    if (tool.needsUsername && !username) {
      setError('Please enter a username');
      return;
    }
    if (!tool.needsUsername && !userId) {
      setError('Please enter a Telegram User ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${BASE_URL}${getEndpoint(activeTool)}`, {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = (data: any) => (
    <div className="grid grid-cols-2 gap-3">
      <InfoCard label="User ID" value={data?.id || 'N/A'} color="cyan" />
      <InfoCard label="Username" value={data?.username ? `@${data.username}` : 'N/A'} color="green" />
      <InfoCard label="First Name" value={data?.first_name || 'N/A'} color="pink" />
      <InfoCard label="Last Name" value={data?.last_name || 'N/A'} color="yellow" />
      <InfoCard label="Is Bot" value={data?.is_bot ? 'Yes' : 'No'} color="purple" />
      <InfoCard label="Is Active" value={data?.is_active ? 'Yes' : 'No'} color="green" />
      <InfoCard label="Premium" value={data?.has_premium || data?.is_premium ? 'Yes' : 'No'} color="cyan" />
    </div>
  );

  const renderGroups = (data: any) => {
    const groups = Array.isArray(data) ? data : data.groups || [];
    if (groups.length === 0) return <p className="text-gray-400">No groups found</p>;
    
    return (
      <div className="space-y-3">
        {groups.map((group: any, idx: number) => (
          <div key={idx} className="bg-black/50 border border-neon-cyan/30 rounded-lg p-4">
            <h4 className="text-neon-cyan font-bold mb-2">{group.chat?.title || 'Unknown Group'}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-400">Type:</span>
              <span className={group.chat?.username ? 'text-neon-green' : 'text-neon-pink'}>
                {group.chat?.username ? 'Public' : 'Private'}
              </span>
              <span className="text-gray-400">Messages:</span>
              <span className="text-white">{group.messages_count || 0}</span>
              <span className="text-gray-400">Role:</span>
              <span className="text-neon-yellow">{group.role || 'Member'}</span>
              <span className="text-gray-400">Status:</span>
              <span className="text-white">{group.status || 'Unknown'}</span>
            </div>
            {group.chat?.username && group.lastMessageId ? (
              <a
                href={`https://t.me/${group.chat.username}/${group.lastMessageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors"
              >
                <ExternalLink size={16} /> Open Message on Telegram
              </a>
            ) : (
              <p className="mt-3 text-gray-500 flex items-center gap-2">
                <Lock size={16} /> Private Group (cannot open)
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStats = (data: any) => (
    <div className="grid grid-cols-2 gap-3">
      <InfoCard label="Language" value={data?.lang_code || 'N/A'} color="cyan" />
      <InfoCard label="Total Messages" value={data?.total_msg_count || 0} color="green" />
      <InfoCard label="Reply %" value={`${data?.reply_percent || 0}%`} color="pink" />
      <InfoCard label="Media %" value={`${data?.media_percent || 0}%`} color="yellow" />
      <InfoCard label="Unique %" value={`${data?.unique_percent || 0}%`} color="purple" />
      <InfoCard label="Link %" value={`${data?.link_percent || 0}%`} color="cyan" />
      <InfoCard label="Total Groups" value={data?.total_groups || 0} color="green" />
      <InfoCard label="Admin In" value={data?.adm_in_groups || 0} color="pink" />
      {data?.favorite_chat && (
        <div className="col-span-2 bg-black/50 border border-neon-purple/30 rounded-lg p-3">
          <span className="text-gray-400 text-xs block mb-1">Favorite Chat</span>
          <span className="text-neon-purple font-mono">{data.favorite_chat.title}</span>
        </div>
      )}
    </div>
  );

  const renderHistory = (data: any, type: 'usernames' | 'names') => {
    const items = Array.isArray(data) ? data : data[type] || [];
    if (items.length === 0) return <p className="text-gray-400">No history found</p>;
    
    return (
      <div className="space-y-2">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="bg-black/50 border border-neon-purple/30 rounded-lg p-3 flex justify-between">
            <span className="text-white">{typeof item === 'string' ? item : item.value || item.username || `${item.first_name || ''} ${item.last_name || ''}`}</span>
            {item.date && <span className="text-gray-500 text-sm">{item.date}</span>}
          </div>
        ))}
      </div>
    );
  };

  const renderGenericResult = (data: any) => (
    <pre className="bg-black/50 border border-neon-green/30 rounded-lg p-4 text-sm text-neon-green overflow-auto max-h-96">
      {JSON.stringify(data, null, 2)}
    </pre>
  );

  const renderResult = () => {
    if (!result) return null;
    
    // Extract data from API response wrapper
    const apiData = result.data;
    if (!apiData) return renderGenericResult(result);
    
    // For basic_info, data is an array - get first element
    const userData = Array.isArray(apiData) ? apiData[0] : apiData;
    
    switch (activeTool) {
      case 'basic_info':
      case 'resolve_username':
        return renderBasicInfo(userData);
      case 'groups':
        return renderGroups(apiData);
      case 'group_count':
        return <InfoCard label="Total Groups" value={userData?.count || userData?.groups_count || userData?.total_groups || 0} color="yellow" />;
      case 'messages_count':
        return <InfoCard label="Total Messages" value={userData?.count || userData?.messages_count || userData?.total_msg_count || 0} color="green" />;
      case 'stats_min':
      case 'stats':
        return renderStats(userData);
      case 'reputation':
        return <InfoCard label="Reputation Score" value={userData?.score || userData?.reputation || 'N/A'} color="pink" />;
      case 'usernames':
        return renderHistory(apiData, 'usernames');
      case 'names':
        return renderHistory(apiData, 'names');
      default:
        return renderGenericResult(apiData);
    }
  };

  const currentTool = tools.find(t => t.id === activeTool);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-neon-cyan font-mono tracking-wider">OSINT FINDER</h1>
        <p className="text-gray-400 text-sm mt-1">TELEGRAM INTELLIGENCE TOOLS • SINGLE SCREEN DASHBOARD</p>
      </div>

      {/* User ID Input */}
      <div className="bg-black/40 border border-neon-cyan/20 rounded-xl p-4 mb-6">
        <label className="text-gray-400 text-sm mb-2 block">Telegram User ID</label>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="123456789"
            value={userId}
            onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
            className="bg-black/60 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={fetchData}
            disabled={loading || !activeTool}
            className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 px-6"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </Button>
        </div>
        
        {/* Username Input (conditional) */}
        {currentTool?.needsUsername && (
          <div className="mt-3">
            <label className="text-gray-400 text-sm mb-2 block">Username (without @)</label>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace('@', ''))}
              className="bg-black/60 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        )}
      </div>

      {/* Tools Label */}
      <h2 className="text-gray-400 text-sm font-mono tracking-widest mb-4">T O O L S</h2>

      {/* Tools Grid */}
      <div className="bg-black/40 border border-gray-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300
                ${activeTool === tool.id 
                  ? `${colorClasses[tool.color]} bg-${tool.color === 'green' ? 'neon-green' : tool.color === 'cyan' ? 'neon-cyan' : tool.color === 'pink' ? 'neon-pink' : tool.color === 'yellow' ? 'neon-yellow' : 'neon-purple'}/10` 
                  : `${colorClasses[tool.color]} bg-transparent`
                }
              `}
            >
              <div className="mb-2">{tool.icon}</div>
              <span className="text-xs font-mono text-center leading-tight">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cost Warning */}
      {currentTool && currentTool.cost !== 'FREE' && (
        <div className="flex items-center gap-2 text-neon-yellow text-sm mb-4 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg p-3">
          <AlertTriangle size={16} />
          <span>This action costs {currentTool.cost}</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-black/40 border border-neon-green/20 rounded-xl p-4">
          <h3 className="text-neon-green font-mono mb-4">Results - {currentTool?.label}</h3>
          {renderResult()}
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => {
  const borderColor = {
    green: 'border-neon-green/30',
    cyan: 'border-neon-cyan/30',
    pink: 'border-neon-pink/30',
    yellow: 'border-neon-yellow/30',
    purple: 'border-neon-purple/30',
  }[color] || 'border-gray-700';

  const textColor = {
    green: 'text-neon-green',
    cyan: 'text-neon-cyan',
    pink: 'text-neon-pink',
    yellow: 'text-neon-yellow',
    purple: 'text-neon-purple',
  }[color] || 'text-white';

  return (
    <div className={`bg-black/50 border ${borderColor} rounded-lg p-3`}>
      <span className="text-gray-400 text-xs block mb-1">{label}</span>
      <span className={`${textColor} font-mono`}>{value}</span>
    </div>
  );
};

export default TelegramOSINT;
