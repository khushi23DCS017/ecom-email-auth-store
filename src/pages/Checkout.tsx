
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatINR } from '@/utils/currency';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateQRCode = () => {
    if (!formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setShowQR(true);
    toast.success("QR Code generated! Scan to pay with UPI");
    
    // Simulate payment verification after 10 seconds
    setTimeout(() => {
      setIsProcessing(true);
      setTimeout(() => {
        setPaymentVerified(true);
        setIsProcessing(false);
        
        // Create order
        const order = {
          id: `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          total: getTotalPrice(),
          status: 'pending' as const,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        };
        
        addOrder(order);
        clearCart();
        toast.success("Payment successful! Order placed.");
        
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }, 3000);
    }, 10000);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user.name} disabled />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="address">Shipping Address *</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  required 
                />
              </div>

              {!showQR && (
                <Button onClick={generateQRCode} className="w-full">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate UPI QR Code
                </Button>
              )}

              {showQR && !paymentVerified && (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <QrCode className="h-32 w-32 mx-auto text-gray-600" />
                    <p className="mt-2 text-sm text-gray-600">
                      Scan this QR code with any UPI app
                    </p>
                    <p className="text-lg font-bold">{formatINR(total)}</p>
                  </div>
                  {isProcessing && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Verifying payment...</span>
                    </div>
                  )}
                </div>
              )}

              {paymentVerified && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                  <h3 className="text-xl font-bold text-green-600">Payment Successful!</h3>
                  <p className="text-gray-600">Your order has been placed successfully.</p>
                  <p className="text-sm text-gray-500">Redirecting to your profile...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
