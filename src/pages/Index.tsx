
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('authToken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My App</h1>
          <div>
            {isLoggedIn ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <div className="space-x-4">
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
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Welcome to Your Application</h2>
          <p className="text-xl text-gray-600 mb-8">
            A secure platform with email-based authentication.
          </p>
          
          {isLoggedIn ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-800 mb-2">You're logged in!</h3>
              <p className="text-green-700">
                You have successfully authenticated with your email.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Get started by signing up or logging in with your email address.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg">Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Login</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} My Application. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
