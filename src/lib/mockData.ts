export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
  rsi: number;
  macd: number;
  macdSignal: number;
  ma50: number;
  ma200: number;
  priceHistory: number[];
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  sector: string;
  account?: string;
  unit?: string;
}

export interface NewsItem {
  id: number;
  headline: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export const marketIndices: MarketIndex[] = [
  {
    name: '日経平均株価',
    symbol: 'N225',
    value: 38547.23,
    change: 312.45,
    changePercent: 0.82,
  },
  {
    name: 'TOPIX',
    symbol: 'TOPIX',
    value: 2721.56,
    change: -8.34,
    changePercent: -0.31,
  },
  {
    name: 'S&P 500',
    symbol: 'SPX',
    value: 5487.03,
    change: 24.16,
    changePercent: 0.44,
  },
  {
    name: 'NASDAQ',
    symbol: 'COMP',
    value: 17859.02,
    change: 156.78,
    changePercent: 0.89,
  },
];

export const topMovers: Stock[] = [
  {
    ticker: '7203',
    name: 'トヨタ自動車',
    price: 3456.0,
    change: 87.5,
    changePercent: 2.6,
    volume: 12450000,
    marketCap: '56.2兆円',
    sector: '輸送用機器',
    rsi: 62.4,
    macd: 15.2,
    macdSignal: 12.8,
    ma50: 3280.0,
    ma200: 3120.0,
    priceHistory: [3200, 3250, 3180, 3300, 3280, 3350, 3400, 3380, 3420, 3456],
  },
  {
    ticker: '6758',
    name: 'ソニーグループ',
    price: 14250.0,
    change: -320.0,
    changePercent: -2.2,
    volume: 4320000,
    marketCap: '17.8兆円',
    sector: '電気機器',
    rsi: 38.7,
    macd: -45.3,
    macdSignal: -28.6,
    ma50: 14800.0,
    ma200: 13950.0,
    priceHistory: [14800, 14750, 14900, 14850, 14700, 14600, 14500, 14400, 14320, 14250],
  },
  {
    ticker: '9984',
    name: 'ソフトバンクグループ',
    price: 9876.0,
    change: 234.0,
    changePercent: 2.43,
    volume: 8760000,
    marketCap: '16.9兆円',
    sector: '情報・通信',
    rsi: 71.2,
    macd: 89.4,
    macdSignal: 65.2,
    ma50: 9200.0,
    ma200: 8800.0,
    priceHistory: [9200, 9350, 9300, 9450, 9500, 9600, 9700, 9750, 9820, 9876],
  },
  {
    ticker: '6861',
    name: 'キーエンス',
    price: 67800.0,
    change: 1200.0,
    changePercent: 1.8,
    volume: 890000,
    marketCap: '16.4兆円',
    sector: '電気機器',
    rsi: 55.8,
    macd: 320.5,
    macdSignal: 285.3,
    ma50: 65200.0,
    ma200: 62000.0,
    priceHistory: [64000, 65000, 64500, 65500, 66000, 66500, 67000, 67200, 67600, 67800],
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 213.49,
    change: -3.21,
    changePercent: -1.48,
    volume: 58420000,
    marketCap: '$3.27T',
    sector: 'テクノロジー',
    rsi: 44.2,
    macd: -1.85,
    macdSignal: 0.42,
    ma50: 218.5,
    ma200: 195.8,
    priceHistory: [220, 218, 221, 217, 215, 216, 214, 215, 213, 213.49],
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 1208.88,
    change: 45.32,
    changePercent: 3.9,
    volume: 42150000,
    marketCap: '$2.97T',
    sector: 'テクノロジー',
    rsi: 78.5,
    macd: 42.8,
    macdSignal: 35.6,
    ma50: 1050.0,
    ma200: 820.0,
    priceHistory: [1050, 1100, 1080, 1120, 1150, 1160, 1180, 1190, 1200, 1208.88],
  },
];

export const watchlistStocks: Stock[] = [
  ...topMovers,
  {
    ticker: '8306',
    name: '三菱UFJフィナンシャル',
    price: 1456.5,
    change: 23.5,
    changePercent: 1.64,
    volume: 34500000,
    marketCap: '19.8兆円',
    sector: '銀行',
    rsi: 58.3,
    macd: 8.4,
    macdSignal: 6.2,
    ma50: 1380.0,
    ma200: 1250.0,
    priceHistory: [1350, 1380, 1370, 1400, 1420, 1430, 1440, 1445, 1450, 1456.5],
  },
  {
    ticker: '4502',
    name: '武田薬品工業',
    price: 4123.0,
    change: -89.0,
    changePercent: -2.11,
    volume: 6780000,
    marketCap: '6.5兆円',
    sector: '医薬品',
    rsi: 33.6,
    macd: -52.3,
    macdSignal: -38.7,
    ma50: 4350.0,
    ma200: 4500.0,
    priceHistory: [4500, 4450, 4400, 4380, 4350, 4300, 4250, 4200, 4150, 4123],
  },
  {
    ticker: '9432',
    name: '日本電信電話(NTT)',
    price: 178.4,
    change: 2.3,
    changePercent: 1.31,
    volume: 45600000,
    marketCap: '15.2兆円',
    sector: '情報・通信',
    rsi: 52.1,
    macd: 1.2,
    macdSignal: 0.9,
    ma50: 172.0,
    ma200: 168.0,
    priceHistory: [170, 172, 171, 174, 175, 176, 177, 177.5, 178, 178.4],
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.23,
    change: 12.45,
    changePercent: 5.28,
    volume: 132000000,
    marketCap: '$791B',
    sector: 'テクノロジー',
    rsi: 67.8,
    macd: 8.9,
    macdSignal: 5.4,
    ma50: 215.0,
    ma200: 198.0,
    priceHistory: [210, 215, 220, 225, 230, 235, 238, 242, 245, 248.23],
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    price: 442.57,
    change: 6.78,
    changePercent: 1.56,
    volume: 21300000,
    marketCap: '$3.29T',
    sector: 'テクノロジー',
    rsi: 60.4,
    macd: 4.2,
    macdSignal: 3.1,
    ma50: 425.0,
    ma200: 395.0,
    priceHistory: [420, 425, 428, 432, 435, 438, 439, 440, 441, 442.57],
  },
];

// 米ドル円レート（楽天証券データ取得時点）
const USD_JPY = 160.31;

export const defaultPortfolio: PortfolioHolding[] = [
  // ── 国内株式 ──
  {
    ticker: '2330',
    name: 'フォーサイド',
    quantity: 100,
    avgBuyPrice: 198.0,
    currentPrice: 75.0,
    sector: 'サービス',
    account: '特定',
    unit: '株',
  },
  {
    ticker: '2338',
    name: 'クオンタムソリューションズ',
    quantity: 100,
    avgBuyPrice: 480.0,
    currentPrice: 119.0,
    sector: '情報・通信',
    account: '特定',
    unit: '株',
  },
  {
    ticker: '3415',
    name: 'TOKYOBASE（特定）',
    quantity: 100,
    avgBuyPrice: 339.0,
    currentPrice: 339.0,
    sector: '小売',
    account: '特定',
    unit: '株',
  },
  {
    ticker: '3415',
    name: 'TOKYOBASE（一般）',
    quantity: 100,
    avgBuyPrice: 246.0,
    currentPrice: 339.0,
    sector: '小売',
    account: '一般',
    unit: '株',
  },
  {
    ticker: '3624',
    name: 'アクセルマーク',
    quantity: 100,
    avgBuyPrice: 209.0,
    currentPrice: 68.0,
    sector: '情報・通信',
    account: '特定',
    unit: '株',
  },
  {
    ticker: '4168',
    name: 'ヤプリ',
    quantity: 100,
    avgBuyPrice: 1078.0,
    currentPrice: 755.0,
    sector: '情報・通信',
    account: 'NISA成長',
    unit: '株',
  },
  {
    ticker: '7280',
    name: 'ミツバ',
    quantity: 41,
    avgBuyPrice: 825.0,
    currentPrice: 1207.0,
    sector: '輸送用機器',
    account: '特定',
    unit: '株',
  },
  {
    ticker: '9434',
    name: 'ソフトバンク',
    quantity: 100,
    avgBuyPrice: 190.0,
    currentPrice: 211.7,
    sector: '情報・通信',
    account: '一般',
    unit: '株',
  },
  // ── 米国株式（円換算 @160.31） ──
  {
    ticker: 'RMR',
    name: 'RMRグループ',
    quantity: 20,
    avgBuyPrice: Math.round(19.95 * USD_JPY),
    currentPrice: Math.round(20.29 * USD_JPY),
    sector: '不動産',
    account: 'NISA成長',
    unit: '株',
  },
  {
    ticker: 'NVDA',
    name: 'エヌビディア',
    quantity: 10,
    avgBuyPrice: Math.round(174.8 * USD_JPY),
    currentPrice: Math.round(205.1 * USD_JPY),
    sector: 'テクノロジー',
    account: 'NISA成長',
    unit: '株',
  },
  {
    ticker: 'DKNG',
    name: 'ドラフト・キングス',
    quantity: 10,
    avgBuyPrice: Math.round(35.28 * USD_JPY),
    currentPrice: Math.round(24.93 * USD_JPY),
    sector: 'サービス',
    account: 'NISA成長',
    unit: '株',
  },
  {
    ticker: 'AIP',
    name: 'アルテリス',
    quantity: 50,
    avgBuyPrice: Math.round(11.1446 * USD_JPY),
    currentPrice: Math.round(34.28 * USD_JPY),
    sector: 'テクノロジー',
    account: '特定',
    unit: '株',
  },
  {
    ticker: 'BRZE',
    name: 'ブレイズ',
    quantity: 10,
    avgBuyPrice: Math.round(31.22 * USD_JPY),
    currentPrice: Math.round(22.91 * USD_JPY),
    sector: 'テクノロジー',
    account: 'NISA成長',
    unit: '株',
  },
  {
    ticker: 'WBD',
    name: 'ワーナー・ブラザーズ',
    quantity: 10,
    avgBuyPrice: Math.round(28.92 * USD_JPY),
    currentPrice: Math.round(26.24 * USD_JPY),
    sector: 'メディア',
    account: 'NISA成長',
    unit: '株',
  },
  // ── 投資信託（価格は1口あたり円）──
  {
    ticker: 'eMAXIS-SP500',
    name: 'eMAXIS Slim S&P500（一般）',
    quantity: 9041,
    avgBuyPrice: 33182.17 / 10000,
    currentPrice: 44577 / 10000,
    sector: '投資信託',
    account: '一般',
    unit: '口',
  },
  {
    ticker: 'eMAXIS-SP500-NISA',
    name: 'eMAXIS Slim S&P500（つみたてNISA）',
    quantity: 153457,
    avgBuyPrice: 35189.01 / 10000,
    currentPrice: 44577 / 10000,
    sector: '投資信託',
    account: 'NISAつみたて',
    unit: '口',
  },
];

export const marketNews: NewsItem[] = [
  {
    id: 1,
    headline: '日銀、追加利上げを示唆－円相場が急騰し輸出株に売り圧力',
    source: '日本経済新聞',
    time: '14:32',
    sentiment: 'negative',
  },
  {
    id: 2,
    headline: 'トヨタ、EV新モデル発表－北米市場での販売拡大を目指す',
    source: 'ロイター',
    time: '13:15',
    sentiment: 'positive',
  },
  {
    id: 3,
    headline: '米FRB、年内2回の利下げ見通しを維持－インフレ鈍化を確認',
    source: 'Bloomberg',
    time: '11:48',
    sentiment: 'positive',
  },
  {
    id: 4,
    headline: 'ソニー、映画部門の収益が予想下回る－株価下落',
    source: '東洋経済',
    time: '10:22',
    sentiment: 'negative',
  },
  {
    id: 5,
    headline: '日経平均、3万8000円台を回復－半導体関連株が牽引',
    source: '日本経済新聞',
    time: '09:05',
    sentiment: 'positive',
  },
  {
    id: 6,
    headline: 'NVIDIAの決算予想を上方修正－AIチップ需要が想定超え',
    source: 'Nikkei Asia',
    time: '08:30',
    sentiment: 'positive',
  },
];

export const generatePriceHistory = (basePrice: number, days: number = 30): { date: string; price: number }[] => {
  const data = [];
  let price = basePrice * 0.9;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price = price * (1 + (Math.random() - 0.48) * 0.02);
    data.push({
      date: date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
      price: Math.round(price * 100) / 100,
    });
  }
  return data;
};

export const sectorColors: Record<string, string> = {
  '輸送用機器': '#3b82f6',
  '電気機器': '#8b5cf6',
  '情報・通信': '#06b6d4',
  'テクノロジー': '#f59e0b',
  '銀行': '#10b981',
  '医薬品': '#ef4444',
  '小売': '#f97316',
  '不動産': '#84cc16',
};
