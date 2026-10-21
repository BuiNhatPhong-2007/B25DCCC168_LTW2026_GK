const BUILD_TAG = "kt-6641";
/* eslint-disable import/first */
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";

console.log(BUILD_TAG);

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("gk_products");
    if (saved) {
      setProducts(JSON.parse(saved));
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    axios
      .get("/data/products.json", { signal: controller.signal })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError("Không tải được dữ liệu");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      localStorage.setItem("gk_products", JSON.stringify(products));
    }
  }, [products, loading, error]);

  const addProduct = (data) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    setProducts([...products, { id: maxId + 1, ...data }]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateStock = (id, delta) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, stock: p.stock + delta } : p))
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Layout loading={loading} error={error} />}>
        <Route index element={<Home products={products} />} />
        <Route
          path="products"
          element={
            <ProductList
              products={products}
              onDelete={deleteProduct}
              onUpdateStock={updateStock}
            />
          }
        />
        <Route path="products/new" element={<AddProduct onAdd={addProduct} />} />
        <Route path="products/:id" element={<ProductDetail products={products} />} />
      </Route>
    </Routes>
  );
};

export default App;