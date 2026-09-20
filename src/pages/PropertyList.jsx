import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../components/AuthProvider";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyForm } from "../components/PropertyForm";
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from "../api/properties";
import { toJapaneseDbError } from "../api/dbError";

export function PropertyList() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  // 保存や削除の通信中。二重操作を防ぐためにボタンを無効化する
  const [busy, setBusy] = useState(false);
  // 新規登録フォームを開いているか
  const [adding, setAdding] = useState(false);
  // 編集中の物件。null なら編集していない
  const [editing, setEditing] = useState(null);

  // 画面を開いたときに一覧を読み込む。
  // 「自分の物件だけ」という絞り込みは RLS 側で行われるので、ここでは書かない。
  useEffect(() => {
    let alive = true; // 画面を離れたあとに state を触らないための目印

    async function load() {
      const { data, error } = await fetchProperties();
      if (!alive) return;

      if (error) {
        setErrorMessage(toJapaneseDbError(error));
      } else {
        setProperties(data);
      }
      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  async function addProperty(input) {
    setBusy(true);
    const { data, error } = await createProperty(input);
    setBusy(false);

    if (error) {
      setErrorMessage(toJapaneseDbError(error));
      return;
    }

    // 並びは新しい順なので先頭に足す。再取得しなくても表示が揃う
    setProperties([data, ...properties]);
    setErrorMessage("");
    setAdding(false);
  }

  async function saveProperty(input) {
    setBusy(true);
    const { data, error } = await updateProperty(editing.id, input);
    setBusy(false);

    if (error) {
      setErrorMessage(toJapaneseDbError(error));
      return;
    }

    // 更新した1件だけ差し替える
    setProperties(properties.map((property) => (property.id === data.id ? data : property)));
    setErrorMessage("");
    setEditing(null);
  }

  async function removeProperty(property) {
    // 取り消せない操作なので確認する
    if (!window.confirm(`「${property.name}」を削除します。よろしいですか？`)) {
      return;
    }

    setBusy(true);
    const { error } = await deleteProperty(property.id);
    setBusy(false);

    if (error) {
      setErrorMessage(toJapaneseDbError(error));
      return;
    }

    setProperties(properties.filter((item) => item.id !== property.id));
    setErrorMessage("");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  // 編集を始めるときは、フォームに今の値を入れて開く
  function startEdit(property) {
    setAdding(false);
    setEditing(property);
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="logo">不動産管理アプリ</h1>
        <div className="header-right">
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
          <p className="count">全 {properties.length} 件</p>
        </div>

        {errorMessage && (
          <p className="error" role="alert">
            {errorMessage}
          </p>
        )}

        {/* 新規登録。開いている間は一覧の上にフォームを出す */}
        {adding ? (
          <section className="panel">
            <h3 className="panel-title">物件を登録</h3>
            <PropertyForm
              submitLabel="登録する"
              onSubmit={addProperty}
              onCancel={() => setAdding(false)}
              submitting={busy}
            />
          </section>
        ) : (
          <button type="button" className="primary add" onClick={() => setAdding(true)}>
            ＋ 物件を登録
          </button>
        )}

        {/* 編集フォーム。編集中の1件だけ表示する */}
        {editing && (
          <section className="panel">
            <h3 className="panel-title">「{editing.name}」を編集</h3>
            <PropertyForm
              // 物件を切り替えたらフォームの中身も入れ替わるように key を渡す
              key={editing.id}
              initialValue={{
                name: editing.name,
                rent: String(editing.rent),
                area: editing.area,
                layout: editing.layout,
              }}
              submitLabel="保存する"
              onSubmit={saveProperty}
              onCancel={() => setEditing(null)}
              submitting={busy}
            />
          </section>
        )}

        {loading ? (
          <p className="loading">読み込み中…</p>
        ) : properties.length === 0 ? (
          <p className="empty">登録された物件はありません。「＋ 物件を登録」から追加してください。</p>
        ) : (
          <ul className="card-list">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={startEdit}
                onDelete={removeProperty}
                busy={busy}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
