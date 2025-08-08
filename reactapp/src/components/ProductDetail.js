import React, { useEffect, useState } from "react";
import * as api from "../utils/api";

export default function ProductDetail({ productId, onAddToCart }) {
 const [loading, setLoading] = useState(true);
 const [product, setProduct] = useState(null);
 const [quantity, setQuantity] = useState(1);
 const [error, setError] = useState("");

 useEffect(() => {
  let mounted = true;
  setLoading(true);
  setError("");
  api.getProductById(productId)
   .then((p) => {
    if (!mounted) return;
    setProduct(p);
    setQuantity(1);
   })
   .catch((err) => {
    if (!mounted) return;
    setError(err?.message || "Failed to load product");
   })
   .finally(() => mounted && setLoading(false));
  return () => (mounted = false);
 }, [productId]);

 const handleQuantityChange = (e) => {
  setQuantity(Number(e.target.value || 0));
 };

 const clampedQuantity = () => {
  if (!product) return 1;
  const max = Number(product.stockQuantity ?? 0);
  if (Number.isNaN(quantity) || quantity < 1) return 1;
  if (quantity > max) return max;
  return quantity;
 };

 const handleAdd = () => {
  if (!product) return;
  const q = clampedQuantity();
  if (onAddToCart) onAddToCart({ ...product, quantity: q });
 };

 if (loading) return <div data-testid="detail-loading">Loading...</div>;
 if (error) return <div data-testid="detail-error">[Error - You need to specify the message]</div>;
 if (!product) return <div data-testid="detail-error">Product not found</div>;

 const inStock = Number(product.stockQuantity ?? 0) > 0;

 return (
  <div data-testid="product-detail-container">
   <h2>{product.name}</h2>
   <p>{product.description}</p>
   <div data-testid="detail-stock-status">
    {inStock ? `In Stock: ${product.stockQuantity}` : "Out of Stock"}
   </div>

   <div>
    <label>Quantity</label>
    <input
     data-testid="quantity-input"
     type="number"
     min="1"
     max={product.stockQuantity}
     value={quantity}
     onChange={handleQuantityChange}
     disabled={!inStock}
    />
   </div>

   <button
    data-testid="add-to-cart-btn"
    onClick={handleAdd}
    disabled={!inStock}
   >
    Add to Cart
   </button>
  </div>
 );
}

