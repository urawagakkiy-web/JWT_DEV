import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// ログイン状態をアプリ全体で共有するためのコンテキスト
const AuthContext = createContext(null);

// どのコンポーネントからでも session / loading を取り出せるようにする
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // session が null ならログインしていない
  const [session, setSession] = useState(null);
  // 起動直後は保存済みセッションの確認中。判定が終わるまで true
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // リロード後もログイン状態を保つため、保存済みのセッションを読み直す
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // ログイン・ログアウト・トークン更新のたびに呼ばれ、画面に反映される
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // 後片付け。監視を解除しないと購読が二重になる
    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext value={{ session, loading }}>{children}</AuthContext>;
}
