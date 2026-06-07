import { Stock } from './mockData';

export type SignalType = '強い買い' | '買い' | '中立' | '売り' | '強い売り';

export interface TechnicalSignal {
  signal: SignalType;
  strength: number; // 0-100
  reasons: string[];
  rsiSignal: SignalType;
  macdSignal: SignalType;
  maSignal: SignalType;
}

function getRsiSignal(rsi: number): { signal: SignalType; reason: string } {
  if (rsi < 30) return { signal: '強い買い', reason: `RSI ${rsi.toFixed(1)} (売られすぎ)` };
  if (rsi < 45) return { signal: '買い', reason: `RSI ${rsi.toFixed(1)} (割安水準)` };
  if (rsi < 55) return { signal: '中立', reason: `RSI ${rsi.toFixed(1)} (中立)` };
  if (rsi < 70) return { signal: '売り', reason: `RSI ${rsi.toFixed(1)} (過熱気味)` };
  return { signal: '強い売り', reason: `RSI ${rsi.toFixed(1)} (買われすぎ)` };
}

function getMacdSignal(macd: number, signal: number): { signal: SignalType; reason: string } {
  const diff = macd - signal;
  if (diff > 20 || (diff > 0 && macd > 0)) return { signal: '買い', reason: `MACD クロス上昇 (${diff > 0 ? '+' : ''}${diff.toFixed(2)})` };
  if (diff < -20 || (diff < 0 && macd < 0)) return { signal: '売り', reason: `MACD クロス下降 (${diff.toFixed(2)})` };
  if (diff > 5) return { signal: '買い', reason: `MACD 強気 (+${diff.toFixed(2)})` };
  if (diff < -5) return { signal: '売り', reason: `MACD 弱気 (${diff.toFixed(2)})` };
  return { signal: '中立', reason: `MACD 横ばい (${diff.toFixed(2)})` };
}

function getMaSignal(price: number, ma50: number, ma200: number): { signal: SignalType; reason: string } {
  const aboveMa50 = price > ma50;
  const aboveMa200 = price > ma200;
  const goldenCross = ma50 > ma200;

  if (aboveMa50 && aboveMa200 && goldenCross) {
    return { signal: '強い買い', reason: 'ゴールデンクロス・上昇トレンド' };
  }
  if (aboveMa50 && aboveMa200) {
    return { signal: '買い', reason: '50日・200日移動平均線上抜け' };
  }
  if (!aboveMa50 && !aboveMa200 && !goldenCross) {
    return { signal: '強い売り', reason: 'デッドクロス・下降トレンド' };
  }
  if (!aboveMa50 && !aboveMa200) {
    return { signal: '売り', reason: '50日・200日移動平均線下抜け' };
  }
  return { signal: '中立', reason: '移動平均線付近で推移' };
}

function signalToScore(signal: SignalType): number {
  switch (signal) {
    case '強い買い': return 2;
    case '買い': return 1;
    case '中立': return 0;
    case '売り': return -1;
    case '強い売り': return -2;
  }
}

function scoreToSignal(score: number): SignalType {
  if (score >= 1.5) return '強い買い';
  if (score >= 0.5) return '買い';
  if (score >= -0.5) return '中立';
  if (score >= -1.5) return '売り';
  return '強い売り';
}

function signalToStrength(signal: SignalType): number {
  switch (signal) {
    case '強い買い': return 90;
    case '買い': return 70;
    case '中立': return 50;
    case '売り': return 30;
    case '強い売り': return 10;
  }
}

export function calculateSignal(stock: Stock): TechnicalSignal {
  const rsiResult = getRsiSignal(stock.rsi);
  const macdResult = getMacdSignal(stock.macd, stock.macdSignal);
  const maResult = getMaSignal(stock.price, stock.ma50, stock.ma200);

  const rsiSig = rsiResult.signal;
  const macdSig = macdResult.signal;
  const maSig = maResult.signal;

  const avgScore =
    (signalToScore(rsiSig) + signalToScore(macdSig) + signalToScore(maSig)) / 3;

  const overallSignal = scoreToSignal(avgScore);
  const strength = signalToStrength(overallSignal);

  return {
    signal: overallSignal,
    strength,
    reasons: [rsiResult.reason, macdResult.reason, maResult.reason],
    rsiSignal: rsiSig,
    macdSignal: macdSig,
    maSignal: maSig,
  };
}

export function getSignalColor(signal: SignalType): string {
  switch (signal) {
    case '強い買い': return 'text-green-400';
    case '買い': return 'text-green-300';
    case '中立': return 'text-yellow-400';
    case '売り': return 'text-red-300';
    case '強い売り': return 'text-red-400';
  }
}

export function getSignalBgColor(signal: SignalType): string {
  switch (signal) {
    case '強い買い': return 'bg-green-500/20 border border-green-500/40';
    case '買い': return 'bg-green-500/10 border border-green-500/30';
    case '中立': return 'bg-yellow-500/10 border border-yellow-500/30';
    case '売り': return 'bg-red-500/10 border border-red-500/30';
    case '強い売り': return 'bg-red-500/20 border border-red-500/40';
  }
}
