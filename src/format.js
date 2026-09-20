// 家賃を「128,000円」の形に整える
export function formatRent(rent) {
  return `${Number(rent).toLocaleString("ja-JP")}円`;
}
