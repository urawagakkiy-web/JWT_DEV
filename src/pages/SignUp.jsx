import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../components/AuthProvider";
import { ConfigNotice } from "../components/ConfigNotice";
import { toJapaneseAuthError } from "../authError";

export function SignUp() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // 確認メールが必要な設定のときに出す案内
  const [infoMessage, setInfoMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ログイン済みの人が会員登録画面を開いたら物件一覧へ送る
  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  async function signUp(event) {
    event.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    // 送信前に画面側で確認できることは確認しておく
    if (password !== passwordConfirm) {
      setErrorMessage("パスワードが一致しません。");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("パスワードは6文字以上で入力してください。");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setSubmitting(false);

    if (error) {
      setErrorMessage(toJapaneseAuthError(error));
      return;
    }

    // Supabase 側で「メール確認」が有効だと、登録直後は session が返らない。
    // その場合はログインさせず、確認メールを開くよう案内する。
    if (!data.session) {
      setInfoMessage("確認メールを送信しました。メール内のリンクを開いてから、ログインしてください。");
      return;
    }

    // 確認が不要な設定なら、そのままログイン状態になるので物件一覧へ
    navigate("/", { replace: true });
  }

  return (
    <main className="auth">
      <h1 className="auth-title">会員登録</h1>
      <p className="auth-lead">メールアドレスとパスワードを登録してください。</p>

      <ConfigNotice />

      <form className="auth-form" onSubmit={signUp}>
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
          <span className="field-label">パスワード（6文字以上）</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <label className="field">
          <span className="field-label">パスワード（確認）</span>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        {errorMessage && (
          <p className="error" role="alert">
            {errorMessage}
          </p>
        )}
        {infoMessage && (
          <p className="info" role="status">
            {infoMessage}
          </p>
        )}

        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "登録中…" : "登録する"}
        </button>
      </form>

      <p className="auth-switch">
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </main>
  );
}
