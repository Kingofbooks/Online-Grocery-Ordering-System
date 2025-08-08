import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ShoppingCart from "./components/ShoppingCart";
import CheckoutForm from "./components/CheckoutForm";
import OrderConfirmation from "./components/OrderConfirmation";
import { fetchProducts, createOrder } from "./api";
import { CATEGORIES } from "./constants";

function App() {
 const [products, setProducts] = useState([]);
 const [filtered, setFiltered] = useState([]);
 const [cart, setCart] = useState([]);
 const [view, setView] = useState("products");
 const [selectedProduct, setSelectedProduct] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [orderError, setOrderError] = useState(null);
 const [orderData, setOrderData] = useState(null);
 const [category, setCategory] = useState("");

 // Load products
 useEffect(() => {
  setLoading(true);
  fetchProducts()
   .then((data) => {
    setProducts(data);
    setFiltered(data);
    setLoading(false);
   })
   .catch(() => {
    setError("Failed to fetch products");
    setLoading(false);
   });
 }, []);

 // Filter products
 const handleCategoryChange = (e) => {
  const value = e.target.value;
  setCategory(value);
  if (!value) {
   setFiltered(products);
  } else {
   const list = products.filter((p) => p.category === value);
   setFiltered(list);
  }
 };

 // Add to cart
 const handleAddToCart = (product, quantity) => {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
   setCart(
    cart.map((item) =>
     item.id === product.id
      ? { ...item, quantity: item.quantity + quantity }
      : item
    )
   );
  } else {
   setCart([...cart, { ...product, quantity }]);
  }
 };


 // Checkout submit
 const handleCheckout = (formData) => {
  setOrderError(null);
  createOrder({ ...formData, cart })
   .then((data) => {
    setOrderData(data);
    setCart([]);
    setView("confirmation");
   })
   .catch(() => {
    setOrderError("Order creation failed");
   });
 };

 if (loading) return <p>Loading...</p>;
 if (error) return <p>[Error - You need to specify the message]</p>;

 return (
  <div>
   {view === "products" && (
    <>
     <select value={category} onChange={handleCategoryChange}>
      <option value="">All Categories</option>
      {CATEGORIES.map((c) => (
       <option key={c} value={c}>
        {c}
       </option>
      ))}
     </select>
     {filtered.length === 0 ? (
      <p>No products found</p>
     ) : (
      <ProductList
       products={filtered}
       onViewDetail={(p) => {
        setSelectedProduct(p);
        setView("detail");
       }}
      />
     )}
    </>
   )}

   {view === "detail" && selectedProduct && (
    <ProductDetail
     product={selectedProduct}
     onAddToCart={handleAddToCart}
    />
   )}

   {view === "cart" && (
    <ShoppingCart cart={cart} onCheckout={() => setView("checkout")} />
   )}

   {view === "checkout" && (
    <CheckoutForm
     onSubmit={handleCheckout}
     apiError={orderError}
    />
   )}

   {view === "confirmation" && <OrderConfirmation order={orderData} />}
  </div>
 );
}

export default App;

