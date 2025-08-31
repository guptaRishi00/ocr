"use client";

import { useState } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setExtractedText("");
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedText("");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setExtractedText(data.extractedText);

      console.log("Extracted Data: ", data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-800 dark:text-gray-50">
          Gemini OCR App
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Upload an image to extract text from it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <span className="sr-only">Choose file</span>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
              accept="image/*"
            />
          </label>
          {image && (
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Selected Image:
              </h3>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="mt-2 rounded-lg max-w-full h-auto mx-auto border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Extract Text"
            )}
          </button>
        </form>

        {error && (
          <div
            className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {extractedText && (
          <div className="mt-8 text-left">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-50">
              Extracted Text:
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg whitespace-pre-wrap text-gray-800 dark:text-gray-200 overflow-auto max-h-96 border border-gray-200 dark:border-gray-700">
              <ReactMarkdown>{extractedText}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
