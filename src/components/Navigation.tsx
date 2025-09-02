"use client";

import { useSession } from "next-auth/react";
import AuthButton from "./AuthButton";

interface NavigationProps {
  currentView: "home" | "upload" | "dashboard";
  onNavigate: (view: "home" | "upload" | "dashboard") => void;
  onTryDemo: () => void;
}

export default function Navigation({ currentView, onNavigate, onTryDemo }: NavigationProps) {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-2xl font-bold gradient-text"
            >
              Softexedge OCR
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {session && (
              <>
                <button
                  onClick={() => onNavigate("upload")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "upload"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  Extract
                </button>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "dashboard"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  Dashboard
                </button>
              </>
            )}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
