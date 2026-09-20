#!/bin/bash
# ダブルクリックでアプリを起動するためのファイル。
# 依存パッケージが無ければ入れてから、開発サーバーを起動してブラウザを開く。
# 終了するときはこのウィンドウで Control + C を押す。

cd "$(dirname "$0")" || exit 1

if [ ! -d node_modules ]; then
  echo "依存パッケージを取得します（初回のみ・数分かかることがあります）…"
  npm install || { echo "npm install に失敗しました"; read -r; exit 1; }
fi

if [ ! -f .env ]; then
  echo "注意: .env がありません。.env.example をコピーして Supabase の接続情報を入れてください。"
fi

echo "開発サーバーを起動します。ブラウザが自動で開きます。"
echo "終了するには Control + C を押してください。"
npm run dev -- --open
