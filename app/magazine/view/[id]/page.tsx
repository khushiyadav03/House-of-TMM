"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the MagazineViewer (to be implemented)
const MagazineViewer = dynamic(() => import("@/components/MagazineViewer"), { ssr: false });

interface Magazine {
  id: number;
  title: string;
  pdf_file_path: string;
  // Add other fields as needed
}

export default function MagazineViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMagazine = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/magazines/${id}`);
        if (!res.ok) throw new Error("Failed to fetch magazine");
        const data = await res.json();
        setMagazine(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchMagazine();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg">Loading magazine...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!magazine) return <div className="min-h-screen flex items-center justify-center text-gray-500">Magazine not found.</div>;

  return (
    <MagazineViewer
      pdfUrl={magazine.pdf_file_path}
      title={magazine.title}
      // Add other props as needed
    />
  );
} 