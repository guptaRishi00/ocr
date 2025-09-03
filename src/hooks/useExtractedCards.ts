import { useState, useEffect } from "react";

interface ExtractedCard {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  extractedText: string;
  originalName?: string;
  mimeType?: string;
  imageSize?: number;
  processingTime?: number;
  isDemo: boolean;
  avatar: string;
  createdAt: string;
  lastContact: string;
  status: string;
}

interface CardsResponse {
  cards: ExtractedCard[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

interface UseExtractedCardsOptions {
  page?: number;
  limit?: number;
}

export function useExtractedCards(options: UseExtractedCardsOptions = {}) {
  const [cards, setCards] = useState<ExtractedCard[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page.toString());
      if (options.limit) params.append("limit", options.limit.toString());

      const response = await fetch(`/api/dashboard/cards?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch extracted cards");
      }

      const data: CardsResponse = await response.json();
      setCards(data.cards);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [options.page, options.limit]);

  return {
    cards,
    pagination,
    loading,
    error,
    refetch: fetchCards,
  };
}
