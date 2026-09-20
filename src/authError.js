// Supabase が返すエラーは英語なので、よくあるものを日本語に置き換える。
// 該当しないものは元のメッセージをそのまま見せて、原因を追えるようにする。
const MESSAGES = [
  { match: "Invalid login credentials", text: "メールアドレスまたはパスワードが違います。" },
  { match: "Email not confirmed", text: "メールアドレスの確認が済んでいません。確認メールのリンクを開いてください。" },
  { match: "User already registered", text: "このメールアドレスはすでに登録されています。" },
  { match: "Password should be at least", text: "パスワードが短すぎます。6文字以上で入力してください。" },
  { match: "Unable to validate email address", text: "メールアドレスの形式が正しくありません。" },
  { match: "For security purposes", text: "短時間に試行しすぎました。少し待ってからもう一度お試しください。" },
  {
    match: "Failed to fetch",
    text:
      "Supabase に接続できませんでした。次のどれかが原因です。" +
      "(1) .env の VITE_SUPABASE_URL が間違っている（実在しないホスト名）" +
      " / (2) .env を変更したあと開発サーバーを再起動していない" +
      " / (3) Supabase のプロジェクトが停止（Paused）している" +
      " / (4) ネットワークに繋がっていない。",
  },
];

export function toJapaneseAuthError(error) {
  const original = error?.message ?? "不明なエラーが発生しました。";
  const hit = MESSAGES.find((item) => original.includes(item.match));
  return hit ? hit.text : original;
}
