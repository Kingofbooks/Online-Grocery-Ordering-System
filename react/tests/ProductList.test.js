import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';
import * as api from '../utils/api';

jest.mock('../utils/api');

const mockProducts = [
  { id: 1, name: 'Apple', price: 0.99, category: 'Fruits', stockQuantity: 5 },
  { id: 2, name: 'Milk', price: 1.49, category: 'Dairy', stockQuantity: 0 },
  { id: 3, name: 'Banana', price: 0.59, category: 'Fruits', stockQuantity: 3 },
  { id: 4, name: 'Bread', price: 2.50, category: 'Bakery', stockQuantity: 6 },
];

describe('ProductList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all products and stock statuses', async () => {
    api.getAllProducts.mockResolvedValueOnce(mockProducts);
    render(<ProductList />);
    await screen.findByTestId('product-list');
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
    // Stock status
    expect(screen.getByTestId('out-of-stock-2')).toBeInTheDocument();
    expect(screen.getByTestId('in-stock-1')).toBeInTheDocument();
  });

  it('filters products by category with select', async () => {
    api.getAllProducts.mockResolvedValueOnce(mockProducts);
    api.getProductsByCategory.mockResolvedValue([mockProducts[0], mockProducts[2]]); // Fruits
    render(<ProductList />);
    await screen.findByTestId('product-list');
    // Filter to Fruits
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Fruits' } });
    await waitFor(() => expect(screen.queryByText('Milk')).not.toBeInTheDocument());
    expect(await screen.findByText('Apple')).toBeInTheDocument();
    expect(await screen.findByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Bread')).not.toBeInTheDocument();
  });

  it('renders No products found message if filtered list is empty', async () => {
    api.getAllProducts.mockResolvedValueOnce(mockProducts);
    api.getProductsByCategory.mockResolvedValue([]);
    render(<ProductList />);
    await screen.findByTestId('product-list');
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Vegetables' } });
    await screen.findByTestId('no-products');
    expect(screen.queryByText('Milk')).not.toBeInTheDocument();
  });

  it('displays loading and error states', async () => {
    api.getAllProducts.mockImplementation(
      () => new Promise(() => {}) // stall for loading
    );
    render(<ProductList />);
    expect(screen.getByTestId('products-loading')).toBeInTheDocument();
    // Error state
    api.getAllProducts.mockRejectedValueOnce(new Error('Failed to fetch products'));
    render(<ProductList />);
    await screen.findByTestId('products-error');
    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
  });
});
