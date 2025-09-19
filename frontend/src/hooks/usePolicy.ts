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

export type PolicyProduct = {
  id: string;
  name: string;
  group_name: string;
  limit_amount?: string;
  interest_rate?: string;
  term?: string;
  eligibility?: string;
  application_method?: string;
  documents?: string;
  features: string[];
};

export type PolicyProductGroup = {
  group_name: string;
  products: PolicyProduct[];
};

export function usePolicyData() {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>([]);
  const [workflows, setWorkflows] = useState<PolicyWorkflow[]>([]);
  const [productGroups, setProductGroups] = useState<PolicyProductGroup[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

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

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await fetch(`${API_URL}/policy/products`);
        if (response.ok) {
          const data = await response.json();
          setProductGroups(data.groups || []);
        } else {
          console.warn('정책 상품 정보를 불러오지 못했습니다.', response.statusText);
          setProductGroups([]);
        }
      } catch (error) {
        console.error('Failed to load policy products', error);
        setProductGroups([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { recommendations, workflows, productGroups, productsLoading };
}
