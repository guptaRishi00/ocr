"use client";

import React, { useState, useRef } from "react";

export default function CameraTest() {
  const [status, setStatus] = useState("Click to test camera");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const testCamera = async () => {
    try {
      setStatus("Checking camera support...");
      
      // Check if camera is supported
      if (!navigator.mediaDevices) {
        setStatus("❌ navigator.mediaDevices not supported");
        return;
      }

      if (!navigator.mediaDevices.getUserMedia) {
        setStatus("❌ getUserMedia not supported");
        return;
      }

      setStatus("✅ Camera API supported, requesting permission...");

      // Check available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log("Available video devices:", videoDevices);

      if (videoDevices.length === 0) {
        setStatus("❌ No camera devices found");
        return;
      }

      setStatus(`✅ Found ${videoDevices.length} camera(s), requesting access...`);

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      console.log("Stream obtained:", mediaStream);
      setStatus("✅ Camera access granted!");

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStatus("✅ Video preview should be visible now");
      }

      setStream(mediaStream);

    } catch (error) {
      console.error("Camera test error:", error);
      if (error instanceof Error) {
        setStatus(`❌ Error: ${error.name} - ${error.message}`);
      } else {
        setStatus("❌ Unknown camera error");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setStatus("Camera stopped");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Camera Test</h2>
      
      <div className="mb-4">
        <p className="text-gray-700 mb-2">Status:</p>
        <p className="font-mono text-sm bg-gray-100 p-2 rounded">{status}</p>
      </div>

      <div className="mb-4 space-x-2">
        <button
          onClick={testCamera}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Camera
        </button>
        
        <button
          onClick={stopCamera}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          disabled={!stream}
        >
          Stop Camera
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>• Make sure you're using HTTPS or localhost</p>
        <p>• Check browser console for detailed logs</p>
        <p>• Allow camera permission when prompted</p>
      </div>
    </div>
  );
}
