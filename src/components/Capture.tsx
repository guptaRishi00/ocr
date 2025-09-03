"use client";

import { useState } from "react";
import {
  CameraIcon,
  DocumentIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CameraCapture from "./CameraCapture";
import CameraTest from "./CameraTest";
import { useOcrMutation } from "../hooks/useOcrMutation";

export default function Capture() {
  const [showCamera, setShowCamera] = useState(false);
  const [processingResult, setProcessingResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const { processOcr, loading } = useOcrMutation();

  const handleImageCapture = async (imageFile: File) => {
    try {
      setProcessingResult(null);
      
      // Process the captured image with OCR
      const result = await processOcr(imageFile);
      
      if (result) {
        setProcessingResult({
          success: true,
          message: "Business card processed successfully!",
          data: {
            extractedText: result.extractedText,
            responseId: result.responseId,
          },
        });
        
        // Close camera after successful processing
        setTimeout(() => {
          setShowCamera(false);
        }, 2000);
      } else {
        setProcessingResult({
          success: false,
          message: "Failed to process business card",
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setProcessingResult({
        success: false,
        message: "An error occurred while processing the image",
      });
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setProcessingResult(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
          <CameraIcon className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Capture Business Cards
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Use your camera to capture business cards and automatically extract contact information
          using AI-powered OCR technology.
        </p>
      </div>

      {/* Processing Result */}
      {processingResult && (
        <div className={`mb-6 p-4 rounded-lg border ${
          processingResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            {processingResult.success ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
            )}
            <p className={processingResult.success ? 'text-green-800' : 'text-red-800'}>
              {processingResult.message}
            </p>
          </div>
          
          {processingResult.success && processingResult.data && (
            <div className="mt-3 p-3 bg-white rounded border">
              <h4 className="font-medium text-gray-900 mb-2">Extracted Information:</h4>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {processingResult.data.extractedText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Capture Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Camera Capture */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
              <CameraIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              📸 Camera Capture
            </h3>
            <p className="text-gray-600 mb-6">
              Take a photo of a business card using your laptop camera for instant processing.
            </p>
            <button
              onClick={() => setShowCamera(true)}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Start Camera
            </button>
          </div>
        </div>

        {/* File Upload (existing feature) */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
              <DocumentIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              📁 File Upload
            </h3>
            <p className="text-gray-600 mb-6">
              Upload an existing image file of a business card from your device.
            </p>
            <button
              onClick={() => {/* Navigate to upload section */}}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Choose File
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI-Powered Extraction
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-gray-900">High Accuracy</div>
            <div className="text-sm text-gray-600">99% accurate text extraction</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium text-gray-900">Lightning Fast</div>
            <div className="text-sm text-gray-600">Process cards in seconds</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-medium text-gray-900">Secure Storage</div>
            <div className="text-sm text-gray-600">Your data is safely stored</div>
          </div>
        </div>
      </div>

      {/* Debug Section - Remove this after testing */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Camera Debug Test</h2>
        <CameraTest />
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleImageCapture}
          onClose={handleCloseCamera}
          processing={loading}
        />
      )}
    </div>
  );
}
