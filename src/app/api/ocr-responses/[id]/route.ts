import { NextResponse } from "next/server";
import { OcrService } from "../../../../lib/ocrService";
import { getAuthSession } from "../../../../lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id) || id < 1) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 },
      );
    }

    const response = await OcrService.getOcrResponseById(id, session.user.id);

    if (!response) {
      return NextResponse.json(
        { error: "OCR response not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching OCR response:", error);
    return NextResponse.json(
      { error: "Failed to fetch OCR response" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id) || id < 1) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 },
      );
    }

    const success = await OcrService.deleteOcrResponse(id, session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: "OCR response not found or could not be deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "OCR response deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting OCR response:", error);
    return NextResponse.json(
      { error: "Failed to delete OCR response" },
      { status: 500 },
    );
  }
}
