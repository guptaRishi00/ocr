import { prisma } from "./database";
import { OcrResponse } from "@prisma/client";

export interface CreateOcrResponseData {
  extractedText: string;
  userId?: string;
  originalName?: string;
  imageSize?: number;
  mimeType?: string;
  processingTime?: number;
  isDemo?: boolean;
}

export interface OcrResponseWithMetadata extends OcrResponse {
  formattedDate: string;
  textPreview: string;
}

export class OcrService {
  /**
   * Save an OCR response to the database
   */
  static async createOcrResponse(
    data: CreateOcrResponseData,
  ): Promise<OcrResponse> {
    try {
      return await prisma.ocrResponse.create({
        data: {
          extractedText: data.extractedText,
          userId: data.userId,
          originalName: data.originalName,
          imageSize: data.imageSize,
          mimeType: data.mimeType,
          processingTime: data.processingTime,
          isDemo: data.isDemo || false,
        },
      });
    } catch (error) {
      console.error("Error creating OCR response:", error);
      throw new Error("Failed to save OCR response to database");
    }
  }

  /**
   * Get all OCR responses with pagination for a specific user
   */
  static async getOcrResponses(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    responses: OcrResponseWithMetadata[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [responses, total] = await Promise.all([
        prisma.ocrResponse.findMany({
          where: {
            userId: userId,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.ocrResponse.count({
          where: {
            userId: userId,
          },
        }),
      ]);

      const responsesWithMetadata: OcrResponseWithMetadata[] = responses.map(
        (response) => ({
          ...response,
          formattedDate: new Date(response.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
          textPreview:
            response.extractedText.length > 100
              ? response.extractedText.substring(0, 100) + "..."
              : response.extractedText,
        }),
      );

      return {
        responses: responsesWithMetadata,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching OCR responses:", error);
      throw new Error("Failed to fetch OCR responses from database");
    }
  }

  /**
   * Get a single OCR response by ID for a specific user
   */
  static async getOcrResponseById(id: number, userId: string): Promise<OcrResponse | null> {
    try {
      return await prisma.ocrResponse.findFirst({
        where: { 
          id,
          userId: userId,
        },
      });
    } catch (error) {
      console.error("Error fetching OCR response by ID:", error);
      throw new Error("Failed to fetch OCR response");
    }
  }

  /**
   * Delete an OCR response by ID for a specific user
   */
  static async deleteOcrResponse(id: number, userId: string): Promise<boolean> {
    try {
      await prisma.ocrResponse.deleteMany({
        where: { 
          id,
          userId: userId,
        },
      });
      return true;
    } catch (error) {
      console.error("Error deleting OCR response:", error);
      return false;
    }
  }

  /**
   * Search OCR responses by text content for a specific user
   */
  static async searchOcrResponses(
    userId: string,
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    responses: OcrResponseWithMetadata[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [responses, total] = await Promise.all([
        prisma.ocrResponse.findMany({
          where: {
            userId: userId,
            extractedText: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.ocrResponse.count({
          where: {
            userId: userId,
            extractedText: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const responsesWithMetadata: OcrResponseWithMetadata[] = responses.map(
        (response) => ({
          ...response,
          formattedDate: new Date(response.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
          textPreview:
            response.extractedText.length > 100
              ? response.extractedText.substring(0, 100) + "..."
              : response.extractedText,
        }),
      );

      return {
        responses: responsesWithMetadata,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error searching OCR responses:", error);
      throw new Error("Failed to search OCR responses");
    }
  }

  /**
   * Get statistics about OCR responses for a specific user
   */
  static async getOcrStats(userId: string): Promise<{
    totalResponses: number;
    totalTextLength: number;
    averageProcessingTime: number | null;
    mostCommonMimeType: string | null;
  }> {
    try {
      const stats = await prisma.ocrResponse.aggregate({
        where: {
          userId: userId,
        },
        _count: {
          id: true,
        },
        _sum: {
          imageSize: true,
          processingTime: true,
        },
        _avg: {
          processingTime: true,
        },
      });

      // Get total text length (Prisma doesn't support aggregating text length directly)
      const responses = await prisma.ocrResponse.findMany({
        where: {
          userId: userId,
        },
        select: {
          extractedText: true,
          mimeType: true,
        },
      });

      const totalTextLength = responses.reduce(
        (sum, response) => sum + response.extractedText.length,
        0,
      );

      // Find most common MIME type
      const mimeTypeCounts = responses.reduce(
        (acc, response) => {
          if (response.mimeType) {
            acc[response.mimeType] = (acc[response.mimeType] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      const mostCommonMimeType = Object.entries(mimeTypeCounts).reduce(
        (max, [mimeType, count]) =>
          count > max.count ? { mimeType, count } : max,
        { mimeType: null as string | null, count: 0 },
      ).mimeType;

      return {
        totalResponses: stats._count.id,
        totalTextLength,
        averageProcessingTime: stats._avg.processingTime,
        mostCommonMimeType,
      };
    } catch (error) {
      console.error("Error fetching OCR stats:", error);
      throw new Error("Failed to fetch OCR statistics");
    }
  }
}
