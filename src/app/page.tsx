"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Homepage from "../components/Homepage";
import UploadSection from "../components/UploadSection";
import Dashboard from "../components/Dashboard";
import Navigation from "../components/Navigation";
import { useOcrMutation } from "../hooks/useOcrMutation";
import { useDemoImages } from "../hooks/useDemo";

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "home" | "upload" | "dashboard"
  >("home");
  const [demoResult, setDemoResult] = useState<{
    text: string;
    responseId: number;
  } | null>(null);

  const { data: session, status } = useSession();
  const { processOcr } = useOcrMutation();
  const { getDemoAsFile, demoImages } = useDemoImages();

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleTryDemo = async () => {
    // Allow unsigned users to try demo - redirect to upload page without data
    setCurrentView("upload");
  };

  const handleGetStarted = () => {
    setCurrentView("upload");
  };



  return (
    <>
      {/* Main Content */}
      {(!session && currentView === "home") && (
        <Homepage onTryDemo={handleTryDemo} onGetStarted={handleGetStarted} />
      )}

      {/* If user is logged in, default to upload view */}
      {(session && currentView === "home") && (
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            currentView="upload" 
            onNavigate={setCurrentView} 
            onTryDemo={handleTryDemo} 
          />
          <div className="py-8">
            <UploadSection demoResult={demoResult} onClearDemo={() => setDemoResult(null)} />
          </div>
        </div>
      )}

      {currentView === "upload" && (
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            onTryDemo={handleTryDemo} 
          />
          <div className="py-8">
            <UploadSection demoResult={demoResult} onClearDemo={() => setDemoResult(null)} />
          </div>
        </div>
      )}

      {currentView === "dashboard" && (
        <div className="bg-gray-50">
          <Navigation 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            onTryDemo={handleTryDemo} 
          />
          <Dashboard />
        </div>
      )}
    </>
  );
}
