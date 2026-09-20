import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase, supabaseConfigured, configProblem } from "../supabaseClient";
import { useAuth } from "../components/AuthProvider";
import { ConfigNotice } from "../components/ConfigNotice";
import { toJapaneseAuthError } from "../authError";

export function Login() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // 送信中は二重送信を防ぐためにボタンを無効化する
  const [submitting, setSubmitting] = useState(false);

  // ログイン済みの人がログイン画面を開いたら物件一覧へ送る
  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  async function signIn(event) {
    event.preventDefault();
    setErrorMessage("");

    // 接続先が未設定のまま送信すると、存在しないホストへ通信しにいって
    // 「接続できません」という分かりにくいエラーになる。先に理由を出して止める。
    if (!supabaseConfigured) {
      setErrorMessage(configProblem);
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (error) {
      setErrorMessage(toJapaneseAuthError(error));
      return;
    }

    // 成功したら物件一覧へ。セッションは AuthProvider が受け取って共有する
    navigate("/", { replace: true });
  }

  return (
    <main className="auth">
      <h1 className="auth-title">不動産管理アプリ</h1>
      <p className="auth-lead">メールアドレスとパスワードでログインしてください。</p>

      <ConfigNotice />

      <form className="auth-form" onSubmit={signIn}>
        <label className="field">
          <span className="field-label">メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="field">
          <span className="field-label">パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {errorMessage && (
          <p className="error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="primary" disabled={submitting || !supabaseConfigured}>
          {submitting ? "ログイン中…" : "ログイン"}
        </button>
      </form>

      <p className="auth-switch">
        アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
      </p>
    </main>
  );
}
