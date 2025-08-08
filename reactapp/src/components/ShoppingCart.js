import React from "react";

function formatMoney(v) {
 return `$${Number(v).toFixed(2)}`;
}

export default function ShoppingCart({ cartItems = [], onRemoveItem, onUpdateQuantity, onCheckout }) {
 const total = cartItems.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);

 const handleQtyChange = (id, value, stock) => {
  let v = Number(value);
  if (Number.isNaN(v)) v = 1;
  if (v < 1) v = 1;
  if (stock != null && v > stock) v = stock;
  if (onUpdateQuantity) onUpdateQuantity(id, v);
 };

 if (!cartItems || cartItems.length === 0) {
  return (
   <div>
    <div data-testid="cart-empty">Your cart is empty</div>
    <button data-testid="cart-checkout-btn" disabled>
     Checkout
    </button>
   </div>
  );
 }

 return (
  <div>
   <ul>
    {cartItems.map((it) => (
     <li key={it.id} data-testid={`cart-item-${it.id}`}>
      <div>{it.name}</div>
      <div>{formatMoney(it.price)} x {it.quantity}</div>
      <div>{formatMoney(Number(it.price) * Number(it.quantity))}</div>

      <div>
       <input
        data-testid={`cart-quantity-input-${it.id}`}
        type="number"
        value={it.quantity}
        min="1"
        max={it.stockQuantity}
        onChange={(e) => handleQtyChange(it.id, e.target.value, it.stockQuantity)}
       />
      </div>

      <button data-testid={`cart-remove-btn-${it.id}`} onClick={() => onRemoveItem && onRemoveItem(it.id)}>
       Remove
      </button>
     </li>
    ))}
   </ul>

   <div data-testid="cart-total">{formatMoney(total)}</div>

   <button data-testid="cart-checkout-btn" onClick={() => onCheckout && onCheckout()}>
    Checkout
   </button>
  </div>
 );
}

