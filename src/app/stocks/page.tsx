'use client';

import { useState } from 'react';
import { watchlistStocks, generatePriceHistory, sectorColors } from '@/lib/mockData';
import { calculateSignal, getSignalColor, getSignalBgColor, SignalType } from '@/lib/signals';
import {
  TrendingUp,
  TrendingDown,
  Search,
  ChevronUp,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const SIGNAL_FILTER_OPTIONS: (SignalType | 'すべて')[] = ['すべて', '強い買い', '買い', '中立', '売り', '強い売り'];

export default function StocksPage() {
  const [search, setSearch] = useState('');
  const [signalFilter, setSignalFilter] = useState<SignalType | 'すべて'>('すべて');
  const [selectedStock, setSelectedStock] = useState(watchlistStocks[0]);
  const [sortField, setSortField] = useState<'changePercent' | 'rsi' | 'price'>('changePercent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const priceHistory = generatePriceHistory(selectedStock.price, 60);

  const allSignals = watchlistStocks.map((s) => ({ ...s, signal: calculateSignal(s) }));

  const filtered = allSignals
    .filter((s) => {
      const matchSearch =
        s.name.includes(search) || s.ticker.toLowerCase().includes(search.toLowerCase());
      const matchSignal = signalFilter === 'すべて' || s.signal.signal === signalFilter;
      return matchSearch && matchSignal;
    })
    .sort((a, b) => {
      const av = a[sortField] as number;
      const bv = b[sortField] as number;
      return sortDir === 'desc' ? bv - av : av - bv;
    });

  const selectedSignal = calculateSignal(selectedStock);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">銘柄分析</h1>
          <p className="text-gray-400 text-sm mt-1">テクニカル指標による売買シグナル分析</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Stock List */}
        <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-gray-700 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="銘柄名・コードで検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 text-sm pl-9 pr-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SIGNAL_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSignalFilter(opt)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    signalFilter === opt
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {/* Sort buttons */}
            <div className="flex gap-2">
              {(['changePercent', 'rsi', 'price'] as const).map((field) => {
                const labels = { changePercent: '騰落率', rsi: 'RSI', price: '株価' };
                return (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                      sortField === field ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {labels[field]}
                    {sortField === field && (
                      sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">該当銘柄なし</p>
            ) : (
              filtered.map((stock) => {
                const isActive = selectedStock.ticker === stock.ticker;
                const isPositive = stock.change >= 0;
                return (
                  <button
                    key={stock.ticker}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors ${
                      isActive ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{stock.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{stock.ticker} · {stock.sector}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold">
                          {stock.price.toLocaleString('ja-JP')}
                        </p>
                        <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSignalBgColor(stock.signal.signal)} ${getSignalColor(stock.signal.signal)}`}>
                        {stock.signal.signal}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="col-span-2 space-y-4">
          {/* Stock Header */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-200">{selectedStock.ticker.slice(0, 4)}</span>
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">{selectedStock.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedStock.ticker} · {selectedStock.sector} · 時価総額 {selectedStock.marketCap}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-3xl font-bold">{selectedStock.price.toLocaleString('ja-JP')}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedStock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-medium">
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(1)} ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">株価チャート（60日）</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-400"></div>株価</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={priceHistory}>
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={9} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => v.toLocaleString()} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  itemStyle={{ color: '#60a5fa' }}
                  formatter={(v: unknown) => [Number(v).toLocaleString('ja-JP'), '終値'] as [string, string]}
                />
                <ReferenceLine y={selectedStock.ma50} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'MA50', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={selectedStock.ma200} stroke="#8b5cf6" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'MA200', fill: '#8b5cf6', fontSize: 10 }} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Technical Signals */}
          <div className="grid grid-cols-2 gap-4">
            {/* Overall Signal */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-semibold text-sm">総合シグナル</h3>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold mb-4 ${getSignalBgColor(selectedSignal.signal)} ${getSignalColor(selectedSignal.signal)}`}>
                {selectedSignal.signal}
              </div>
              {/* Strength bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs">シグナル強度</span>
                  <span className="text-white text-xs font-medium">{selectedSignal.strength}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedSignal.strength >= 70 ? 'bg-green-500' : selectedSignal.strength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedSignal.strength}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {selectedSignal.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <p className="text-gray-400 text-xs">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Indicators */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-white font-semibold text-sm mb-4">個別指標</h3>
              <div className="space-y-4">
                {/* RSI */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-xs font-medium">RSI (14)</span>
                    <span className={`text-xs font-medium ${getSignalColor(selectedSignal.rsiSignal)}`}>{selectedSignal.rsiSignal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${selectedStock.rsi < 30 ? 'bg-green-500' : selectedStock.rsi > 70 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${selectedStock.rsi}%` }} />
                    </div>
                    <span className="text-white text-xs font-bold w-8 text-right">{selectedStock.rsi.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-gray-600 text-xs">売られすぎ (30)</span>
                    <span className="text-gray-600 text-xs">買われすぎ (70)</span>
                  </div>
                </div>

                {/* MACD */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-xs font-medium">MACD</span>
                    <span className={`text-xs font-medium ${getSignalColor(selectedSignal.macdSignal)}`}>{selectedSignal.macdSignal}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-500 text-xs">MACD</p>
                      <p className={`text-sm font-bold ${selectedStock.macd >= 0 ? 'text-green-400' : 'text-red-400'}`}>{selectedStock.macd.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-500 text-xs">シグナル</p>
                      <p className="text-white text-sm font-bold">{selectedStock.macdSignal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Moving Averages */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-xs font-medium">移動平均線</span>
                    <span className={`text-xs font-medium ${getSignalColor(selectedSignal.maSignal)}`}>{selectedSignal.maSignal}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-500 text-xs">MA50</p>
                      <p className="text-yellow-400 text-sm font-bold">{selectedStock.ma50.toLocaleString('ja-JP')}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-500 text-xs">MA200</p>
                      <p className="text-purple-400 text-sm font-bold">{selectedStock.ma200.toLocaleString('ja-JP')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold text-sm mb-4">基本情報</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '出来高', value: `${(selectedStock.volume / 10000).toFixed(0)}万株` },
                { label: '時価総額', value: selectedStock.marketCap },
                { label: '52週高値', value: selectedStock.price > selectedStock.ma200 ? (selectedStock.price * 1.08).toLocaleString('ja-JP', { maximumFractionDigits: 0 }) : (selectedStock.ma200 * 1.12).toLocaleString('ja-JP', { maximumFractionDigits: 0 }) },
                { label: '52週安値', value: (selectedStock.ma200 * 0.78).toLocaleString('ja-JP', { maximumFractionDigits: 0 }) },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                  <p className="text-white text-sm font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
