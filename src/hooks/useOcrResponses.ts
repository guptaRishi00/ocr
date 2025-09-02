import { useState, useEffect, useCallback } from "react";
import { OcrResponseWithMetadata } from "../lib/ocrService";

export interface UseOcrResponsesResult {
  responses: OcrResponseWithMetadata[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  currentPage: number;
  refetch: () => Promise<void>;
  searchResponses: (searchTerm: string) => Promise<void>;
  clearSearch: () => Promise<void>;
}

export const useOcrResponses = (
  initialPage: number = 1,
  limit: number = 10,
): UseOcrResponsesResult => {
  const [responses, setResponses] = useState<OcrResponseWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchResponses = useCallback(
    async (page: number = currentPage, search?: string) => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = search
          ? `/api/ocr-responses/search?q=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
          : `/api/ocr-responses?page=${page}&limit=${limit}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch OCR responses");
        }

        const data = await response.json();

        setResponses(data.responses);
        setTotal(data.total);
        setPages(data.pages);
        setCurrentPage(data.currentPage);
      } catch (err: any) {
        console.error("Error fetching OCR responses:", err);
        setError(err.message || "Failed to fetch OCR responses");
        setResponses([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit],
  );

  const refetch = useCallback(async () => {
    await fetchResponses(currentPage, searchTerm);
  }, [fetchResponses, currentPage, searchTerm]);

  const searchResponses = useCallback(
    async (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1);
      await fetchResponses(1, search);
    },
    [fetchResponses],
  );

  const clearSearch = useCallback(async () => {
    setSearchTerm("");
    setCurrentPage(1);
    await fetchResponses(1);
  }, [fetchResponses]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  return {
    responses,
    loading,
    error,
    total,
    pages,
    currentPage,
    refetch,
    searchResponses,
    clearSearch,
  };
};
