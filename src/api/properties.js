import { supabase } from "../supabaseClient";

// 物件テーブルへの読み書きをここにまとめる。
// 画面側は Supabase の作法を知らずに、この関数だけを呼べばよい。
//
// user_id はテーブルの既定値（auth.uid()）で入るため、アプリからは送らない。
// 「自分の行だけ」という絞り込みも RLS が行うので、where 句は書かなくてよい。
const TABLE = "properties";
const COLUMNS = "id, name, rent, area, layout, created_at";

// 一覧取得（新しい順）
export async function fetchProperties() {
  return supabase.from(TABLE).select(COLUMNS).order("created_at", { ascending: false });
}

// 新規登録。登録した行をそのまま返してもらい、一覧に足せるようにする
export async function createProperty(input) {
  return supabase.from(TABLE).insert(toRow(input)).select(COLUMNS).single();
}

// 更新
export async function updateProperty(id, input) {
  return supabase.from(TABLE).update(toRow(input)).eq("id", id).select(COLUMNS).single();
}

// 削除
export async function deleteProperty(id) {
  return supabase.from(TABLE).delete().eq("id", id);
}

// フォームの入力値をテーブルの列に合わせて整える。
// 家賃は input から文字列で来るので数値にする。
function toRow(input) {
  return {
    name: input.name.trim(),
    rent: Number(input.rent),
    area: input.area.trim(),
    layout: input.layout.trim(),
  };
}
