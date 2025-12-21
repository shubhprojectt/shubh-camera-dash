import React, { useState, useEffect, useMemo } from 'react';
import { User, Users, MessageSquare, BarChart3, Shield, AtSign, History, Sticker, UserPlus, Loader2, ExternalLink, Lock, AlertTriangle, Database, Clock, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

const CACHE_KEY = 'telegram_osint_cache';
const SEARCH_HISTORY_KEY = 'telegram_osint_search_history';

interface ToolButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  cost: string;
  needsUsername?: boolean;
  enabled: boolean;
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface SearchHistoryEntry {
  userId: string;
  timestamp: number;
}

const defaultToolsConfig = [
  { id: 'basic_info', icon: <User size={24} />, color: 'green', needsUsername: false },
  { id: 'groups', icon: <Users size={24} />, color: 'cyan', needsUsername: false },
  { id: 'group_count', icon: <Users size={24} />, color: 'yellow', needsUsername: false },
  { id: 'messages_count', icon: <MessageSquare size={24} />, color: 'green', needsUsername: false },
  { id: 'messages', icon: <MessageSquare size={24} />, color: 'pink', needsUsername: false },
  { id: 'stats_min', icon: <BarChart3 size={24} />, color: 'purple', needsUsername: false },
  { id: 'stats', icon: <BarChart3 size={24} />, color: 'green', needsUsername: false },
  { id: 'reputation', icon: <Shield size={24} />, color: 'pink', needsUsername: false },
  { id: 'resolve_username', icon: <AtSign size={24} />, color: 'yellow', needsUsername: true },
  { id: 'username_usage', icon: <UserPlus size={24} />, color: 'green', needsUsername: true },
  { id: 'usernames', icon: <History size={24} />, color: 'pink', needsUsername: false },
  { id: 'names', icon: <History size={24} />, color: 'purple', needsUsername: false },
  { id: 'stickers', icon: <Sticker size={24} />, color: 'cyan', needsUsername: false },
  { id: 'common_groups', icon: <Users size={24} />, color: 'yellow', needsUsername: false },
];

const colorClasses: Record<string, string> = {
  green: 'border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
  pink: 'border-neon-pink text-neon-pink hover:bg-neon-pink/20 hover:shadow-[0_0_20px_rgba(255,0,128,0.3)]',
  yellow: 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20 hover:shadow-[0_0_20px_rgba(255,255,0,0.3)]',
  purple: 'border-neon-purple text-neon-purple hover:bg-neon-purple/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
};

const TelegramOSINT: React.FC = () => {
  const { settings } = useSettings();
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [cache, setCache] = useState<Record<string, CacheEntry>>({});
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Get JWT token and base URL from settings
  const JWT_TOKEN = settings.telegramOsint?.jwtToken || "";
  const BASE_URL = settings.telegramOsint?.baseUrl || "https://funstat.info";

  // Merge settings tools with default config
  const tools: ToolButton[] = useMemo(() => {
    return defaultToolsConfig.map(defaultTool => {
      const settingsTool = settings.telegramOsint?.tools?.find(t => t.id === defaultTool.id);
      return {
        ...defaultTool,
        label: settingsTool?.label || defaultTool.id.toUpperCase().replace('_', ' '),
        cost: settingsTool?.cost || 'FREE',
        enabled: settingsTool?.enabled ?? true,
      };
    });
  }, [settings.telegramOsint?.tools]);

  // Load cache from localStorage on mount
  useEffect(() => {
    const savedCache = localStorage.getItem(CACHE_KEY);
    if (savedCache) {
      try {
        setCache(JSON.parse(savedCache));
      } catch (e) {
        console.error('Failed to load cache:', e);
      }
    }
    
    // Load search history
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    }
  }, []);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(cache).length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  }, [cache]);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToSearchHistory = (id: string) => {
    setSearchHistory(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(entry => entry.userId !== id);
      // Add to beginning
      return [{ userId: id, timestamp: Date.now() }, ...filtered].slice(0, 50); // Keep last 50
    });
  };

  const removeFromHistory = (id: string) => {
    setSearchHistory(prev => prev.filter(entry => entry.userId !== id));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const getCacheKey = (toolId: string): string => {
    const tool = tools.find(t => t.id === toolId);
    if (tool?.needsUsername) {
      return `${toolId}_${username}`;
    }
    return `${toolId}_${userId}`;
  };

  const handleToolClick = (tool: ToolButton) => {
    setActiveTool(tool.id);
    setResult(null);
    setError(null);
    setIsFromCache(false);
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

    // Check cache first
    const cacheKey = getCacheKey(activeTool!);
    const cachedEntry = cache[cacheKey];
    if (cachedEntry) {
      setResult(cachedEntry.data);
      setIsFromCache(true);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setIsFromCache(false);

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
      
      // Add to search history
      if (userId && !tool.needsUsername) {
        addToSearchHistory(userId);
      }
      
      // Store in cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: { data, timestamp: Date.now() }
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    setCache({});
    localStorage.removeItem(CACHE_KEY);
    setResult(null);
    setIsFromCache(false);
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
      {/* User ID Input */}
      <div className="bg-black/40 border border-neon-cyan/20 rounded-xl p-4 mb-4">
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
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            className={`border-neon-purple text-neon-purple hover:bg-neon-purple/20 px-4 ${showHistory ? 'bg-neon-purple/20' : ''}`}
            title="Search History"
          >
            <Clock size={16} className="mr-1" /> History
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

      {/* Search History Panel */}
      {showHistory && (
        <div className="bg-black/40 border border-neon-purple/20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-neon-purple font-mono text-sm flex items-center gap-2">
              <Clock size={16} /> SEARCH HISTORY
            </h3>
            {searchHistory.length > 0 && (
              <Button
                onClick={clearSearchHistory}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
              >
                <Trash2 size={14} className="mr-1" /> Clear All
              </Button>
            )}
          </div>
          {searchHistory.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No search history yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchHistory.map((entry) => (
                <div
                  key={entry.userId}
                  className="flex items-center justify-between bg-black/50 border border-gray-700 rounded-lg p-2 hover:border-neon-purple/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan font-mono">{entry.userId}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setUserId(entry.userId);
                        setShowHistory(false);
                      }}
                      size="sm"
                      className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 text-xs px-3"
                    >
                      <Search size={12} className="mr-1" /> Search
                    </Button>
                    <Button
                      onClick={() => removeFromHistory(entry.userId)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tools Label */}
      <h2 className="text-gray-400 text-lg font-semibold mb-4">TELEGRAM ID DALO FULL MSG BNDA KIS GROUP ME JOIN HAI SARE MSG AND SIR BHI BAHUT KUCHH NIKALO</h2>

      {/* Tools Grid */}
      <div className="bg-black/40 border border-gray-800 rounded-xl p-3 mb-6">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
          {tools.filter(t => t.enabled).map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-md border transition-all duration-200 hover:scale-105
                ${colorClasses[tool.color]}
                ${activeTool === tool.id 
                  ? `bg-white/10 animate-glow-pulse` 
                  : `bg-black/30 hover:bg-white/5`
                }
              `}
            >
              <div className="mb-1 [&>svg]:w-4 [&>svg]:h-4">{tool.icon}</div>
              <span className="text-[10px] font-mono text-center leading-tight line-clamp-2">{tool.label}</span>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neon-green font-mono">Results - {currentTool?.label}</h3>
            {isFromCache && (
              <span className="flex items-center gap-1 text-xs bg-neon-purple/20 border border-neon-purple/30 text-neon-purple px-2 py-1 rounded">
                <Database size={12} /> CACHED (No credits used)
              </span>
            )}
          </div>
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
