// Simulated API for testing
export const fetchProducts = () => {
 return new Promise((resolve) => {
  setTimeout(() => {
   resolve([
    { id: 1, name: "Apple", price: 1, stock: 10, category: "Fruits" },
    { id: 2, name: "Banana", price: 0.5, stock: 0, category: "Fruits" },
    { id: 3, name: "Milk", price: 2, stock: 5, category: "Dairy" }
   ]);
  }, 200);
 });
};

export const createOrder = (order) => {
 return new Promise((resolve, reject) => {
  if (order.cart.length === 0) {
   reject();
  } else {
   setTimeout(() => {
    resolve({ orderId: Date.now(), ...order });
   }, 200);
  }
 });
};

