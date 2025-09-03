import { useState, useEffect } from "react";

interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
}

interface DashboardMetrics {
  metrics: Metric[];
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/metrics");
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }

      const data: DashboardMetrics = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}
