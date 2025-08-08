import React from "react";

function OrderConfirmation({ order }) {
  if (!order) {
    return <p>No order data</p>;
  }

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Order ID: {order.orderId}</p>
      <h3>Items:</h3>
      <ul>
        {order.cart && order.cart.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>
      <p>Thank you for your purchase!</p>
    </div>
  );
}

export default OrderConfirmation;
