import React, { useEffect, useState } from "react";
import * as api from "../utils/api";

export default function ProductList() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [category, setCategory] = useState("");

 const loadAll = async () => {
  setLoading(true);
  setError("");
  try {
   const res = await api.getAllProducts();
   setProducts(res || []);
  } catch (err) {
   setError(err?.message || "Failed to fetch products");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadAll();
 }, []);

 const handleCategoryChange = async (e) => {
  const cat = e.target.value;
  setCategory(cat);
  if (!cat) return loadAll();

  setLoading(true);
  setError("");
  try {
   const res = await api.getProductsByCategory(cat);
   setProducts(res || []);
  } catch (err) {
   setError(err?.message || "Failed to fetch products");
  } finally {
   setLoading(false);
  }
 };

 if (loading) return <div data-testid="products-loading">Loading products...</div>;
 if (error) return <div data-testid="products-error">[Error - You need to specify the message]</div>;

 return (
  <div>
   <div>
    <label>Filter by category</label>
    <select
     data-testid="category-select"
     value={category}
     onChange={handleCategoryChange}
    >
     <option value="">All</option>
     <option value="Fruits">Fruits</option>
     <option value="Dairy">Dairy</option>
     <option value="Bakery">Bakery</option>
     <option value="Vegetables">Vegetables</option>
    </select>
   </div>

   <div data-testid="product-list">
    {products && products.length > 0 ? (
     <ul>
      {products.map((p) => (
       <li key={p.id}>
        <div>{p.name}</div>
        <div>${Number(p.price).toFixed(2)}</div>
        <div data-testid={p.stockQuantity === 0 ? `out-of-stock-${p.id}` : `in-stock-${p.id}`}>
         {p.stockQuantity === 0
          ? "Out of Stock"
          : `In Stock: ${p.stockQuantity}`}
        </div>
       </li>
      ))}
     </ul>
    ) : (
     <div data-testid="no-products">No products found</div>
    )}
   </div>
  </div>
 );
}

