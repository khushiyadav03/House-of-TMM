'use client';

import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function TestRazorpayFinal() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testRazorpayConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/test-razorpay-config');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Configuration test failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // ₹1.00 for testing
          currency: 'INR',
          receipt: `test_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await orderResponse.json();
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Test Payment',
          description: 'Testing Razorpay Integration',
          order_id: order.id,
          handler: function (response: any) {
            setResult({
              success: true,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
            setLoading(false);
          },
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              setError('Payment cancelled by user');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        setLoading(false);
        setError('Failed to load Razorpay script');
      };

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          🚀 Final Razorpay Test
        </h1>

        <div className="space-y-4">
          <button
            onClick={testRazorpayConfig}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : '1. Test Configuration'}
          </button>

          <button
            onClick={testPayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : '2. Test Payment (₹1.00)'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium">Error:</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-green-800 font-medium">Result:</h3>
            <pre className="text-green-600 text-xs mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-600">
          <h3 className="font-medium mb-2">Test Cards (if using test mode):</h3>
          <ul className="space-y-1">
            <li>• Success: 4111 1111 1111 1111</li>
            <li>• Failure: 4000 0000 0000 0002</li>
            <li>• CVV: Any 3 digits</li>
            <li>• Expiry: Any future date</li>
          </ul>
        </div>
      </div>
    </div>
  );
}