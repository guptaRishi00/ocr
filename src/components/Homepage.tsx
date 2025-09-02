"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronRightIcon,
  DocumentTextIcon,
  CameraIcon,
  ChartBarIcon,
  SparklesIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import AuthButton from "./AuthButton";

interface HomepageProps {
  onTryDemo: () => void;
  onGetStarted: () => void;
}

export default function Homepage({ onTryDemo, onGetStarted }: HomepageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session } = useSession();

  const features = [
    {
      icon: CameraIcon,
      title: "AI-Powered OCR",
      description:
        "Extract text from any image using Google's Gemini AI with 99% accuracy",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: DocumentTextIcon,
      title: "Smart Text Processing",
      description:
        "Preserve formatting, detect languages, and extract structured data automatically",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ChartBarIcon,
      title: "Analytics Dashboard",
      description:
        "Track processing history, performance metrics, and search through all extractions",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { value: "99%", label: "Accuracy Rate" },
    { value: "<2s", label: "Processing Time" },
    { value: "50+", label: "Languages" },
    { value: "24/7", label: "Availability" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium mb-8 shadow-lg">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Powered by Google Gemini AI
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
              <span className="block">Extract Text from</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Any Image
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Transform any image into editable text instantly with our
              AI-powered OCR technology. Fast, accurate, and intelligent text
              extraction for the modern world.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {session ? (
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={onTryDemo}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <CameraIcon className="w-5 h-5 mr-2" />
                    Try Demo
                    <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex gap-3">
                    <AuthButton />
                  </div>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to extract, process, and manage text from images
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              {hoveredFeature === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Three simple steps to extract text from any image
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Image",
                desc: "Drag & drop or select any image file",
              },
              {
                step: "02",
                title: "AI Processing",
                desc: "Our AI analyzes and extracts text",
              },
              {
                step: "03",
                title: "Get Results",
                desc: "Download or copy the extracted text",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-full mb-6 shadow-lg">
                  {item.step}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
