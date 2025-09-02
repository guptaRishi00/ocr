"use client";

import React, { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  PhotoIcon,
  SparklesIcon,
  ClockIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import { useOcrMutation } from "../hooks/useOcrMutation";

interface UploadSectionProps {
  demoResult?: { text: string; responseId: number } | null;
  onClearDemo?: () => void;
}

export default function UploadSection({ demoResult, onClearDemo }: UploadSectionProps) {
    const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState(demoResult?.text || "");
  const [responseId, setResponseId] = useState<number | null>(demoResult?.responseId || null);
  const [dragActive, setDragActive] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDemoResult, setIsDemoResult] = useState(!!demoResult);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { processOcr, loading, error } = useOcrMutation();

  // Update when demo result changes
  React.useEffect(() => {
    if (demoResult) {
      setExtractedText(demoResult.text);
      setResponseId(demoResult.responseId);
      setIsDemoResult(true);
      setImage(null); // Clear any selected image
    }
  }, [demoResult]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setImage(file);
    setExtractedText("");
    setResponseId(null);
    setProcessingTime(null);
    setIsDemoResult(false);
    if (onClearDemo) onClearDemo();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setExtractedText("");
    setResponseId(null);
    setProcessingTime(null);

    const startTime = Date.now();
    const result = await processOcr(image);

    if (result) {
      setExtractedText(result.extractedText);
      setResponseId(result.responseId);
      setProcessingTime(Date.now() - startTime);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white  rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-white mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                AI Text Extraction
              </h2>
              <p className="text-indigo-100">
                Upload an image and extract text instantly
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50 "
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
                    <CloudArrowUpIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {dragActive ? "Drop your image here" : "Upload an image"}
                </h3>

                <p className="text-gray-600  mb-6">
                  Drag and drop your image here, or click to browse
                </p>

                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <PhotoIcon className="w-5 h-5 mr-2" />
                  Choose File
                </button>

                <p className="text-sm text-gray-500  mt-4">
                  Supports PNG, JPG, JPEG, WebP up to 4MB
                </p>
              </div>
            </div>

            {/* Selected Image Preview */}
            {image && (
              <div className="bg-gray-50  rounded-2xl p-6 border border-gray-200 ">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {image.name}
                    </h4>
                    <p className="text-sm text-gray-600  mb-2">
                      {(image.size / 1024).toFixed(1)} KB • {image.type}
                    </p>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Ready to process
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Extract Button */}
            <button
              type="submit"
              disabled={!image || loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                !image || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Processing with AI...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Extract Text with AI
                </div>
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    Error
                  </p>
                  <p className="text-red-600 dark:text-red-300 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {extractedText && (
            <div className="mt-8 space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                                           <h3 className="font-semibold text-green-800 dark:text-green-200">
                         {isDemoResult ? 'Demo Mode - Text Extracted (Not Saved)!' : 'Text Extracted Successfully!'}
                       </h3>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 space-x-4">
                      {responseId && responseId !== -1 && <span>Response #{responseId}</span>}
                      {isDemoResult && <span>Demo Mode (Not Saved)</span>}
                         {processingTime && (
                           <span className="flex items-center">
                             <ClockIcon className="w-4 h-4 mr-1" />
                             {processingTime}ms
                           </span>
                         )}
                         {isDemoResult && onClearDemo && (
                           <button
                             onClick={() => {
                               onClearDemo();
                               setExtractedText("");
                               setResponseId(null);
                               setIsDemoResult(false);
                             }}
                             className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                           >
                             Clear Demo
                           </button>
                         )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-white  text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>

              {/* Extracted Text */}
              <div className="bg-gray-50  rounded-2xl p-6 border border-gray-200 ">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Extracted Text
                </h4>
                <div className="bg-white  rounded-xl p-4 max-h-96 overflow-auto border border-gray-200 dark:border-gray-600">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{extractedText}</ReactMarkdown>
                  </div>
                </div>

                {/* Demo Notice */}
                {isDemoResult && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                         <p className="text-blue-800 dark:text-blue-200 text-sm">
                       <strong>Demo Mode:</strong> Your extraction was successful but not saved. Sign in to save your OCR results and access your personal dashboard.
                     </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
