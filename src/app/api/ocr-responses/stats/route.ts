import { NextResponse } from "next/server";
import { OcrService } from "../../../../lib/ocrService";
import { getAuthSession } from "../../../../lib/auth";

export async function GET() {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const stats = await OcrService.getOcrStats(session.user.id);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching OCR statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch OCR statistics" },
      { status: 500 },
    );
  }
}
