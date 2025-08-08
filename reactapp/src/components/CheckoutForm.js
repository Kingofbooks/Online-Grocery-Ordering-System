import React, { useState, useEffect } from "react";
import * as api from "../utils/api";

export default function CheckoutForm({ cartItems = [], onOrderPlaced }) {
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [errors, setErrors] = useState({});
 const [submitting, setSubmitting] = useState(false);
 const [apiError, setApiError] = useState("");

 useEffect(() => {
  setApiError("");
 }, [name, email, cartItems]);

 const validate = () => {
  const e = {};
  if (!name.trim()) e.name = "Name is required";
  if (!email.trim()) e.email = "Email is required";
  else {
   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!re.test(email)) e.email = "Please enter a valid email address";
  }
  setErrors(e);
  return Object.keys(e).length === 0;
 };

 const calcTotal = () =>
  cartItems.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);

 const handleSubmit = async (ev) => {
  ev.preventDefault();
  setApiError("");
  if (!validate()) return;
  if (!cartItems || cartItems.length === 0) return;

  const payload = {
   customerName: name.trim(),
   customerEmail: email.trim(),
   orderItems: cartItems.map(({ id, name, price, quantity }) => ({
    id,
    name,
    price,
    quantity
   })),
   totalAmount: parseFloat(calcTotal().toFixed(2)),
  };

  setSubmitting(true);
  try {
   const created = await api.createOrder(payload);
   if (onOrderPlaced) onOrderPlaced(created);
  } catch (err) {
   setApiError(err?.message || "Failed to place order");
  } finally {
   setSubmitting(false);
  }
 };

 return (
  <div data-testid="checkout-form-container">
   <form onSubmit={handleSubmit}>
    <div>
     <label>Name</label>
     <input
      data-testid="name-input"
      value={name}
      onChange={(e) => setName(e.target.value)}
      disabled={submitting}
     />
     <div data-testid="name-error">{errors.name || ""}</div>
    </div>

    <div>
     <label>Email</label>
     <input
      data-testid="email-input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      disabled={submitting}
     />
     <div data-testid="email-error">{errors.email || ""}</div>
    </div>

    <div>
     <h4>Order Summary</h4>
     {cartItems.length === 0 ? (
      <div>No items in cart</div>
     ) : (
      <ul>
       {cartItems.map((it) => (
        <li key={it.id}>
         {it.name} x {it.quantity} — ${(+it.price * +it.quantity).toFixed(2)}
        </li>
       ))}
      </ul>
     )}
     <div>Total: ${calcTotal().toFixed(2)}</div>
    </div>

    {apiError && <div data-testid="checkout-error">{apiError}</div>}

    <button
     data-testid="submit-order-btn"
     type="submit"
     disabled={cartItems.length === 0 || submitting}
    >
     {submitting ? "Placing..." : "Place Order"}
    </button>
   </form>
  </div>
 );
}

