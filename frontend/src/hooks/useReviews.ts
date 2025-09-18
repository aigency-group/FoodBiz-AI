import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type ReviewSummary = {
  business_id: string;
  review_count: number;
  average_rating: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
};

type Review = {
  rating: number;
  content: string;
  source: string;
  reviewed_at: string;
};

export function useReviews(explicitBusinessId?: string) {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const businessId = explicitBusinessId || currentUser?.business_id;
    if (!businessId) return;
    const fetchData = async () => {
      try {
        const [summaryRes, recentRes] = await Promise.all([
          fetch(`${API_URL}/reviews/${businessId}/summary`).then((res) => res.json()),
          fetch(`${API_URL}/reviews/${businessId}/recent?limit=5`).then((res) => res.json()),
        ]);
        setSummary(summaryRes);
        setReviews(recentRes.items || []);
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    };
    fetchData();
  }, [explicitBusinessId, currentUser?.business_id]);

  return { summary, reviews };
}
