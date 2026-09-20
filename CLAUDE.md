# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) が **不動産管理アプリ** を扱うときのガイダンスです。

## プロジェクト概要

Supabase の認証（メールアドレス＋パスワード）つきの不動産管理Webアプリ。
ログインすると自分が登録した物件の一覧が見られ、登録・編集・削除ができる。

セットアップ手順・テーブル定義・ファイル構成は [README.md](README.md) を参照。

## デプロイ情報

- 本番URL：https://プロジェクト名.vercel.app
- Supabaseプロジェクト名：realestate-app

補足:

- **本番URL の「プロジェクト名」は仮の値。** Vercel にデプロイしたあと、実際に発行された
  URL に差し替えること（この状態のままでは実在しないURLを指している）
- Supabase の Project URL は `https://frhsfoubbixdbrqikxfo.supabase.co`。
  ホスト名の `frhsfoubbixdbrqikxfo` が project ref で、ダッシュボードのURLにも出てくる
- リポジトリ: https://github.com/urawagakkiy-web/JWT_DEV

## 技術スタック

React 19 / Vite 8 / React Router 7 / `@supabase/supabase-js` 2系。スタイルは素のCSS。
バージョンは `package.json` に固定されている。TypeScript・状態管理ライブラリ・CSSフレームワークは入れない。

## 秘密情報の扱い（重要）

- 接続情報は `.env` で管理し、`.gitignore` で除外している。**コミットしない**
- `vercel.json` に環境変数を書かない。Vercel の Settings → Environment Variables に登録する
- `VITE_` の変数はビルド時に埋め込まれるため、**変更したら再デプロイ／開発サーバー再起動が必要**
- **`service_role` キーはフロントに置かない。** ブラウザに配布されるキーは Publishable key のみ

## データベース

`properties` テーブル（`name` / `rent` / `area` / `layout` ＋ `user_id`）。
定義は [supabase/schema.sql](supabase/schema.sql) にあり、SQL Editor で実行する。

RLS を有効にし、SELECT / INSERT / UPDATE / DELETE の4つに
「`auth.uid() = user_id` の行だけ」というポリシーを設定している。
**絞り込みは RLS が行うので、アプリ側に `.eq("user_id", ...)` を書かない**（二重管理になる）。

## 動作確認

テストは無い。**開発サーバーを起動して、ブラウザで実際に操作する**ことで確認する。
`index.html` を直接開いても動かない（Vite 構成のため）。`起動.command` をダブルクリックするか、
`npm run dev` を実行する。「ファイルを書いた」で終わらせない。

## 言語

UI・解説文・コメント・README・コミットメッセージは、すべて日本語で書く。
