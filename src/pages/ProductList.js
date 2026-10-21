import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import ProductTable from "../components/ProductTable";

const ProductList = ({ products, onDelete, onUpdateStock }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [notice, setNotice] = useState("");
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
  if (!message) return;
  setNotice(message);
  window.history.replaceState({}, document.title);
  const timer = setTimeout(() => setNotice(""), 3000);
  return () => clearTimeout(timer);
}, [message]);

  const handleQueryShift = (e) => setQuery(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      (category === "Tất cả" || p.category === category)
  );

  return (
    <div>
      {notice && (
        <div className="notice">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}
      <FilterBar
        query={query}
        onQueryChange={handleQueryShift}
        category={category}
        onCategoryChange={handleCategoryChange}
      />
      <p>Tìm thấy {filtered.length} sản phẩm</p>
      <ProductTable products={filtered} onDelete={onDelete} onUpdateStock={onUpdateStock} />
    </div>
  );
};

export default ProductList;