'use client';

import { marketIndices, topMovers, marketNews, watchlistStocks, generatePriceHistory } from '@/lib/mockData';
import { calculateSignal, getSignalColor, getSignalBgColor } from '@/lib/signals';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Newspaper,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const sentimentData = [
  { name: '強気', value: 38, color: '#10b981' },
  { name: '中立', value: 34, color: '#6b7280' },
  { name: '弱気', value: 28, color: '#ef4444' },
];

const nikkeiHistory = generatePriceHistory(38547, 30);

const marketCalendar = [
  { date: '6/10', event: '米CPI発表', importance: 'high' },
  { date: '6/11', event: 'ECB政策金利', importance: 'high' },
  { date: '6/14', event: '日銀金融政策決定会合', importance: 'high' },
  { date: '6/17', event: '米小売売上高', importance: 'medium' },
  { date: '6/20', event: 'FOMC議事録', importance: 'medium' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">市場概況</h1>
          <p className="text-gray-400 text-sm mt-1">2026年6月7日（日）・前日終値</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">データ更新済み</span>
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-4 gap-4">
        {marketIndices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div key={index.symbol} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm font-medium">{index.name}</span>
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <p className="text-white text-2xl font-bold tracking-tight">
                {index.value.toLocaleString('ja-JP', { maximumFractionDigits: 2 })}
              </p>
              <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                <span className="text-sm font-medium">
                  {isPositive ? '+' : ''}{index.change.toFixed(2)}
                </span>
                <span className="text-sm">
                  ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid: chart + sentiment + calendar */}
      <div className="grid grid-cols-3 gap-4">
        {/* Nikkei Chart */}
        <div className="col-span-2 bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold">日経平均株価 推移</h2>
              <p className="text-gray-500 text-xs mt-0.5">過去30日間</p>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+312.45 (+0.82%)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={nikkeiHistory}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v) => v.toLocaleString()}
                width={70}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#60a5fa' }}
                formatter={(value: unknown) => [Number(value).toLocaleString('ja-JP'), '終値'] as [string, string]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment + Calendar */}
        <div className="space-y-4">
          {/* Market Sentiment */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">市場センチメント</h2>
            </div>
            <div className="flex items-center justify-center">
              <PieChart width={140} height={140}>
                <Pie
                  data={sentimentData}
                  cx={65}
                  cy={65}
                  innerRadius={42}
                  outerRadius={62}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="space-y-2 ml-2">
                {sentimentData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-400 text-xs">{item.name}</span>
                    <span className="text-white text-xs font-semibold ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Economic Calendar */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">経済カレンダー</h2>
            </div>
            <div className="space-y-2">
              {marketCalendar.map((item) => (
                <div key={item.date} className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs w-8 flex-shrink-0">{item.date}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.importance === 'high' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-gray-300 text-xs truncate">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Movers + News */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top Movers */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold">注目銘柄</h2>
            </div>
            <span className="text-gray-500 text-xs">前日比</span>
          </div>
          <div className="space-y-3">
            {topMovers.map((stock) => {
              const signal = calculateSignal(stock);
              const isPositive = stock.change >= 0;
              return (
                <div key={stock.ticker} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-300">{stock.ticker.slice(0, 4)}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{stock.name}</p>
                      <p className="text-gray-500 text-xs">{stock.sector}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">
                      {stock.price.toLocaleString('ja-JP')}
                    </p>
                    <div className={`flex items-center gap-1 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span className="text-xs">{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className={`ml-3 px-2 py-1 rounded-md text-xs font-medium ${getSignalBgColor(signal.signal)} ${getSignalColor(signal.signal)}`}>
                    {signal.signal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market News */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-4 h-4 text-blue-400" />
            <h2 className="text-white font-semibold">マーケットニュース</h2>
          </div>
          <div className="space-y-3">
            {marketNews.map((news) => {
              const sentimentIcon =
                news.sentiment === 'positive' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                ) : news.sentiment === 'negative' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                );
              return (
                <div key={news.id} className="flex gap-3 py-2 border-b border-gray-700/50 last:border-0">
                  <div className="mt-0.5">{sentimentIcon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-sm leading-snug line-clamp-2">{news.headline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-xs">{news.source}</span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs">{news.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
