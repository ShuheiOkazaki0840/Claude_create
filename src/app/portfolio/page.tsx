'use client';

import { useState } from 'react';
import { defaultPortfolio, sectorColors } from '@/lib/mockData';
import type { PortfolioHolding } from '@/lib/mockData';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Wallet,
  BarChart2,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#84cc16'];

function calcPnL(h: PortfolioHolding) {
  const costBasis = h.avgBuyPrice * h.quantity;
  const currentValue = h.currentPrice * h.quantity;
  const pnl = currentValue - costBasis;
  const pnlPct = (pnl / costBasis) * 100;
  return { costBasis, currentValue, pnl, pnlPct };
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(defaultPortfolio);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHolding, setNewHolding] = useState({ ticker: '', name: '', quantity: '', avgBuyPrice: '', currentPrice: '', sector: '' });

  const totalCost = holdings.reduce((sum, h) => sum + h.avgBuyPrice * h.quantity, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = (totalPnL / totalCost) * 100;

  const allocationData = holdings.map((h, i) => ({
    name: h.name,
    value: Math.round((h.currentPrice * h.quantity * 100) / totalValue),
    color: COLORS[i % COLORS.length],
  }));

  const sectorAllocation: Record<string, number> = {};
  holdings.forEach((h) => {
    const v = h.currentPrice * h.quantity;
    sectorAllocation[h.sector] = (sectorAllocation[h.sector] || 0) + v;
  });
  const sectorData = Object.entries(sectorAllocation).map(([name, value]) => ({
    name,
    value: Math.round(value / 10000),
    color: sectorColors[name] || '#6b7280',
  }));

  const pnlBarData = holdings.map((h) => {
    const { pnl } = calcPnL(h);
    return { name: h.name.length > 8 ? h.name.slice(0, 8) + '…' : h.name, pnl: Math.round(pnl) };
  });

  const removeHolding = (ticker: string) => {
    setHoldings((prev) => prev.filter((h) => h.ticker !== ticker));
  };

  const addHolding = () => {
    if (!newHolding.ticker || !newHolding.quantity || !newHolding.avgBuyPrice || !newHolding.currentPrice) return;
    const h: PortfolioHolding = {
      ticker: newHolding.ticker.toUpperCase(),
      name: newHolding.name || newHolding.ticker.toUpperCase(),
      quantity: parseFloat(newHolding.quantity),
      avgBuyPrice: parseFloat(newHolding.avgBuyPrice),
      currentPrice: parseFloat(newHolding.currentPrice),
      sector: newHolding.sector || 'その他',
    };
    setHoldings((prev) => [...prev, h]);
    setNewHolding({ ticker: '', name: '', quantity: '', avgBuyPrice: '', currentPrice: '', sector: '' });
    setShowAddForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ポートフォリオ</h1>
          <p className="text-gray-400 text-sm mt-1">保有資産の損益・配分管理</p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          銘柄追加
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-xl p-5 border border-blue-500/40">
          <h3 className="text-white font-semibold mb-4">新規銘柄を追加</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'ticker', label: 'ティッカー / コード', placeholder: '例: 7203' },
              { key: 'name', label: '銘柄名', placeholder: '例: トヨタ自動車' },
              { key: 'sector', label: 'セクター', placeholder: '例: 輸送用機器' },
              { key: 'quantity', label: '保有数量', placeholder: '例: 100' },
              { key: 'avgBuyPrice', label: '平均取得単価 (円/$)', placeholder: '例: 3000' },
              { key: 'currentPrice', label: '現在値 (円/$)', placeholder: '例: 3456' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-gray-400 text-xs mb-1 block">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(newHolding as Record<string, string>)[key]}
                  onChange={(e) => setNewHolding((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-600"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addHolding} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">追加</button>
            <button onClick={() => setShowAddForm(false)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">キャンセル</button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '評価額合計', value: `¥${totalValue.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`, icon: Wallet, color: 'text-blue-400' },
          { label: '取得コスト', value: `¥${totalCost.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`, icon: BarChart2, color: 'text-gray-400' },
          {
            label: '損益合計',
            value: `${totalPnL >= 0 ? '+' : ''}¥${totalPnL.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`,
            icon: totalPnL >= 0 ? TrendingUp : TrendingDown,
            color: totalPnL >= 0 ? 'text-green-400' : 'text-red-400',
          },
          {
            label: '損益率',
            value: `${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`,
            icon: totalPnLPct >= 0 ? TrendingUp : TrendingDown,
            color: totalPnLPct >= 0 ? 'text-green-400' : 'text-red-400',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Allocation Pie */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">銘柄配分</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2} strokeWidth={0}>
                {allocationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(v: unknown) => [`${v}%`, ''] as [string, string]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400 text-xs truncate flex-1">{item.name}</span>
                <span className="text-white text-xs font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold text-sm mb-4">セクター配分</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}万`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(v: unknown) => [`${Number(v).toLocaleString()}万円`, '評価額'] as [string, string]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sectorData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* P&L Bar */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold text-sm mb-4">銘柄別損益</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pnlBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(v: unknown) => [`¥${Number(v).toLocaleString()}`, '損益'] as [string, string]}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {pnlBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">保有銘柄一覧</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {['銘柄', 'セクター', '保有数', '平均取得価格', '現在値', '評価額', '損益', '損益率', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => {
                const { currentValue, pnl, pnlPct } = calcPnL(holding);
                const isPositive = pnl >= 0;
                return (
                  <tr key={holding.ticker} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white text-sm font-medium">{holding.name}</p>
                        <p className="text-gray-500 text-xs">{holding.ticker}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">{holding.sector}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{holding.quantity.toLocaleString()}株</td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{holding.avgBuyPrice.toLocaleString('ja-JP')}</td>
                    <td className="px-4 py-4 text-white text-sm font-medium">{holding.currentPrice.toLocaleString('ja-JP')}</td>
                    <td className="px-4 py-4 text-white text-sm font-medium">¥{currentValue.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}</td>
                    <td className={`px-4 py-4 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}¥{pnl.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
                    </td>
                    <td className={`px-4 py-4 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {isPositive ? '+' : ''}{pnlPct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => removeHolding(holding.ticker)}
                        className="text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
