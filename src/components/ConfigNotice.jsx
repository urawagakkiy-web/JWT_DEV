import { supabaseConfigured } from "../supabaseClient";

// .env が未設定（ひな形のまま）のときに出す案内。
// 設定済みなら何も表示しない。
export function ConfigNotice() {
  if (supabaseConfigured) {
    return null;
  }

  return (
    <p className="notice" role="status">
      Supabase の接続情報が未設定です。<code>.env</code> の
      <code>VITE_SUPABASE_URL</code> と <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
      に実際の値を入れて、開発サーバーを再起動してください。
    </p>
  );
}
