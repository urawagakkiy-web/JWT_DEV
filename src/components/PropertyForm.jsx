import { useState } from "react";

// 空のフォームの初期値。新規登録のときに使う
const EMPTY = { name: "", rent: "", area: "", layout: "" };

// 新規登録と編集で同じフォームを使う。
// 違いは initialValue（編集は既存の値）と submitLabel（ボタンの文言）だけ。
export function PropertyForm({ initialValue = EMPTY, submitLabel, onSubmit, onCancel, submitting }) {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");

  // 入力欄はすべて同じ形なので、列名を受け取る1つの関数で扱う
  function change(field) {
    return (event) => setValue({ ...value, [field]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();

    // 送信前に画面側で確認できることは確認しておく（サーバー側も CHECK 制約で守っている）
    if (!value.name.trim() || !value.area.trim() || !value.layout.trim()) {
      setErrorMessage("物件名・エリア・間取りは必須です。");
      return;
    }
    if (value.rent === "" || Number(value.rent) < 0 || Number.isNaN(Number(value.rent))) {
      setErrorMessage("家賃は0以上の数値で入力してください。");
      return;
    }

    setErrorMessage("");
    onSubmit(value);
  }

  return (
    <form className="property-form" onSubmit={submit}>
      <div className="form-grid">
        <label className="field">
          <span className="field-label">物件名</span>
          <input type="text" value={value.name} onChange={change("name")} required />
        </label>

        <label className="field">
          <span className="field-label">家賃（円）</span>
          <input type="number" min="0" step="1000" value={value.rent} onChange={change("rent")} required />
        </label>

        <label className="field">
          <span className="field-label">エリア</span>
          <input type="text" value={value.area} onChange={change("area")} required />
        </label>

        <label className="field">
          <span className="field-label">間取り（例: 1LDK）</span>
          <input type="text" value={value.layout} onChange={change("layout")} required />
        </label>
      </div>

      {errorMessage && (
        <p className="error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "保存中…" : submitLabel}
        </button>
        {/* 新規登録のときは onCancel を渡さないので、取消ボタンは出ない */}
        {onCancel && (
          <button type="button" className="ghost" onClick={onCancel} disabled={submitting}>
            取消
          </button>
        )}
      </div>
    </form>
  );
}
