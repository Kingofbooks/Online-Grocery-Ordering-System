import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutForm from '../components/CheckoutForm';
import * as api from '../utils/api';

jest.mock('../utils/api');

const mockCartItems = [
  { id: 1, name: 'Apple', price: 1.2, quantity: 2, stockQuantity: 5, category: 'Fruits' },
  { id: 2, name: 'Milk', price: 2.5, quantity: 1, stockQuantity: 3, category: 'Dairy' },
];

describe('CheckoutForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form, order summary and disables place order when cart is empty', () => {
    render(<CheckoutForm cartItems={[]} />);
    expect(screen.getByTestId('checkout-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('submit-order-btn')).toBeDisabled();
  });

  it('validates fields and shows error messages', async () => {
    render(<CheckoutForm cartItems={mockCartItems} />);
    fireEvent.click(screen.getByTestId('submit-order-btn'));
    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');

    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Tom' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'bademail' } });
    fireEvent.click(screen.getByTestId('submit-order-btn'));
    expect(screen.getByTestId('email-error')).toHaveTextContent('Please enter a valid email address');
  });

  it('submits form with valid data and cart, triggers API and callback', async () => {
    api.createOrder.mockResolvedValueOnce({ id: 99, customerName: 'Tom', customerEmail: 'tom@mail.com', orderItems: [], totalAmount: 4.9 });
    const onOrderPlaced = jest.fn();
    render(<CheckoutForm cartItems={mockCartItems} onOrderPlaced={onOrderPlaced} />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Tom' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'tom@mail.com' } });
    fireEvent.click(screen.getByTestId('submit-order-btn'));
    await waitFor(() => expect(onOrderPlaced).toHaveBeenCalledWith(expect.objectContaining({ id: 99 })));
    expect(api.createOrder).toHaveBeenCalled();
  });

  it('shows API error if order creation fails', async () => {
    api.createOrder.mockRejectedValueOnce(new Error('Stock not sufficient'));
    render(<CheckoutForm cartItems={mockCartItems} />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Anna' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'anna@mail.com' } });
    fireEvent.click(screen.getByTestId('submit-order-btn'));
    await waitFor(() => expect(screen.getByTestId('checkout-error')).toHaveTextContent('Stock not sufficient'));
  });
});
