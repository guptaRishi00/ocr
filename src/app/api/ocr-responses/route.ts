import { NextResponse } from "next/server";
import { OcrService } from "../../../lib/ocrService";
import { getAuthSession } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const result = await OcrService.getOcrResponses(session.user.id, page, limit);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching OCR responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch OCR responses" },
      { status: 500 },
    );
  }
}
