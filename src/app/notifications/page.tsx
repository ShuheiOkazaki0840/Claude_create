'use client';

import { Bell, TrendingUp, TrendingDown, AlertCircle, Mail, Smartphone, CheckCircle2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';

interface NotificationSettings {
  priceAlert: boolean;
  buySignal: boolean;
  sellSignal: boolean;
  newsAlert: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  priceChangeThreshold: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  priceAlert: true,
  buySignal: true,
  sellSignal: true,
  newsAlert: false,
  emailEnabled: false,
  pushEnabled: true,
  priceChangeThreshold: 5,
};

interface AlertItem {
  id: string;
  type: 'buy' | 'sell' | 'price' | 'news';
  ticker: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_ALERTS: AlertItem[] = [
  { id: '1', type: 'buy', ticker: '7203', message: 'トヨタ自動車 — 強い買いシグナル発生（RSI: 31, MACD上抜け）', time: '09:15', read: false },
  { id: '2', type: 'sell', ticker: '6758', message: 'ソニーグループ — 売りシグナル（RSI過熱: 74）', time: '09:42', read: false },
  { id: '3', type: 'price', ticker: 'NVDA', message: 'NVIDIA — 前日比 +6.2% の急騰', time: '昨日', read: false },
  { id: '4', type: 'buy', ticker: '9984', message: 'ソフトバンクG — 買いシグナル（200日移動平均線上抜け）', time: '昨日', read: true },
  { id: '5', type: 'news', ticker: '', message: '米FRB — 政策金利を据え置き。市場は概ね織り込み済み。', time: '2日前', read: true },
];

function AlertBadge({ type }: { type: AlertItem['type'] }) {
  const map = {
    buy: { label: '買い', cls: 'bg-green-500/20 text-green-400' },
    sell: { label: '売り', cls: 'bg-red-500/20 text-red-400' },
    price: { label: '価格', cls: 'bg-yellow-500/20 text-yellow-400' },
    news: { label: 'ニュース', cls: 'bg-blue-500/20 text-blue-400' },
  };
  const { label, cls } = map[type];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}

export default function NotificationsPage() {
  const [settings, setSettings, loaded] = useLocalStorage<NotificationSettings>('notification-settings', DEFAULT_SETTINGS);
  const [alerts, setAlerts] = useLocalStorage<AlertItem[]>('notification-alerts', MOCK_ALERTS);
  const [saved, setSaved] = useLocalStorage<boolean>('notif-saved', false);

  const toggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof NotificationSettings] }));
  };

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  if (!loaded) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">通知設定</h1>
          <p className="text-gray-400 text-sm mt-1">シグナル・価格アラートの受信設定</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            すべて既読にする
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              アラート種別
            </h3>
            <div className="space-y-3">
              {[
                { key: 'buySignal' as const, label: '買いシグナル', icon: <TrendingUp className="w-4 h-4 text-green-400" /> },
                { key: 'sellSignal' as const, label: '売りシグナル', icon: <TrendingDown className="w-4 h-4 text-red-400" /> },
                { key: 'priceAlert' as const, label: '価格変動アラート', icon: <AlertCircle className="w-4 h-4 text-yellow-400" /> },
                { key: 'newsAlert' as const, label: 'マーケットニュース', icon: <Bell className="w-4 h-4 text-blue-400" /> },
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-gray-300 text-sm">{label}</span>
                  </div>
                  <button
                    onClick={() => toggle(key)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${settings[key] ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">価格変動しきい値</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">±{settings.priceChangeThreshold}% 以上で通知</span>
              <span className="text-blue-400 font-bold text-sm">{settings.priceChangeThreshold}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={settings.priceChangeThreshold}
              onChange={(e) => setSettings((prev) => ({ ...prev, priceChangeThreshold: Number(e.target.value) }))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>1%</span><span>10%</span><span>20%</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">通知方法</h3>
            <div className="space-y-3">
              {[
                { key: 'pushEnabled' as const, label: 'プッシュ通知', icon: <Smartphone className="w-4 h-4 text-gray-400" /> },
                { key: 'emailEnabled' as const, label: 'メール通知', icon: <Mail className="w-4 h-4 text-gray-400" /> },
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-gray-300 text-sm">{label}</span>
                  </div>
                  <button
                    onClick={() => toggle(key)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${settings[key] ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Alert History */}
        <div className="col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">通知履歴</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount} 件未読</span>
              )}
            </div>
            <div className="divide-y divide-gray-700/50">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`px-5 py-4 flex items-start gap-3 transition-colors hover:bg-gray-700/30 ${alert.read ? 'opacity-60' : ''}`}
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 mt-2 ${alert.read ? 'bg-gray-600' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertBadge type={alert.type} />
                      {alert.ticker && <span className="text-gray-500 text-xs font-mono">{alert.ticker}</span>}
                    </div>
                    <p className="text-gray-300 text-sm">{alert.message}</p>
                  </div>
                  <span className="text-gray-600 text-xs flex-shrink-0">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
