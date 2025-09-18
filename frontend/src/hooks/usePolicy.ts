import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type PolicyRecommendation = {
  policy_id: string;
  name: string;
  group_name: string;
  limit_amount: string;
  interest_rate: string;
  term: string;
  eligibility: string;
  documents: string;
  application_method: string;
  rationale: string;
  priority: number;
};

type PolicyWorkflow = {
  policy_id: string;
  status: string;
  status_color: string;
  notes?: string;
  updated_at?: string;
  product: Record<string, any>;
};

export function usePolicyData() {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>([]);
  const [workflows, setWorkflows] = useState<PolicyWorkflow[]>([]);

  useEffect(() => {
    const businessId = currentUser?.business_id;
    if (!businessId) return;
    const load = async () => {
      try {
        const [recRes, wfRes] = await Promise.all([
          fetch(`${API_URL}/policy/${businessId}/recommendations`),
          fetch(`${API_URL}/policy/${businessId}/applications`),
        ]);

        if (recRes.ok) {
          const data = await recRes.json();
          setRecommendations(data.recommendations || []);
        } else {
          console.warn("금융 추천 정보를 불러오지 못했습니다.", recRes.statusText);
          setRecommendations([]);
        }

        if (wfRes.ok) {
          const data = await wfRes.json();
          setWorkflows(data.workflows || []);
        } else {
          console.warn("금융 진행 현황 정보를 불러오지 못했습니다.", wfRes.statusText);
          setWorkflows([]);
        }
      } catch (error) {
        console.error("Failed to load policy data", error);
        setRecommendations([]);
        setWorkflows([]);
      }
    };
    load();
  }, [currentUser?.business_id]);

  return { recommendations, workflows };
}
