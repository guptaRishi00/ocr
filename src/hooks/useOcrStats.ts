import { useState, useEffect, useCallback } from "react";

export interface OcrStats {
  totalResponses: number;
  totalTextLength: number;
  averageProcessingTime: number | null;
  mostCommonMimeType: string | null;
}

export interface UseOcrStatsResult {
  stats: OcrStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOcrStats = (): UseOcrStatsResult => {
  const [stats, setStats] = useState<OcrStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/ocr-responses/stats");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch OCR statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching OCR statistics:", err);
      setError(err.message || "Failed to fetch OCR statistics");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
