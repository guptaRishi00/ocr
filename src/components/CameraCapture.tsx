"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  CameraIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface CameraCaptureProps {
  onCapture: (imageFile: File) => void;
  onClose: () => void;
  processing?: boolean;
}

export default function CameraCapture({ onCapture, onClose, processing = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      console.log("Requesting camera access...");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser");
      }

      let mediaStream;
      
      // Try with detailed constraints first
      try {
        const constraints = {
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            facingMode: "user", // Use front camera for laptops
          },
          audio: false
        };

        console.log("Trying detailed camera constraints:", constraints);
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (detailedError) {
        console.log("Detailed constraints failed, trying basic constraints:", detailedError);
        
        // Fallback to basic constraints
        try {
          const basicConstraints = {
            video: true,
            audio: false
          };
          
          console.log("Trying basic camera constraints:", basicConstraints);
          mediaStream = await navigator.mediaDevices.getUserMedia(basicConstraints);
        } catch (basicError) {
          console.error("Both detailed and basic constraints failed:", basicError);
          throw basicError;
        }
      }
      
      console.log("Camera stream obtained:", mediaStream);

      console.log("Video element will be handled by useEffect");

      setStream(mediaStream);
      // Set camera started immediately when we have the stream
      setCameraStarted(true);
      console.log("Camera started state set to true");
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Failed to access camera. ";
      
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage += "Camera permission was denied. Please allow camera access and try again.";
        } else if (err.name === "NotFoundError") {
          errorMessage += "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage += "Camera is not supported in this browser.";
        } else {
          errorMessage += err.message;
        }
      }
      
      setError(errorMessage);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraStarted(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageDataUrl);

    // Stop camera after capture
    stopCamera();
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmCapture = useCallback(() => {
    if (!capturedImage) return;

    // Convert data URL to File object
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `business-card-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
      })
      .catch(err => {
        console.error("Error creating file from captured image:", err);
        setError("Failed to process captured image.");
      });
  }, [capturedImage, onCapture]);

  // Handle stream assignment when camera starts
  React.useEffect(() => {
    if (stream && videoRef.current && cameraStarted) {
      console.log("useEffect: Assigning stream to video element");
      videoRef.current.srcObject = stream;
      console.log("useEffect: srcObject assigned, readyState:", videoRef.current.readyState);
      
      // Add event listeners
      const video = videoRef.current;
      
      const onLoadedMetadata = () => {
        console.log("useEffect: Video metadata loaded, dimensions:", video.videoWidth, "x", video.videoHeight);
        video.play().then(() => {
          console.log("useEffect: Video playback started successfully");
        }).catch(playErr => {
          console.error("useEffect: Video play error:", playErr);
          setError("Failed to start video playback: " + playErr.message);
        });
      };

      const onCanPlay = () => {
        console.log("useEffect: Video can start playing");
      };

      const onPlaying = () => {
        console.log("useEffect: Video is playing");
      };

      const onError = (e: Event) => {
        console.error("useEffect: Video element error:", e);
        setError("Video playback error");
      };

      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('playing', onPlaying);
      video.addEventListener('error', onError);

      // Cleanup function
      return () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('error', onError);
      };
    }
  }, [stream, cameraStarted]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📸 Capture Business Card
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={processing}
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Camera View */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
          {!cameraStarted && !capturedImage && (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Start Camera
                </button>
                <p className="text-gray-600 text-sm mt-2">
                  Click to access your camera and capture a business card
                </p>
              </div>
            </div>
          )}

          {cameraStarted && !capturedImage && (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-96 object-cover bg-gray-900"
                autoPlay
                playsInline
                muted
                controls={false}
                style={{ transform: 'scaleX(-1)' }} // Mirror the video for selfie mode
              />
              
              {/* Camera overlay guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white border-dashed rounded-lg w-80 h-48 flex items-center justify-center">
                  <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
                    Position business card here
                  </span>
                </div>
              </div>

              {/* Capture button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <CameraIcon className="w-8 h-8 text-gray-800" />
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured business card"
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Buttons */}
        {capturedImage && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={retakePhoto}
              disabled={processing}
              className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Retake
            </button>
            
            <button
              onClick={confirmCapture}
              disabled={processing}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Process Card
                </>
              )}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📋 Tips for best results:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Ensure good lighting on the business card</li>
            <li>• Keep the card flat and avoid shadows</li>
            <li>• Position the entire card within the guide frame</li>
            <li>• Make sure text is clear and readable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
