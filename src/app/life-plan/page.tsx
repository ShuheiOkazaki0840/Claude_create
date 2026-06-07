'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import {
  Target,
  Plus,
  Trash2,
  TrendingUp,
  Home,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';

interface LifeGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetYear: number;
  icon: string;
}

const CURRENT_YEAR = 2026;

const DEFAULT_GOALS: LifeGoal[] = [
  { id: 'retirement', name: '老後資金', targetAmount: 30000000, targetYear: 2045, icon: 'retirement' },
  { id: 'home', name: 'マイホーム購入', targetAmount: 10000000, targetYear: 2028, icon: 'home' },
  { id: 'education', name: '子供の教育資金', targetAmount: 5000000, targetYear: 2035, icon: 'education' },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  retirement: <Briefcase className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  other: <Target className="w-5 h-5" />,
};

function formatYen(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}億円`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万円`;
  return `${value.toLocaleString()}円`;
}

function projectWealth(
  currentAssets: number,
  monthlySavings: number,
  annualReturn: number,
  years: number
): { year: number; assets: number }[] {
  const data = [];
  let assets = currentAssets;
  const monthlyReturn = annualReturn / 100 / 12;
  for (let y = 0; y <= years; y++) {
    data.push({ year: CURRENT_YEAR + y, assets: Math.round(assets) });
    // Compound monthly savings for 12 months
    for (let m = 0; m < 12; m++) {
      assets = assets * (1 + monthlyReturn) + monthlySavings;
    }
  }
  return data;
}

export default function LifePlanPage() {
  const [currentAssets, setCurrentAssets, assetsLoaded] = useLocalStorage<number>('lifeplan-assets', 5000000);
  const [monthlySavings, setMonthlySavings] = useLocalStorage<number>('lifeplan-savings', 100000);
  const [annualReturn, setAnnualReturn] = useLocalStorage<number>('lifeplan-return', 5);
  const [goals, setGoals, goalsLoaded] = useLocalStorage<LifeGoal[]>('lifeplan-goals', DEFAULT_GOALS);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', targetYear: '', icon: 'other' });

  if (!assetsLoaded || !goalsLoaded) return null;

  const maxYear = Math.max(...goals.map((g) => g.targetYear), CURRENT_YEAR + 30);
  const projectionYears = maxYear - CURRENT_YEAR + 2;
  const projection = projectWealth(currentAssets, monthlySavings, annualReturn, projectionYears);

  // Check each goal achievability
  const goalResults = goals.map((goal) => {
    const yearOffset = goal.targetYear - CURRENT_YEAR;
    if (yearOffset < 0) return { ...goal, achieved: false, projected: currentAssets, gap: goal.targetAmount - currentAssets };
    const atYear = projection[Math.min(yearOffset, projection.length - 1)];
    const projected = atYear?.assets ?? 0;
    return {
      ...goal,
      achieved: projected >= goal.targetAmount,
      projected,
      gap: goal.targetAmount - projected,
    };
  });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetYear) return;
    const g: LifeGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      targetYear: parseInt(newGoal.targetYear),
      icon: newGoal.icon,
    };
    setGoals((prev) => [...prev, g]);
    setNewGoal({ name: '', targetAmount: '', targetYear: '', icon: 'other' });
    setShowAddGoal(false);
  };

  const finalAssets = projection[projection.length - 1]?.assets ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">人生設計シミュレーター</h1>
          <p className="text-gray-400 text-sm mt-1">人生の目標達成可能性を資産運用でシミュレーション</p>
        </div>
        <button
          onClick={() => setShowAddGoal((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          目標を追加
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="bg-gray-800 rounded-xl p-5 border border-blue-500/40">
          <h3 className="text-white font-semibold mb-4">新しいライフゴールを追加</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { key: 'name', label: '目標名', placeholder: '例: 車の購入' },
              { key: 'targetAmount', label: '必要金額 (円)', placeholder: '例: 3000000' },
              { key: 'targetYear', label: '目標年 (西暦)', placeholder: '例: 2030' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-gray-400 text-xs mb-1 block">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(newGoal as Record<string, string>)[key]}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-600"
                />
              </div>
            ))}
            <div>
              <label className="text-gray-400 text-xs mb-1 block">種別</label>
              <select
                value={newGoal.icon}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, icon: e.target.value }))}
                className="w-full bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="retirement">老後</option>
                <option value="home">住宅</option>
                <option value="education">教育</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addGoal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">追加</button>
            <button onClick={() => setShowAddGoal(false)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">キャンセル</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Input Parameters */}
        <div className="space-y-4">
          {/* Current Situation */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">現在の状況</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">現在の資産総額</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                  <input
                    type="number"
                    value={currentAssets}
                    onChange={(e) => setCurrentAssets(Number(e.target.value))}
                    className="w-full bg-gray-700 text-gray-200 text-sm pl-6 pr-3 py-2.5 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-blue-400 text-xs mt-1">{formatYen(currentAssets)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">月間積立金額</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                    className="w-full bg-gray-700 text-gray-200 text-sm pl-6 pr-3 py-2.5 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-blue-400 text-xs mt-1">{formatYen(monthlySavings)} / 月</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-400 text-xs">想定年利回り</label>
                  <span className="text-blue-400 text-sm font-bold">{annualReturn}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.5}
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                  <span>0% (預貯金)</span>
                  <span>7% (標準)</span>
                  <span>15% (積極)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">運用シミュレーション結果</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400 text-xs">{maxYear + 2}年時点の資産</span>
                <span className="text-white text-sm font-bold">{formatYen(finalAssets)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400 text-xs">資産増加倍率</span>
                <span className="text-green-400 text-sm font-bold">×{(finalAssets / currentAssets).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400 text-xs">目標達成数</span>
                <span className="text-white text-sm font-bold">
                  <span className="text-green-400">{goalResults.filter((g) => g.achieved).length}</span>
                  <span className="text-gray-500"> / {goalResults.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chart + Goals */}
        <div className="col-span-2 space-y-4">
          {/* Projection Chart */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-semibold">資産推移予測</h3>
              </div>
              <span className="text-gray-500 text-xs">複利計算・年利{annualReturn}%想定</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={projection}>
                <defs>
                  <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatYen(v)}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(v: unknown) => [formatYen(Number(v ?? 0)), '資産額'] as [string, string]}
                />
                {goals.map((goal) => (
                  <ReferenceLine
                    key={goal.id}
                    x={goal.targetYear}
                    stroke="#f59e0b"
                    strokeDasharray="4 2"
                    label={{ value: goal.name, fill: '#f59e0b', fontSize: 9, position: 'top' }}
                  />
                ))}
                <Area type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} fill="url(#assetGradient)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Goal Cards */}
          <div className="grid grid-cols-3 gap-3">
            {goalResults.map((goal) => {
              const progressPct = Math.min((goal.projected / goal.targetAmount) * 100, 100);
              const yearsLeft = goal.targetYear - CURRENT_YEAR;
              return (
                <div
                  key={goal.id}
                  className={`bg-gray-800 rounded-xl p-4 border ${
                    goal.achieved ? 'border-green-500/40' : 'border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${goal.achieved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {ICON_MAP[goal.icon] || ICON_MAP.other}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{goal.name}</p>
                        <p className="text-gray-500 text-xs">{goal.targetYear}年 ({yearsLeft > 0 ? `${yearsLeft}年後` : '達成済み'})</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setGoals((prev) => prev.filter((g) => g.id !== goal.id))}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500 text-xs">目標額</span>
                      <span className="text-white text-xs font-medium">{formatYen(goal.targetAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500 text-xs">予測達成額</span>
                      <span className={`text-xs font-medium ${goal.achieved ? 'text-green-400' : 'text-red-400'}`}>{formatYen(goal.projected)}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${goal.achieved ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1 text-right">{progressPct.toFixed(0)}%</p>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${goal.achieved ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                    {goal.achieved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 text-xs font-medium">目標達成見込み</span>
                      </>
                    ) : (
                      <>
                        {goal.gap > goal.targetAmount * 0.5 ? (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                        )}
                        <span className={`text-xs font-medium ${goal.gap > goal.targetAmount * 0.5 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {formatYen(Math.abs(goal.gap))} 不足
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">アドバイス</h3>
            <div className="grid grid-cols-2 gap-3">
              {goalResults.filter((g) => !g.achieved).length > 0 ? (
                <>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-xs font-semibold mb-1">月間積立増額シミュレーション</p>
                    <p className="text-gray-300 text-xs">
                      全目標達成には月額積立を
                      <span className="text-yellow-400 font-bold"> {formatYen(Math.round(monthlySavings * 1.3 / 10000) * 10000)}</span>
                      に増やすことをお勧めします。
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-400 text-xs font-semibold mb-1">利回り向上の検討</p>
                    <p className="text-gray-300 text-xs">
                      年利を{annualReturn}%から
                      <span className="text-blue-400 font-bold"> {Math.min(annualReturn + 2, 15)}%</span>
                      に改善することで、資産形成が加速します。
                    </p>
                  </div>
                </>
              ) : (
                <div className="col-span-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm font-semibold">すべてのライフゴールが達成見込みです！</p>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">現在の積立計画・運用利回りを維持することで、設定した全目標を達成できる見通しです。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
