# 投資ダッシュボード プロジェクト

リポジトリ: shuheiokazaki0840/claude_create
ブランチ: claude/sweet-gates-8x04w
起動: `npm run dev` → http://localhost:3000

## ページ構成
| パス | 内容 |
|------|------|
| `/` | ダッシュボード |
| `/stocks` | 銘柄分析（買い/売りシグナル） |
| `/portfolio` | ポートフォリオ管理 |
| `/life-plan` | 人生設計シミュレーター |
| `/notifications` | 通知設定 |
| `/settings` | アプリ設定 |

## 主要ファイル
- `src/components/Sidebar.tsx` — ナビゲーション
- `src/lib/mockData.ts` — モックデータ
- `src/lib/signals.ts` — 買い/売りシグナル計算
- `src/lib/useLocalStorage.ts` — データ永続化

## 今後の予定
- 楽天証券CSVインポート機能
- 実際の株価API連携
- 保有株・軍資金を入力して投資推薦を出す機能
- 将来の必要資金と人生設計の連携

このプロジェクトへの変更依頼をどうぞ。
