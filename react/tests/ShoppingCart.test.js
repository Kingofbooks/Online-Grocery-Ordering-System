import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingCart from '../components/ShoppingCart';

describe('ShoppingCart Component', () => {
  const mockCart = [
    { id: 1, name: 'Apple', price: 1, quantity: 2, stockQuantity: 5, category: 'Fruits' },
    { id: 2, name: 'Milk', price: 2.5, quantity: 1, stockQuantity: 3, category: 'Dairy' },
  ];

  it('renders empty cart message', () => {
    render(
      <ShoppingCart cartItems={[]} />
    );
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
    expect(screen.getByTestId('cart-checkout-btn')).toBeDisabled();
  });

  it('renders all cart items, calculates subtotal and total', () => {
    render(
      <ShoppingCart cartItems={mockCart} />
    );
    // Items
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
    // Subtotals
    expect(screen.getByText('$2.00')).toBeInTheDocument(); // Apple 2 x $1
    expect(screen.getByText('$2.50')).toBeInTheDocument(); // Milk 1 x $2.5
    // Total
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$4.50');
    // Checkout button enabled
    expect(screen.getByTestId('cart-checkout-btn')).toBeEnabled();
  });

  it('allows removing items', () => {
    const handleRemove = jest.fn();
    render(
      <ShoppingCart cartItems={mockCart} onRemoveItem={handleRemove} />
    );
    fireEvent.click(screen.getByTestId('cart-remove-btn-1'));
    expect(handleRemove).toHaveBeenCalledWith(1);
  });

  it('allows quantity update, clamps between 1 and max', () => {
    const handleUpdate = jest.fn();
    render(
      <ShoppingCart cartItems={mockCart} onUpdateQuantity={handleUpdate} />
    );
    const qtyInput = screen.getByTestId('cart-quantity-input-1');
    fireEvent.change(qtyInput, { target: { value: 7 } });
    expect(handleUpdate).toHaveBeenCalledWith(1, 5); // clamps to max (stockQuantity)
    fireEvent.change(qtyInput, { target: { value: 0 } });
    expect(handleUpdate).toHaveBeenCalledWith(1, 1); // clamps to min
  });

  it('checkout button triggers onCheckout', () => {
    const handleCheckout = jest.fn();
    render(
      <ShoppingCart cartItems={mockCart} onCheckout={handleCheckout} />
    );
    fireEvent.click(screen.getByTestId('cart-checkout-btn'));
    expect(handleCheckout).toHaveBeenCalled();
  });
});
