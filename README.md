# Crypto Bot Dashboard

仮想通貨トレードボット（Railway上で稼働）の運用ダッシュボード。
Supabase PostgreSQL に読み取り専用でアクセスし、ボットの状態・トレード履歴・シグナルログを可視化する。

## 技術スタック

- Next.js (App Router) / TypeScript
- Drizzle ORM / Supabase PostgreSQL
- Tailwind CSS / Recharts
- デプロイ: Vercel

## セットアップ

```bash
pnpm install
```

`.env` をプロジェクトルートに作成:

```env
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
```

```bash
pnpm dev
```

## ページ構成

| パス | 内容 |
|---|---|
| `/` | 概要 - ボット稼働状態、HALT警告、本日の損益、累計収益チャート、オープンポジション |
| `/trades` | トレード履歴 - クローズ済みトレード一覧、PnL推移チャート、勝率 |
| `/signals` | シグナルログ - GPT分析履歴、reasoning表示 |
| `/performance` | パフォーマンス分析 - ボット別/ペア別の収益比較 |
