import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// ログインしている場合だけ中身を表示する。
// 未ログインならログイン画面へリダイレクトする。
export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  // セッション確認中に判定すると、ログイン済みでも一瞬ログイン画面に飛んでしまう。
  // 確認が終わるまでは何も判断しない。
  if (loading) {
    return <p className="loading">読み込み中…</p>;
  }

  if (!session) {
    // replace を付けて履歴を残さない（戻るボタンで戻れてしまうのを防ぐ）
    return <Navigate to="/login" replace />;
  }

  return children;
}
