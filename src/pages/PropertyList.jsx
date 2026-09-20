import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../components/AuthProvider";
import { PropertyCard } from "../components/PropertyCard";
import { PROPERTIES } from "../data/properties";

export function PropertyList() {
  const { session } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    // セッションが消えた時点で ProtectedRoute もログイン画面へ送るが、
    // ここでも明示的に遷移させて動きを分かりやすくしている
    navigate("/login", { replace: true });
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="logo">不動産管理アプリ</h1>
        <div className="header-right">
          {/* ログイン中のメールアドレスを表示する */}
          <span className="user">{session?.user?.email}</span>
          <button type="button" className="logout" onClick={signOut}>
            ログアウト
          </button>
        </div>
      </header>

      <main className="main">
        <div className="main-head">
          <h2 className="section-title">物件一覧</h2>
          {/* 件数はハードコードせず、データから数える */}
          <p className="count">全 {PROPERTIES.length} 件</p>
        </div>

        <ul className="card-list">
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ul>
      </main>
    </div>
  );
}
