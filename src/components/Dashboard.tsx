"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import { useOcrResponses } from "../hooks/useOcrResponses";
import { useOcrStats } from "../hooks/useOcrStats";
import { useOcrMutation } from "../hooks/useOcrMutation";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    responses,
    loading,
    error,
    total,
    pages,
    refetch,
    searchResponses,
    clearSearch,
  } = useOcrResponses(currentPage);

  const { stats, loading: statsLoading } = useOcrStats();
  const { deleteResponse, loading: deleteLoading } = useOcrMutation();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchResponses(searchTerm.trim());
      setCurrentPage(1);
    } else {
      await clearSearch();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this OCR response?")) {
      const success = await deleteResponse(id);
      if (success) {
        await refetch();
      }
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    await clearSearch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">OCR Dashboard</h1>
            <p className="text-indigo-100">
              Manage and analyze your text extraction history
            </p>
          </div>
          <ChartBarIcon className="w-12 h-12 text-indigo-200" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white  rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              ))
          : stats
            ? [
                {
                  title: "Total Extractions",
                  value: stats.totalResponses.toLocaleString(),
                  icon: DocumentTextIcon,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                },
                {
                  title: "Characters Extracted",
                  value: stats.totalTextLength.toLocaleString(),
                  icon: ArrowTrendingUpIcon,
                  color: "from-green-500 to-emerald-500",
                  bgColor: "bg-green-50 dark:bg-green-900/20",
                },
                {
                  title: "Avg Processing Time",
                  value: stats.averageProcessingTime
                    ? `${Math.round(stats.averageProcessingTime)}ms`
                    : "N/A",
                  icon: ClockIcon,
                  color: "from-purple-500 to-pink-500",
                  bgColor: "bg-purple-50 dark:bg-purple-900/20",
                },
                {
                  title: "Most Common Format",
                  value: stats.mostCommonMimeType
                    ? stats.mostCommonMimeType
                        .replace("image/", "")
                        .toUpperCase()
                    : "N/A",
                  icon: PhotoIcon,
                  color: "from-orange-500 to-red-500",
                  bgColor: "bg-orange-50 dark:bg-orange-900/20",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200  hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900  mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 ">
                    {stat.title}
                  </div>
                </div>
              ))
            : null}
      </div>

      {/* Search and Controls */}
      <div className="bg-white  rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 ">
            Extraction History ({total})
          </h2>

          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in extracted text..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500  "
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </form>

            <button
              onClick={refetch}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 ">
              Loading responses...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-800 dark:text-red-200 font-medium">
              Error: {error}
            </p>
            <button
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && responses.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900  mb-2">
              {searchTerm ? "No responses found" : "No extractions yet"}
            </h3>
            <p className="text-gray-600 ">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Upload an image to get started with text extraction."}
            </p>
          </div>
        )}

        {/* Responses List */}
        {!loading && !error && responses.length > 0 && (
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 ">
                        {response.originalName || `Response #${response.id}`}
                      </h3>
                      <span className="px-3 py-1 bg-indigo-100  text-indigo-800  text-sm rounded-full">
                        #{response.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 ">
                      <span className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        {response.formattedDate}
                      </span>
                      {response.mimeType && (
                        <span className="flex items-center">
                          <PhotoIcon className="w-4 h-4 mr-1" />
                          {response.mimeType
                            .replace("image/", "")
                            .toUpperCase()}
                        </span>
                      )}
                      {response.imageSize && (
                        <span>{formatFileSize(response.imageSize)}</span>
                      )}
                      {response.processingTime && (
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {response.processingTime}ms
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedResponse(
                          selectedResponse === response.id ? null : response.id,
                        )
                      }
                      className="flex items-center px-3 py-2 text-sm bg-indigo-100  text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                    >
                      {selectedResponse === response.id ? (
                        <>
                          <EyeSlashIcon className="w-4 h-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(response.id)}
                      disabled={deleteLoading}
                      className="flex items-center px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Text Preview */}
                <div className="text-gray-700 ">
                  {selectedResponse === response.id ? (
                    <div className="bg-white  p-4 rounded-xl border border-gray-200 dark:border-gray-600 max-h-96 overflow-auto">
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{response.extractedText}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600  line-clamp-3">
                      {response.textPreview}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-sm bg-gray-200  text-gray-700  rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200  text-gray-700  hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pages > 5 && (
                <>
                  <span className="px-2 py-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(pages)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === pages
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200  text-gray-700  hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pages}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={currentPage === pages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-sm bg-gray-200  text-gray-700  rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
