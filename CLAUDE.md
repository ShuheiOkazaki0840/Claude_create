@AGENTS.md

# 投資ダッシュボード プロジェクト

## 概要
プロ投資家向けの株式分析・ポートフォリオ管理・人生設計Webアプリ。

## 技術スタック
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS（ダークテーマ）
- Recharts（チャート）
- Lucide React（アイコン）
- localStorage（データ永続化）

## ブランチ
`claude/sweet-gates-8x04w`

## ページ一覧
| パス | 内容 |
|------|------|
| `/` | ダッシュボード（市況概要・日経225チャート） |
| `/stocks` | 銘柄分析（RSI/MACD買い売りシグナル） |
| `/portfolio` | ポートフォリオ管理（保有株・損益・グラフ） |
| `/life-plan` | 人生設計シミュレーター（複利計算・目標達成判定） |
| `/notifications` | 通知設定（シグナルアラートON/OFF） |
| `/settings` | アプリ設定（通貨・市場・リスク許容度） |

## 主要ファイル
- `src/components/Sidebar.tsx` — サイドバーナビゲーション
- `src/lib/mockData.ts` — モックデータ（株価・ポートフォリオ等）
- `src/lib/signals.ts` — 買い/売りシグナル計算ロジック
- `src/lib/useLocalStorage.ts` — データ永続化カスタムフック

## データ永続化（localStorage キー）
- `portfolio-holdings` — 保有株一覧
- `lifeplan-goals` — 人生設計の目標リスト
- `lifeplan-assets` / `lifeplan-savings` / `lifeplan-return` — シミュレーション設定
- `notification-settings` — 通知設定
- `app-settings` — アプリ全般設定

## 今後の予定・要望
- [ ] 楽天証券CSVインポート機能
- [ ] 実際の株価API連携（Yahoo Finance等）
- [ ] 保有株・軍資金を入力して投資推薦を出す機能
- [ ] 将来の必要資金と紐付けた人生設計の充実

## デプロイ
未デプロイ（Vercelへのログインが必要）。
ローカル起動: `npm run dev` → http://localhost:3000
