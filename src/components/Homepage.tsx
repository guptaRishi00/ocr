"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronRightIcon,
  DocumentTextIcon,
  CameraIcon,
  EnvelopeIcon,
  BoltIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
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
        "Instantly extract contact details from business cards with 99% accuracy",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: UserGroupIcon,
      title: "Smart Contact Management",
      description:
        "Organize and categorize your network with intelligent tagging and grouping",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: EnvelopeIcon,
      title: "Email Campaigns",
      description:
        "Send personalized emails and track engagement with your contacts",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: BoltIcon,
      title: "Lightning Fast",
      description:
        "Process hundreds of business cards in minutes, not hours",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const stats = [
    { value: "10K+", label: "Cards Processed" },
    { value: "99%", label: "OCR Accuracy" },
    { value: "500+", label: "Happy Users" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
                📱 Mobile-First CRM Platform
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                <span className="block">Transform Your</span>
                <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Business Cards
                </span>
                <span className="block">Into Connections</span>
              </h1>

              {/* Subheading */}
              <p className="max-w-xl text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
                Scan, organize, and manage your professional network with AI-powered OCR technology. Turn every business card into a valuable connection.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                {session ? (
                  <button
                    onClick={onGetStarted}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onTryDemo}
                      className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                      Get Started Free
                      <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 flex items-center justify-center"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative lg:ml-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Floating elements for visual appeal */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-10">
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  Secure Storage
                  <div className="text-xs ml-2 opacity-75">End-to-end encrypted</div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-10">
                  <BoltIcon className="w-4 h-4 mr-1" />
                  Instant Sync
                  <div className="text-xs ml-2 opacity-75">Real-time updates</div>
                </div>

                {/* Hero Image */}
                <img 
                  src="/hero-image.jpg" 
                  alt="Professional networking and business card management"
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">business network</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your contact management and networking workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your business cards into a powerful network
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Scan Business Cards",
                desc: "Simply take a photo or upload an image of any business card",
              },
              {
                step: "02", 
                title: "AI Extracts Data",
                desc: "Our advanced OCR technology automatically extracts all contact information",
              },
              {
                step: "03",
                title: "Organize & Connect",
                desc: "Manage your contacts, send emails, and grow your professional network",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-2xl rounded-full mb-6 shadow-lg">
                  {item.step}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">{item.desc}</p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by professionals worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                title: "Sales Manager",
                company: "TechCorp",
                quote: "This tool has completely transformed how I manage my business contacts. The OCR accuracy is incredible!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                title: "Marketing Director", 
                company: "Growth Labs",
                quote: "I've processed over 500 business cards in just a few weeks. The time savings are enormous.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                title: "Business Development",
                company: "StartupXYZ",
                quote: "The email campaign feature helped me reconnect with my entire network. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.title}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Preview Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your networking needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for individuals getting started",
                features: ["50 cards per month", "Basic OCR", "Email support"],
                popular: false,
              },
              {
                name: "Professional", 
                price: "$19/mo",
                description: "Ideal for active networkers",
                features: ["Unlimited cards", "Advanced OCR", "Email campaigns", "Priority support"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For teams and organizations",
                features: ["Everything in Pro", "Team collaboration", "API access", "Dedicated support"],
                popular: false,
              },
            ].map((plan, index) => (
              <div key={index} className={`bg-white p-8 rounded-2xl shadow-lg ${plan.popular ? 'ring-2 ring-purple-600 transform scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 text-center">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={session ? onGetStarted : onTryDemo}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to revolutionize your networking?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who are already managing their contacts more efficiently
          </p>
          
          <button
            onClick={session ? onGetStarted : onTryDemo}
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
          >
            Start Your Free Trial
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

// Auth modal component with full form
function AuthModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const { signIn } = await import("next-auth/react");
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          onClose();
        }
      } else {
        // Register
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Auto-login after registration
          const { signIn } = await import("next-auth/react");
          const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (result?.error) {
            setError("Registration successful, but login failed. Please try signing in.");
          } else {
            onClose();
          }
        } else {
          const data = await response.json();
          setError(data.error || "Registration failed");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              placeholder="Password"
              minLength={6}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({ name: "", email: "", password: "" });
            }}
            className="text-purple-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
