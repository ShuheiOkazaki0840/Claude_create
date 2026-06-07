'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Target,
  BarChart2,
  Bell,
  Settings,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  {
    href: '/',
    icon: LayoutDashboard,
    label: 'ダッシュボード',
    description: '市場概況',
  },
  {
    href: '/stocks',
    icon: TrendingUp,
    label: '銘柄分析',
    description: 'シグナル・チャート',
  },
  {
    href: '/portfolio',
    icon: PieChart,
    label: 'ポートフォリオ',
    description: '保有資産管理',
  },
  {
    href: '/life-plan',
    icon: Target,
    label: '人生設計',
    description: '目標達成シミュレーション',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">投資ダッシュボード</h1>
            <p className="text-gray-500 text-xs">Investment Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">メインメニュー</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-tight ${isActive ? 'text-blue-300' : ''}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-600 leading-tight mt-0.5 truncate">{item.description}</p>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-800 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors w-full">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="text-sm">通知設定</span>
          <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors w-full">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm">設定</span>
        </button>
      </div>

      {/* Market Status */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">東証 取引中</span>
          <span className="ml-auto text-xs text-gray-600">09:00-15:30</span>
        </div>
      </div>
    </aside>
  );
}
