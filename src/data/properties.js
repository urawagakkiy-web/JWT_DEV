// 物件一覧に表示するダミーデータ。
// Supabase のテーブルに置き換えるときは、この配列を取得結果に差し替えるだけでよい。
export const PROPERTIES = [
  { id: 1, name: "グランドメゾン浦和", rent: 128000, area: "埼玉県さいたま市浦和区", layout: "2LDK", walk: 7 },
  { id: 2, name: "越谷レイクサイドレジデンス", rent: 96000, area: "埼玉県越谷市", layout: "1LDK", walk: 12 },
  { id: 3, name: "パークコート大宮", rent: 154000, area: "埼玉県さいたま市大宮区", layout: "3LDK", walk: 5 },
  { id: 4, name: "ハイツ川口元郷", rent: 72000, area: "埼玉県川口市", layout: "1K", walk: 9 },
  { id: 5, name: "所沢グリーンヒルズ", rent: 88000, area: "埼玉県所沢市", layout: "2DK", walk: 15 },
  { id: 6, name: "ザ・タワー武蔵浦和", rent: 186000, area: "埼玉県さいたま市南区", layout: "3LDK", walk: 3 },
];

// 家賃を「128,000円」の形に整える
export function formatRent(rent) {
  return `${rent.toLocaleString("ja-JP")}円`;
}
