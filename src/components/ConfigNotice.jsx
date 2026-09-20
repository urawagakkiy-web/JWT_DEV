import { configProblem } from "../supabaseClient";

// .env の設定に問題があるときだけ、その内容を具体的に表示する。
// 問題がなければ何も表示しない。
export function ConfigNotice() {
  if (!configProblem) {
    return null;
  }

  return (
    <p className="notice" role="status">
      <strong>設定が未完了です。</strong>
      <br />
      {configProblem}
    </p>
  );
}
