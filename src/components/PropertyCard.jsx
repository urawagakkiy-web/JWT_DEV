import { formatRent } from "../data/properties";

// 物件1件分のカード。表示するだけで状態は持たない。
export function PropertyCard({ property }) {
  return (
    <li className="card">
      <h3 className="card-name">{property.name}</h3>
      <p className="card-rent">{formatRent(property.rent)}</p>
      <p className="card-area">{property.area}</p>
      <p className="card-detail">
        {property.layout} ／ 徒歩{property.walk}分
      </p>
    </li>
  );
}
