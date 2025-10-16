import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { CartProvider } from '@/context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import { Product } from '@/lib/mockData';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  category: 'Test Category',
  image: '/test-image.jpg',
  rating: 4.5,
  reviews: 10,
  featured: true,
};

// Mock addToCart function
const addToCart = vi.fn();

// Custom render function to provide context
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider value={{ addToCart, cart: [], removeFromCart: () => {}, updateQuantity: () => {}, totalItems: 0, totalPrice: 0 }}>
        {ui}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  // Note: A more advanced test would check if addToCart is called.
  // This is a starting point.
});
