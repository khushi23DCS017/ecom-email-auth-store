
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const VerificationSent = () => {
  const location = useLocation();
  const { email } = (location.state as { email: string }) || { email: null };

  // If there's no email in state, redirect to signup
  if (!email) {
    return <Navigate to="/signup" />;
  }

  const handleResendVerification = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/resend-verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend verification email');
      }

      toast.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification link to <span className="font-medium">{email}</span>. 
          Click the link in the email to verify your account.
        </p>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleResendVerification}
          >
            Resend verification email
          </Button>
          
          <div className="text-sm text-gray-500">
            <p>Didn't receive an email? Check your spam folder or try again with a different email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSent;
