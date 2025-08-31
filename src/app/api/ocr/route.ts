import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export async function POST(req: Request) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        { error: "No image file uploaded." },
        { status: 400 }
      );
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const base64ImageData = Buffer.from(imageBuffer).toString("base64");
    const mimeType = imageFile.type;

    const prompt =
      "Extract all text from the following image. Format the output as a single block of plain text, preserving line breaks.";

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64ImageData,
        },
      },
    ]);

    const response = await result.response;
    const extractedText = response.text();

    return NextResponse.json({ extractedText }, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
