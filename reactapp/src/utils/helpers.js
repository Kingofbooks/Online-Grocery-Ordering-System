export const calculateSubtotal = (cart) => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTotal = (cart, taxRate = 0.1) => {
  const subtotal = calculateSubtotal(cart);
  return subtotal + subtotal * taxRate;
};
