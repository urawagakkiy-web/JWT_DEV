// Supabase（PostgREST）が返すエラーを日本語にする。
// とくに「テーブルがまだ無い」は最初に必ず出るので、対処方法まで書く。
export function toJapaneseDbError(error) {
  if (!error) {
    return "";
  }

  // テーブルが存在しない。
  // PostgREST 経由だと PGRST205（スキーマキャッシュに無い）で返ることが多く、
  // SQL レベルでは 42P01 になる。実際に返ってきたのは PGRST205 だった。
  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /relation .* does not exist|Could not find the table/i.test(error.message ?? "")
  ) {
    return "物件テーブルがまだありません。supabase/schema.sql の内容を Supabase の SQL Editor で実行してください。";
  }

  // 42501 / PGRST301 = RLS のポリシーに弾かれた
  if (error.code === "42501" || error.code === "PGRST301") {
    return "権限がないため操作できませんでした。ログインし直すか、RLS のポリシー設定を確認してください。";
  }

  // 23514 = CHECK 制約違反（空文字や負の家賃）
  if (error.code === "23514") {
    return "入力内容が正しくありません。物件名・エリア・間取りは必須で、家賃は0以上の数値にしてください。";
  }

  if (/Failed to fetch/i.test(error.message ?? "")) {
    return "Supabase に接続できませんでした。ネットワークと .env の設定を確認してください。";
  }

  return error.message ?? "不明なエラーが発生しました。";
}
