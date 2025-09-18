import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export type MetricsSummary = {
  business_id: string;
  latest_date: string | null;
  gross_sales: number;
  net_sales: number;
  cost_of_goods: number;
  profit: number;
  settlement_delay: number;
  data_delay_notice: string;
};

export function useMetrics() {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const businessId = currentUser?.business_id;
    if (!businessId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const [summaryRes, dailyRes] = await Promise.all([
          fetch(`${API_URL}/metrics/${businessId}/summary`).then((res) => res.json()),
          fetch(`${API_URL}/metrics/${businessId}/daily?limit=30`).then((res) => res.json()),
        ]);
        setSummary(summaryRes);
        setDaily(dailyRes.items || []);
      } catch (error) {
        console.error("Failed to load metrics", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser?.business_id]);

  return { summary, daily, loading };
}
