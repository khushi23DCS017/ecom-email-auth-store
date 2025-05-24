
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatINR, convertUSDToINR } from '@/utils/currency';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, User, Heart } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const { user, logout } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    window.location.reload();
  };

  // Featured products with INR pricing
  const featuredProducts = [
    { id: 1, name: "Wireless Headphones", price: convertUSDToINR(99.99), image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    { id: 2, name: "Smart Watch", price: convertUSDToINR(199.99), image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
    { id: 3, name: "Laptop Sleeve", price: convertUSDToINR(29.99), image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12" },
    { id: 4, name: "Portable Speaker", price: convertUSDToINR(49.99), image: "https://images.unsplash.com/photo-1558537348-c0f8e733989d" },
  ];

  // Categories (mock data)
  const categories = [
    { id: 1, name: "Electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03" },
    { id: 2, name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050" },
    { id: 3, name: "Home & Garden", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858" },
    { id: 4, name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b" },
  ];

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900">ShopEasy</h1>
              </Link>
              <div className="md:hidden flex items-center gap-3">
                <button className="p-2">
                  <Search className="h-5 w-5" />
                </button>
                <Link to="/cart" className="p-2 relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            <div className="flex-1 mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button className="flex items-center gap-1 hover:text-primary">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Wishlist</span>
              </button>
              <Link to="/cart" className="flex items-center gap-1 hover:text-primary relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm">Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  <Link to="/profile" className="flex items-center gap-1 hover:text-primary">
                    <User className="h-5 w-5" />
                    <span className="text-sm">Account</span>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="ml-2">Logout</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile user info */}
          {user && (
            <div className="md:hidden mt-4 text-center">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            </div>
          )}

          {/* Category navigation */}
          <nav className="hidden md:flex items-center space-x-8 mt-4">
            <a href="#" className="text-sm font-medium hover:text-primary">All Products</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Electronics</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Fashion</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Home & Garden</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Sports</a>
            <a href="#" className="text-sm font-medium hover:text-primary">Sale</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="relative bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Summer Collection 2025</h2>
              <p className="text-xl mb-8">Shop the latest trends with up to 50% off on selected items.</p>
              <Button size="lg">Shop Now</Button>
            </div>
          </div>
          <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-black to-transparent opacity-80"></div>
        </div>

        {/* Featured Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <div key={category.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img 
                  src={`${category.image}?auto=format&fit=crop&w=500&q=60`} 
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="font-bold">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden group">
                  <div className="relative h-64">
                    <img 
                      src={`${product.image}?auto=format&fit=crop&w=500&q=60`} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-70 hover:opacity-100">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold">{formatINR(product.price)}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg">View All Products</Button>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Sign up to receive updates on new arrivals and special offers</p>
            <div className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-grow py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ShopEasy</h3>
              <p className="text-gray-600 mb-4">
                The best place to find quality products at affordable prices.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary">Home</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Shop</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Categories</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>123 Shopping Street</li>
                <li>New York, NY 10001</li>
                <li>Email: info@shopeasy.com</li>
                <li>Phone: (123) 456-7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} ShopEasy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
