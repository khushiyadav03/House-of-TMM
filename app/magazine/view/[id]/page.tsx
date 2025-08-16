"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "../../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ShoppingCart } from "lucide-react";

// Dynamically import the MagazineViewer (to be implemented)
const MagazineViewer = dynamic(() => import("@/components/MagazineViewer"), { ssr: false });

interface Magazine {
  id: number;
  title: string;
  pdf_file_path: string;
  is_paid: boolean;
  price: number;
  cover_image_url: string;
  issue_date: string;
}

export default function MagazineViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!id) return;
    checkAccessAndFetchMagazine();
  }, [id]);

  const checkAccessAndFetchMagazine = async () => {
    try {
      setLoading(true);
      setCheckingAccess(true);

      // Fetch magazine details first
      const res = await fetch(`/api/magazines/${id}`);
      if (!res.ok) throw new Error("Failed to fetch magazine");
      const magazineData = await res.json();
      setMagazine(magazineData);

      // If magazine is free, allow access
      if (!magazineData.is_paid) {
        setCheckingAccess(false);
        setLoading(false);
        return;
      }

      // For paid magazines, check authentication
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        // Redirect to login for paid magazines
        router.push(`/auth/login?redirect=/magazine/view/${id}`);
        return;
      }

      // Check if user has purchased this magazine
      const purchaseResponse = await fetch(`/api/magazines/${id}/check-purchase`);
      if (purchaseResponse.ok) {
        const purchaseData = await purchaseResponse.json();
        setHasPurchased(purchaseData.purchased);
        
        if (!purchaseData.purchased) {
          // User hasn't purchased, redirect to purchase page
          router.push(`/magazine/purchase/${id}`);
          return;
        }
      } else {
        // If can't check purchase status, redirect to purchase page
        router.push(`/magazine/purchase/${id}`);
        return;
      }

    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
      setCheckingAccess(false);
    }
  };

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            {checkingAccess ? "Checking access permissions..." : "Loading magazine..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push('/magazine')}>
              Back to Magazines
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 pt-6">
            <p className="text-gray-600">Magazine not found.</p>
            <Button onClick={() => router.push('/magazine')}>
              Back to Magazines
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If it's a paid magazine and user hasn't purchased, show access denied
  if (magazine.is_paid && !hasPurchased) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <CardTitle>Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              This is a premium magazine. Please purchase to access.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => router.push(`/magazine/purchase/${id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase for ₹{magazine.price.toFixed(2)}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/magazine')}
                className="w-full"
              >
                Back to Magazines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, show the magazine
  return (
    <MagazineViewer
      pdfUrl={magazine.pdf_file_path}
      title={magazine.title}
      // Add other props as needed
    />
  );
} 