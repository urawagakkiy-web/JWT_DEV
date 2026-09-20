import { createClient } from "@supabase/supabase-js";

// .env から Supabase の接続情報を読み込む。
// Vite は VITE_ で始まる変数だけをブラウザ側に渡す（それ以外は渡らない）。
const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 値が未設定、またはひな形のまま（xxxxxxxx が残っている）かを判定する。
// 設定前でも画面が真っ白にならないよう、ここで気づけるようにしている。
export const supabaseConfigured =
  Boolean(url) && Boolean(publishableKey) && !`${url}${publishableKey}`.includes("xxxxxxxx");

// 未設定のときに createClient が例外を投げてアプリごと落ちるのを避けるため、
// ダミーの値を渡してクライアント自体は必ず作る。実際の通信はエラーになるが、
// 画面は表示され「.env を設定してください」の案内を出せる。
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  publishableKey || "placeholder-key",
);
