"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PaymentDiagnostic from '@/components/PaymentDiagnostic'
import PaymentTest from '@/components/PaymentTest'
import SimplePaymentTest from '@/components/SimplePaymentTest'
import PaymentDebugger from '@/components/PaymentDebugger'
import EnvironmentChecker from '@/components/EnvironmentChecker'
import QuickFix from '@/components/QuickFix'
import RazorpayPaymentModal from '@/components/RazorpayPaymentModal'
import GuestCheckoutModal from '@/components/GuestCheckoutModal'

// Mock magazine data for testing
const mockMagazine = {
    id: 1,
    title: "TMM India Test Magazine",
    issue_date: "2024-01-01",
    cover_image_url: "",
    pdf_url: "",
    pdf_file_path: "",
    price: 99.00,
    is_paid: true
}

export default function TestRazorpayPage() {
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showGuestModal, setShowGuestModal] = useState(false)

    const handlePaymentSuccess = (magazineId: number) => {
        console.log('Payment successful for magazine:', magazineId)
        setShowPaymentModal(false)
        setShowGuestModal(false)
        alert('Payment successful! Check console for details.')
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Razorpay Payment Integration Test</h1>
                    <p className="text-gray-600">
                        Test all aspects of the Razorpay payment integration including diagnostics,
                        payment flows, and error handling.
                    </p>
                </div>

                <Tabs defaultValue="quickfix" className="w-full">
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="quickfix">Quick Fix</TabsTrigger>
                        <TabsTrigger value="debugger">Debugger</TabsTrigger>
                        <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
                        <TabsTrigger value="payment-modal">Payment Modal</TabsTrigger>
                        <TabsTrigger value="guest-checkout">Guest Checkout</TabsTrigger>
                        <TabsTrigger value="api-tests">API Tests</TabsTrigger>
                        <TabsTrigger value="simple-test">Simple Test</TabsTrigger>
                    </TabsList>

                    <TabsContent value="quickfix" className="space-y-4">
                        <QuickFix />
                    </TabsContent>

                    <TabsContent value="debugger" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment System Debugger</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Quick debug tool to identify payment system issues and configuration problems.
                                </p>
                                <PaymentDebugger />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="diagnostics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment System Diagnostics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Run comprehensive diagnostics to verify all payment system components
                                    are working correctly.
                                </p>
                                <PaymentDiagnostic />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payment-modal" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Standard Payment Modal Test</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600">
                                    Test the standard payment modal for registered users.
                                </p>

                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold mb-2">Test Magazine</h3>
                                    <p className="text-sm text-gray-600 mb-2">{mockMagazine.title}</p>
                                    <p className="text-lg font-bold">₹{mockMagazine.price.toFixed(2)}</p>
                                </div>

                                <Button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="w-full"
                                >
                                    Test Payment Modal
                                </Button>

                                <div className="text-xs text-gray-500 space-y-1">
                                    <p><strong>Test Card:</strong> 4111 1111 1111 1111</p>
                                    <p><strong>Expiry:</strong> Any future date</p>
                                    <p><strong>CVV:</strong> Any 3 digits</p>
                                    <p><strong>OTP:</strong> 123456</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="guest-checkout" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Checkout Test</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600">
                                    Test the guest checkout flow that creates a user account after successful payment.
                                </p>

                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold mb-2">Test Magazine</h3>
                                    <p className="text-sm text-gray-600 mb-2">{mockMagazine.title}</p>
                                    <p className="text-lg font-bold">₹{mockMagazine.price.toFixed(2)}</p>
                                </div>

                                <Button
                                    onClick={() => setShowGuestModal(true)}
                                    className="w-full"
                                >
                                    Test Guest Checkout
                                </Button>

                                <div className="text-xs text-gray-500 space-y-1">
                                    <p><strong>Note:</strong> This will create a test user account</p>
                                    <p><strong>Test Card:</strong> 4111 1111 1111 1111</p>
                                    <p><strong>Expiry:</strong> Any future date</p>
                                    <p><strong>CVV:</strong> Any 3 digits</p>
                                    <p><strong>OTP:</strong> 123456</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="api-tests" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>API Endpoint Tests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Test individual API endpoints with mock data.
                                </p>
                                <PaymentTest />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="simple-test" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Simple Payment Flow Test</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Basic test of the payment flow without UI components.
                                </p>
                                <SimplePaymentTest />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Payment Modals */}
                <RazorpayPaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    magazine={mockMagazine}
                    onPaymentSuccess={handlePaymentSuccess}
                />

                <GuestCheckoutModal
                    isOpen={showGuestModal}
                    onClose={() => setShowGuestModal(false)}
                    magazine={mockMagazine}
                    onPaymentSuccess={handlePaymentSuccess}
                />

                {/* Environment Checker */}
                <EnvironmentChecker />
            </div>
        </div>
    )
}