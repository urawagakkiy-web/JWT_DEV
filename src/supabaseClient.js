import { createClient } from "@supabase/supabase-js";

// .env から Supabase の接続情報を読み込む。
// Vite は VITE_ で始まる変数だけをブラウザ側に渡す（それ以外は渡らない）。
const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 設定の不備を具体的に切り分ける。
// 問題がなければ null、あれば「何が悪いか」の文言を返す。
// ここで弾いておかないと、存在しないホストへ通信しにいって
// 「Supabase に接続できません」という原因の分かりにくいエラーになる。
function detectConfigProblem() {
  if (!url || !publishableKey) {
    return ".env が読み込まれていません。プロジェクト直下に .env を置いて、開発サーバーを再起動してください。";
  }
  // 配布時のひな形（xxxxxxxx）が残っている＝まだ実際の値を入れていない
  if (url.includes("xxxxxxxx") || publishableKey.includes("xxxxxxxx")) {
    return "接続情報がひな形の値のままです。Supabase ダッシュボードの Project Settings → API から実際の値を .env に入れて、開発サーバーを再起動してください。";
  }
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/.test(url)) {
    return `VITE_SUPABASE_URL の形式が正しくありません（現在の値: ${url}）。https://〇〇.supabase.co の形で指定してください。`;
  }
  return null;
}

export const configProblem = detectConfigProblem();

// 設定が正しいときだけ true
export const supabaseConfigured = configProblem === null;

// 未設定のときに createClient が例外を投げてアプリごと落ちるのを避けるため、
// ダミーの値を渡してクライアント自体は必ず作る。実際の通信はエラーになるが、
// 画面は表示され、上の configProblem の案内を出せる。
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  publishableKey || "placeholder-key",
);
