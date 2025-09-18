import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type Review = {
  rating: number;
  content: string;
  source: string;
  reviewed_at: string;
};

type SourceSlice = {
  source: string;
  count: number;
  ratio: number;
};

export function useReviewDetail(explicitBusinessId?: string) {
  const { currentUser } = useAuth();
  const businessId = explicitBusinessId || currentUser?.business_id;
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [sources, setSources] = useState<SourceSlice[]>([]);

  useEffect(() => {
    if (!businessId) return;
    const load = async () => {
      try {
        const [allRes, sourceRes] = await Promise.all([
          fetch(`${API_URL}/reviews/${businessId}/all?limit=100`).then((res) => res.json()),
          fetch(`${API_URL}/reviews/${businessId}/sources`).then((res) => res.json()),
        ]);
        setAllReviews(allRes.items || []);
        setSources(sourceRes.sources || []);
      } catch (error) {
        console.error("Failed to load review detail", error);
      }
    };
    load();
  }, [businessId]);

  const keywords = useMemo(() => {
    const positive: string[] = [];
    const negative: string[] = [];
    const tokenizer = (text: string) =>
      text
        .replace(/[^\uAC00-\uD7A30-9a-zA-Z\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 2 && w.length <= 6);
    for (const review of allReviews) {
      const words = tokenizer(review.content || "");
      const target = review.rating >= 4 ? positive : review.rating <= 2 ? negative : null;
      if (target) {
        target.push(...words);
      }
    }
    const frequency = (list: string[]) => {
      const map = new Map<string, number>();
      for (const word of list) {
        map.set(word, (map.get(word) || 0) + 1);
      }
      return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([term]) => term);
    };
    return {
      positive: frequency(positive),
      negative: frequency(negative),
    };
  }, [allReviews]);

  return { businessId, allReviews, sources, keywords };
}
