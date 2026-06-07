'use client';

import { Settings, User, Globe, Palette, Database, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useState } from 'react';

interface AppSettings {
  displayName: string;
  currency: 'JPY' | 'USD';
  theme: 'dark' | 'light';
  defaultMarket: 'JP' | 'US' | 'ALL';
  showPercentage: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

const DEFAULT_APP_SETTINGS: AppSettings = {
  displayName: '投資家',
  currency: 'JPY',
  theme: 'dark',
  defaultMarket: 'ALL',
  showPercentage: true,
  autoRefresh: false,
  refreshInterval: 60,
  riskTolerance: 'moderate',
};

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-2">
        <span className="text-blue-400">{icon}</span>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings, loaded] = useLocalStorage<AppSettings>('app-settings', DEFAULT_APP_SETTINGS);
  const [toastVisible, setToastVisible] = useState(false);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    if (confirm('すべての設定をリセットしてよろしいですか？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const saveSettings = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  if (!loaded) return null;

  return (
    <div className="p-6 space-y-6">
      {toastVisible && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">設定を保存しました</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">設定</h1>
          <p className="text-gray-400 text-sm mt-1">アプリケーションの表示・動作設定</p>
        </div>
        <button
          onClick={saveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          保存
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Profile */}
        <Section title="プロフィール" icon={<User className="w-4 h-4" />}>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">表示名</label>
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) => update('displayName', e.target.value)}
              className="w-full bg-gray-700 text-gray-200 text-sm px-3 py-2.5 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">リスク許容度</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'conservative', label: '安定重視' },
                { value: 'moderate', label: 'バランス' },
                { value: 'aggressive', label: '積極運用' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('riskTolerance', opt.value as AppSettings['riskTolerance'])}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                    settings.riskTolerance === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Display */}
        <Section title="表示設定" icon={<Palette className="w-4 h-4" />}>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">基準通貨</label>
            <div className="flex gap-2">
              {(['JPY', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => update('currency', c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.currency === c ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {c === 'JPY' ? '¥ 円' : '$ ドル'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">デフォルト市場</label>
            <div className="flex gap-2">
              {([{ v: 'ALL', l: '全市場' }, { v: 'JP', l: '日本株' }, { v: 'US', l: '米国株' }] as const).map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => update('defaultMarket', v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    settings.defaultMarket === v ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">損益を%で表示</span>
            <Toggle value={settings.showPercentage} onChange={() => update('showPercentage', !settings.showPercentage)} />
          </div>
        </Section>

        {/* Data */}
        <Section title="データ・更新" icon={<Database className="w-4 h-4" />}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">自動更新</p>
              <p className="text-gray-500 text-xs">相場データを定期取得</p>
            </div>
            <Toggle value={settings.autoRefresh} onChange={() => update('autoRefresh', !settings.autoRefresh)} />
          </div>
          {settings.autoRefresh && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-400 text-xs">更新間隔</label>
                <span className="text-blue-400 text-sm font-bold">{settings.refreshInterval}秒</span>
              </div>
              <input
                type="range"
                min={15}
                max={300}
                step={15}
                value={settings.refreshInterval}
                onChange={(e) => update('refreshInterval', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>15秒</span><span>5分</span>
              </div>
            </div>
          )}
        </Section>

        {/* Danger Zone */}
        <Section title="データ管理" icon={<Shield className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-gray-300 text-sm">ポートフォリオデータ</p>
                <p className="text-gray-500 text-xs">保有株・取得価格の記録</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-gray-300 text-sm">人生設計データ</p>
                <p className="text-gray-500 text-xs">ライフゴールと試算結果</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
            <button
              onClick={resetAll}
              className="w-full mt-2 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
            >
              すべてのデータをリセット
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
