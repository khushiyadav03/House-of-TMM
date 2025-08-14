"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Lock, Eye, CreditCard, User, Phone, Mail } from 'lucide-react'
import MagazineViewer from './MagazineViewer'
import RazorpayPaymentModal from './RazorpayPaymentModal'
import { Magazine, User as UserType, UserProfile } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)



interface MagazineViewerWithAuthProps {
  magazine: Magazine
  onClose: () => void
}

export default function MagazineViewerWithAuth({ magazine, onClose }: MagazineViewerWithAuthProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    checkUserAccess()
  }, [magazine.id])

  const checkUserAccess = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        // No user logged in
        if (magazine.is_paid) {
          setShowAuth(true)
        } else {
          setHasAccess(true)
        }
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('phone')
        .eq('user_id', user.id)
        .single()
      
      setUserProfile(profile)

      if (!magazine.is_paid) {
        // Free magazine - grant access
        setHasAccess(true)
        return
      }

      // Check if user has purchased this magazine
      const { data: purchase } = await supabase
        .from('magazine_purchases')
        .select('*')
        .eq('user_email', user.email)
        .eq('magazine_id', magazine.id)
        .eq('payment_status', 'completed')
        .single()

      if (purchase) {
        setHasAccess(true)
      } else {
        setShowPayment(true)
      }
    } catch (error) {
      console.error('Error checking access:', error)
      setError('Failed to check access')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      
      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
      })

      if (error) throw error

      if (data.user) {
        // Create user profile with phone
        await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            phone: authData.phone
          })

        setUser(data.user)
        setUserProfile({ phone: authData.phone })
        setShowAuth(false)
        
        if (magazine.is_paid) {
          setShowPayment(true)
        } else {
          setHasAccess(true)
        }
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      })

      if (error) throw error

      if (data.user) {
        setUser(data.user)
        setShowAuth(false)
        checkUserAccess()
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handlePaymentSuccess = async (magazineId: number) => {
    try {
      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('magazine_purchases')
        .insert({
          magazine_id: magazine.id,
          user_email: user?.email,
          amount: magazine.price,
          payment_status: 'completed'
        })
        .select()
        .single()

      if (purchaseError) throw purchaseError

      setShowPayment(false)
      setHasAccess(true)
    } catch (error) {
      console.error('Error processing payment:', error)
      setError('Payment processing failed')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-center">Loading...</p>
        </div>
      </div>
    )
  }

  if (hasAccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative w-full h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white text-black p-2 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
          <MagazineViewer pdfUrl={magazine.pdf_file_path} title={magazine.title} />
        </div>
      </div>
    )
  }

  if (showPayment && user) {
    return (
      <RazorpayPaymentModal
        isOpen={true}
        magazine={magazine}
        onPaymentSuccess={(magazineId: number) => handlePaymentSuccess(magazineId)}
        onClose={() => setShowPayment(false)}
      />
    )
  }

  if (showAuth) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {showSignup ? 'Create Account' : 'Sign In Required'}
            </h2>
            <p className="text-gray-600 mt-2">
              {magazine.is_paid 
                ? 'This is a paid magazine. Please sign in or create an account to purchase and read.'
                : 'Please sign in to read this magazine.'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={showSignup ? handleSignup : handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                minLength={6}
              />
            </div>

            {showSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={authData.phone}
                  onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="+91 9876543210"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {showSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowSignup(!showSignup)}
              className="text-black hover:underline"
            >
              {showSignup 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Paid magazine without access
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Magazine</h2>
        <p className="text-gray-600 mb-6">
          This magazine costs ₹{magazine.price}. Purchase to read the full content.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setShowPayment(true)}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Purchase for ₹{magazine.price}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
