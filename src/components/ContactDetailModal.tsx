"use client";

import { useState } from "react";
import {
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ClockIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface ExtractedCard {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  extractedText: string;
  avatar: string;
  lastContact: string;
  status: string;
}

interface ContactDetailModalProps {
  card: ExtractedCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDetailModal({ card, isOpen, onClose }: ContactDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !card) return null;

  const generateEmailTemplate = (contact: ExtractedCard) => {
    const subject = `Great meeting you at [Event Name]`;
    const body = `Hi ${contact.name},

It was wonderful meeting you at [Event/Conference Name]. I really enjoyed our conversation about [topic discussed].

As promised, I wanted to follow up and explore potential collaboration opportunities between ${contact.company || '[Company Name]'} and our team.

I'd love to schedule a brief call next week to discuss how we might work together. Are you available for a 30-minute conversation?

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Contact Information]`;

    return { subject, body };
  };

  const { subject, body } = generateEmailTemplate(card);

  const handleEmailClick = () => {
    if (card.email) {
      const mailtoLink = `mailto:${card.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (card.phone) {
      const cleanPhone = card.phone.replace(/[^\d+]/g, '');
      window.open(`tel:${cleanPhone}`, '_blank');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email template:", err);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {card.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{card.name}</h2>
                <p className="text-gray-600">{card.title || "N/A"}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(card.status)}`}>
                    {card.status}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {card.lastContact}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{card.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{card.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-gray-900">{card.company || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Template */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2 text-purple-600" />
                Sample Follow-up Email
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </button>
                {card.email && (
                  <button
                    onClick={handleEmailClick}
                    className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <EnvelopeIcon className="w-4 h-4 mr-1" />
                    Send Email
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject:
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900">{subject}</p>
                </div>
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body:
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                    {body}
                  </pre>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {card.phone && (
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Call
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
