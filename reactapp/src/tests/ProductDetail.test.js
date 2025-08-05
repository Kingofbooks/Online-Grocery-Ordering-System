import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetail from '../components/ProductDetail';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('ProductDetail Component', () => {
  const apple = {
    id: 1,
    name: 'Apple',
    description: 'A juicy fresh apple.',
    price: 1.2,
    category: 'Fruits',
    stockQuantity: 20,
    imageUrl: 'https://imgs.com/apple.png',
  };
  const milk = {
    id: 2,
    name: 'Milk',
    description: 'Fresh organic milk.',
    price: 2.5,
    category: 'Dairy',
    stockQuantity: 0,
    imageUrl: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading then product details for in-stock item', async () => {
    api.getProductById.mockResolvedValueOnce(apple);
    render(<ProductDetail productId={apple.id} />);
    expect(screen.getByTestId('detail-loading')).toBeInTheDocument();
    await screen.findByTestId('product-detail-container');
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('A juicy fresh apple.')).toBeInTheDocument();
    expect(screen.getByTestId('detail-stock-status')).toHaveTextContent('In Stock: 20');
    expect(screen.getByTestId('add-to-cart-btn')).toBeEnabled();
    expect(screen.getByTestId('quantity-input')).toHaveValue(1);
    // Quantity updates up to stock
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: 10 } });
    expect(screen.getByTestId('quantity-input')).toHaveValue(10);
  });

  it('renders Out of Stock status and disables Add to Cart', async () => {
    api.getProductById.mockResolvedValueOnce(milk);
    render(<ProductDetail productId={milk.id} />);
    await screen.findByTestId('product-detail-container');
    expect(screen.getByTestId('detail-stock-status')).toHaveTextContent('Out of Stock');
    expect(screen.getByTestId('add-to-cart-btn')).toBeDisabled();
    expect(screen.getByTestId('quantity-input')).toBeDisabled();
  });

  it('invokes onAddToCart with selected product and quantity', async () => {
    api.getProductById.mockResolvedValueOnce(apple);
    const handleAdd = jest.fn();
    render(<ProductDetail productId={apple.id} onAddToCart={handleAdd} />);
    await screen.findByTestId('product-detail-container');
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: 2 } });
    fireEvent.click(screen.getByTestId('add-to-cart-btn'));
    expect(handleAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 1, quantity: 2 }));
  });

  it('shows error state if product fetch fails', async () => {
    api.getProductById.mockRejectedValueOnce(new Error('Product not found'));
    render(<ProductDetail productId={55} />);
    await screen.findByTestId('detail-error');
    expect(screen.getByTestId('detail-error')).toHaveTextContent('Product not found');
  });
});
