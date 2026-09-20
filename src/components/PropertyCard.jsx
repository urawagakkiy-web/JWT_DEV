import { formatRent } from "../format";

// 物件1件分のカード。表示と、編集・削除の呼び出しだけを行う。
// 実際の更新処理は親（PropertyList）が持つ。
export function PropertyCard({ property, onEdit, onDelete, busy }) {
  return (
    <li className="card">
      <h3 className="card-name">{property.name}</h3>
      <p className="card-rent">{formatRent(property.rent)}</p>
      <p className="card-area">{property.area}</p>
      <p className="card-detail">{property.layout}</p>

      <div className="card-actions">
        <button type="button" className="ghost" onClick={() => onEdit(property)} disabled={busy}>
          編集
        </button>
        <button type="button" className="danger" onClick={() => onDelete(property)} disabled={busy}>
          削除
        </button>
      </div>
    </li>
  );
}
