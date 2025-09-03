"use client";

import { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  CameraIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useExtractedCards } from "../hooks/useExtractedCards";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import Capture from "./Capture";
import ContactManagement from "./ContactManagement";
import ContactDetailModal from "./ContactDetailModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  // Fetch real data from API
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const { 
    cards: recentCards, 
    loading: cardsLoading, 
    error: cardsError 
  } = useExtractedCards({ limit: 20 }); // Get recent extracted cards for dashboard

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "contacts", label: "Contacts", icon: UsersIcon },
    { id: "capture", label: "Capture", icon: CameraIcon },
    { id: "campaigns", label: "Campaigns", icon: EnvelopeIcon },
    { id: "settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  // Map metrics to include icons
  const metricsWithIcons = metrics.map((metric, index) => ({
    ...metric,
    icon: [UsersIcon, CameraIcon, EnvelopeIcon, ArrowTrendingUpIcon][index] || UsersIcon,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-purple-600">BusinessConnect</h1>
        </div>
        
        <nav className="px-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-600">Welcome back!</h2>
              <p className="text-gray-600">Manage your business connections efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Contact
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Show different components based on active tab */}
          {activeTab === "capture" ? (
            <Capture />
          ) : activeTab === "contacts" ? (
            <ContactManagement onBack={() => setActiveTab("dashboard")} />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Content - Metrics & Contacts */}
              <div className="xl:col-span-3 space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))
                ) : metricsError ? (
                  <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-6">
                    <p className="text-red-800">Error loading metrics: {metricsError}</p>
                  </div>
                ) : (
                  metricsWithIcons.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <metric.icon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
                      <div className={`text-xs font-medium ${
                        metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metric.change}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Recent Cards */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Cards</h3>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      View All
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Your latest extracted business cards</p>
                </div>
                
                <div className="overflow-x-auto">
                  {cardsLoading ? (
                    <div className="p-6">
                      <div className="animate-pulse space-y-4">
                        {Array(3).fill(0).map((_, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : cardsError ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl m-6">
                      <p className="text-red-800">Error loading cards: {cardsError}</p>
                    </div>
                  ) : recentCards.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <CameraIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No cards scanned yet</h3>
                      <p>Start by uploading and scanning some business cards.</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Extracted
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Info
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentCards.map((card) => (
                          <tr 
                            key={card.id} 
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleCardClick(card)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                  {card.avatar}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {card.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {card.title || "No title"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {card.company || "No company"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {card.email || "No email"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {card.lastContact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-400 text-xs">Click to view</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Right Content - Analytics */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📈 Analytics</h3>
                </div>
                <p className="text-gray-600 text-sm mb-6">Contact growth overview</p>
                
                {/* Mock Chart Area */}
                <div className="space-y-6">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-purple-600 font-medium">Charts & Analytics</p>
                      <p className="text-gray-500 text-sm">Coming Soon</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600 mb-1">This Month</div>
                    <div className="text-2xl font-bold text-green-600">+24.5%</div>
                    <div className="text-gray-500 text-sm">Growth Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Contact Detail Modal */}
      <ContactDetailModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
