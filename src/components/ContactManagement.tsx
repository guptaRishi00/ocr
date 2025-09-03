"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useExtractedCards } from "../hooks/useExtractedCards";

interface ContactManagementProps {
  onBack?: () => void;
}

export default function ContactManagement({ onBack }: ContactManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const { cards, loading, error, pagination } = useExtractedCards({ 
    limit: 20 
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Parse address from extracted text (simple implementation)
  const parseAddress = (extractedText: string): string => {
    const lines = extractedText.split('\n').filter(line => line.trim());
    
    // Look for lines that might contain address information
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Check if line contains city/state patterns or common address keywords
      if (
        /\b(street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr)\b/i.test(trimmedLine) ||
        /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(trimmedLine) || // City, STATE pattern
        /\d{5}(-\d{4})?/.test(trimmedLine) // ZIP code pattern
      ) {
        return trimmedLine;
      }
    }
    
    return "";
  };

  // Extract phone number from text
  const parsePhone = (text: string): string => {
    const phoneRegex = /[\+]?[\d\s\-\(\)\.]{10,}/g;
    const matches = text.match(phoneRegex);
    if (matches) {
      // Return the first phone number found
      return matches[0].trim();
    }
    return "";
  };

  const handleEmailClick = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const handlePhoneClick = (phone: string) => {
    if (phone) {
      // Remove non-numeric characters for tel: link
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      window.open(`tel:${cleanPhone}`, '_blank');
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = searchTerm === "" || 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.company && card.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.title && card.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Use actual card status if available, otherwise default to "new"
    const cardStatus = card.status || "new";
    const matchesFilter = selectedFilter === "all" || cardStatus === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800">Error loading contacts: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600">{filteredCards.length} contacts found</p>
          </div>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === "all" 
                ? "bg-purple-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="new">New</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600">Try adjusting your search or capture some business cards to get started.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredCards.map((card) => {
            const status = card.status || "new";
            const address = parseAddress(card.extractedText);
            const phoneNumber = card.phone || parsePhone(card.extractedText);
            
            return (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Contact Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {card.avatar}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {card.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {card.title || "N/A"}
                  </p>
                  
                  {/* Company and Location */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 mr-2 flex-shrink-0">🏢</div>
                      <span className="truncate">{card.company || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{address || "N/A"}</span>
                    </div>
                  </div>

                  {/* Email and Phone Info */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{card.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{phoneNumber || "N/A"}</span>
                    </div>
                  </div>

                  {/* Last Contact */}
                  <p className="text-xs text-gray-500 mb-4">
                    Extracted: {card.lastContact}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEmailClick(card.email)}
                      disabled={!card.email}
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        card.email
                          ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          : "text-gray-400 bg-gray-50 cursor-not-allowed"
                      }`}
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Email
                    </button>
                    
                    <button
                      onClick={() => handlePhoneClick(phoneNumber)}
                      disabled={!phoneNumber}
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        phoneNumber
                          ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          : "text-gray-400 bg-gray-50 cursor-not-allowed"
                      }`}
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
