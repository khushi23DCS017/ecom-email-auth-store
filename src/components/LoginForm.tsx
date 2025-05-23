
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // In a real application, this would connect to your Django backend
      // Since we don't have a working backend connection, we'll simulate success
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is valid format
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Simulate successful login
      console.log('Login attempt:', { email });
      
      toast.success("Login successful!");
      
      // After successful login, redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
      setMessage((error as Error).message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Log in to your account</h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !email}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a></p>
        <p className="mt-2">
          <a href="/forgot-password" className="text-primary hover:underline">Forgot your password?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
