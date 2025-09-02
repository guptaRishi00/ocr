import { useState, useCallback } from "react";

export interface OcrMutationResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  deleteResponse: (id: number) => Promise<boolean>;
  processOcr: (
    imageFile: File,
  ) => Promise<{ extractedText: string; responseId: number } | null>;
}

export const useOcrMutation = (): OcrMutationResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteResponse = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`/api/ocr-responses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete OCR response");
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("Error deleting OCR response:", err);
      setError(err.message || "Failed to delete OCR response");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const processOcr = useCallback(
    async (
      imageFile: File,
    ): Promise<{ extractedText: string; responseId: number } | null> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to process OCR");
        }

        const data = await response.json();
        setSuccess(true);

        return {
          extractedText: data.extractedText,
          responseId: data.responseId,
        };
      } catch (err: any) {
        console.error("Error processing OCR:", err);
        setError(err.message || "Failed to process OCR");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    success,
    deleteResponse,
    processOcr,
  };
};
