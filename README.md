# 不動産管理アプリ

Supabase の認証（メールアドレス＋パスワード）つきの不動産管理Webアプリ。
ログインすると物件一覧（ダミーデータ）が見られる。

リポジトリ: https://github.com/urawagakkiy-web/JWT_DEV

## 画面

| パス | 画面 | ログイン |
|---|---|---|
| `/` | 物件一覧（物件名・家賃・エリアのカード） | 必須。未ログインなら `/login` へリダイレクト |
| `/login` | ログイン | 不要 |
| `/signup` | 会員登録 | 不要 |

ログイン済みの状態で `/login` や `/signup` を開いた場合は、物件一覧へ戻される。

## 技術スタック

| 種類 | 使うもの |
|---|---|
| ビルド | Vite 8 |
| UI | React 19 |
| ルーティング | React Router 7 |
| 認証 | Supabase（`@supabase/supabase-js` 2系） |
| スタイル | 素のCSS（`src/index.css`） |

## セットアップ

```bash
npm install          # 依存パッケージの取得
cp .env.example .env # 接続情報のファイルを作る
```

`.env` に Supabase の値を入れる。**`.env` は `.gitignore` で除外してあるのでコミットされない。**

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb-publishable-xxxxxxxx
```

値は Supabase ダッシュボードの **Project Settings → API** にある。
Vite は `VITE_` で始まる変数だけをブラウザ側へ渡す。
**Publishable key は公開されてよいキー**だが、`service_role` キーはブラウザに置かないこと。

未設定のままでも画面は開き、「接続情報が未設定です」の案内が出る（ログインは当然できない）。
`.env` を書き換えたら**開発サーバーを再起動する**（起動中の変更は読み込まれない）。

## 実行

**`index.html` をダブルクリックしても動かない。** 必ず開発サーバー経由で開く。
JSX の変換と `import "react"` のようなライブラリ解決を Vite が行っているため、
ブラウザがファイルを直接読んでも画面は出ない（開いた場合は、その旨の案内が表示される）。

いちばん簡単なのは **`起動.command` をダブルクリック**する方法。
依存パッケージの取得（初回のみ）→ 開発サーバー起動 → ブラウザを開く、までやってくれる。
終了するときは、開いたターミナルのウィンドウで `Control + C`。

ターミナルから操作する場合は次のとおり。

```bash
npm run dev      # 開発サーバー http://localhost:5173/
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果の確認
```

## Supabase 側の設定

1. プロジェクトを作成する
2. **Authentication → Providers → Email** を有効にする
3. 確認メールを省きたい場合は **Confirm email** をオフにする
   - オンのままだと、会員登録後に確認メールのリンクを開くまでログインできない
   - アプリ側はどちらの設定でも動く（確認が必要なときは案内を表示する）

## ファイル構成

```
real-estate-app/
├── 起動.command            # ダブルクリックで開発サーバーを起動する
├── index.html              # Viteのエントリ（直接開いても動かない）
├── vite.config.js
├── .env                    # 接続情報（Git管理外）
├── .env.example            # .env のひな形
└── src/
    ├── main.jsx            # 起動
    ├── App.jsx             # ルーティング
    ├── supabaseClient.js   # Supabaseクライアントの生成
    ├── authError.js        # Supabaseのエラーを日本語にする
    ├── index.css           # 見た目。色は :root の変数に集約
    ├── components/
    │   ├── AuthProvider.jsx    # ログイン状態をアプリ全体で共有
    │   ├── ProtectedRoute.jsx  # 未ログインならログイン画面へ
    │   ├── ConfigNotice.jsx    # .env 未設定の案内
    │   └── PropertyCard.jsx    # 物件カード1件分
    ├── pages/
    │   ├── Login.jsx
    │   ├── SignUp.jsx
    │   └── PropertyList.jsx
    └── data/
        └── properties.js   # ダミーの物件データ
```

物件を Supabase のテーブルから取るようにするときは、`src/data/properties.js` の
`PROPERTIES` を取得結果に差し替える。件数表示はデータから数えているので追従する。
