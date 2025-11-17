import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const RATING_CATEGORY_COLORS = {
  high: "#22C55E",
  medium: "#FACC15",
  low: "#F87171",
};

const SENTIMENT_PALETTE = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#EC4899",
  "#6366F1",
];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [timeframe, setTimeframe] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [appliedRangeLabel, setAppliedRangeLabel] = useState("Last 30 days");

  useEffect(() => {
    applyPresetRange(timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const applyPresetRange = (preset) => {
    const now = new Date();
    let start = null;
    let end = null;
    let label = "All time";

    switch (preset) {
      case "7d":
        start = formatDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
        label = "Last 7 days";
        break;
      case "30d":
        start = formatDate(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
        label = "Last 30 days";
        break;
      case "custom":
        // For custom we wait for user to click apply
        return;
      default:
        start = null;
        end = null;
        label = "All time";
    }

    fetchAnalytics({ start_date: start, end_date: end, label });
  };

  const fetchAnalytics = async ({ start_date = null, end_date = null, label = "All time" } = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      const response = await axios.get(`${BACKEND_URL}/analytics/summary`, { params });
      setData(response.data);
      setAppliedRangeLabel(label);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.response?.data?.detail || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCustomRange = () => {
    if (!customStart || !customEnd) {
      setError("Please select both start and end dates for the custom range.");
      return;
    }
    if (new Date(customStart) > new Date(customEnd)) {
      setError("Start date must be before end date.");
      return;
    }
    fetchAnalytics({
      start_date: customStart,
      end_date: customEnd,
      label: `Custom: ${customStart} → ${customEnd}`,
    });
  };

  const getRatingCategory = (score) => {
    if (score >= 9) return "High";
    if (score >= 7) return "Medium";
    return "Low";
  };

  const prepareRatingData = () => {
    if (!data?.conversations) return [];
    const categories = { High: 0, Medium: 0, Low: 0 };
    data.conversations.forEach((conv) => {
      const category = getRatingCategory(conv.score || 0);
      categories[category]++;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const prepareSentimentData = () => {
    if (!data?.summary?.sentiment_breakdown) return [];
    return Object.entries(data.summary.sentiment_breakdown).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const prepareScoreTrend = () => {
    if (!data?.conversations) return [];
    return data.conversations
      .filter((c) => c.saved_at)
      .sort((a, b) => new Date(a.saved_at) - new Date(b.saved_at))
      .map((conv, index) => ({
        date: new Date(conv.saved_at).toLocaleDateString(),
        score: conv.score || 0,
        index: index + 1,
      }));
  };

  const prepareTopFeedback = () => {
    if (!data?.top_feedback) return [];
    return data.top_feedback.slice(0, 10).map((item) => ({
      name: item.text.length > 30 ? item.text.substring(0, 30) + "..." : item.text,
      count: item.count,
      fullText: item.text,
    }));
  };

  const prepareTurnsDistribution = () => {
    if (!data?.conversations) return [];
    const distribution = {};
    data.conversations.forEach((conv) => {
      const turns = conv.total_turns || 0;
      distribution[turns] = (distribution[turns] || 0) + 1;
    });
    return Object.entries(distribution)
      .map(([turns, count]) => ({
        turns: Number(turns),
        label: `${turns} turn${turns === "1" ? "" : "s"}`,
        count,
      }))
      .sort((a, b) => a.turns - b.turns);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-600 text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No data available</p>
        </div>
      </div>
    );
  }

  const summary = data.summary || {};
  const ratingData = prepareRatingData();
  const sentimentData = prepareSentimentData();
  const scoreTrend = prepareScoreTrend();
  const topFeedback = prepareTopFeedback();
  const turnsDistribution = prepareTurnsDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-slide-in-right">📊 Analytics Dashboard</h1>
                <p className="text-gray-600 animate-slide-in-right animate-delay-100">
                  Customer feedback insights and trends
                  <span className="ml-2 text-sm text-gray-500">({appliedRangeLabel})</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="30d">Last 30 days</option>
                  <option value="7d">Last 7 days</option>
                  <option value="all">All time</option>
                  <option value="custom">Custom range</option>
                </select>

                {timeframe !== "custom" && (
                  <button
                    onClick={() => applyPresetRange(timeframe)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
                  >
                    <span>🔄</span>
                    Refresh
                  </button>
                )}
              </div>
            </div>

            {timeframe === "custom" && (
              <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                  <input
                    type="date"
                    value={customEnd}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleApplyCustomRange}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setCustomStart("");
                      setCustomEnd("");
                      setTimeframe("30d");
                    }}
                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover-lift animate-fade-in animate-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Conversations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-smooth">
                  {summary.total_conversations ??
                    summary.conversations ??
                    0}
                </p>
              </div>
              <div className="text-4xl animate-pulse-slow">💬</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover-lift animate-fade-in animate-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-smooth">{summary.avg_score || "N/A"}</p>
                {summary.median_score && (
                  <p className="text-xs text-gray-500 mt-1">Median: {summary.median_score}</p>
                )}
              </div>
              <div className="text-4xl animate-pulse-slow">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover-lift animate-fade-in animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Follow-up Required</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-smooth">{summary.followup_required_pct || 0}%</p>
              </div>
              <div className="text-4xl animate-pulse-slow">🔄</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover-lift animate-fade-in animate-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Conversation Turns</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-smooth">{summary.avg_turns || 0}</p>
                {summary.max_turns && (
                  <p className="text-xs text-gray-500 mt-1">Max: {summary.max_turns}</p>
                )}
              </div>
              <div className="text-4xl animate-pulse-slow">📈</div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover-lift animate-scale-in animate-delay-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {ratingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RATING_CATEGORY_COLORS[entry.name.toLowerCase()] || "#94A3B8"}
                    />
                  ))}
                </Pie>
                <Tooltip animationDuration={200} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover-lift animate-scale-in animate-delay-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiment Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={100}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SENTIMENT_PALETTE[index % SENTIMENT_PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip animationDuration={200} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover-lift animate-scale-in animate-delay-400">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip animationDuration={200} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Rating"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Feedback Themes */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover-lift animate-scale-in animate-delay-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Feedback Themes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topFeedback} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip animationDuration={200} />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6"
                  animationBegin={200}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversation Turns Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover-lift animate-scale-in animate-delay-600">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation Depth Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={turnsDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip animationDuration={200} />
              <Bar 
                dataKey="count" 
                fill="#10B981"
                animationBegin={300}
                animationDuration={1000}
                animationEasing="ease-out"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversations Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up animate-delay-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Conversations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sentiment</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Turns</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Initial Feedback</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.conversations?.slice(0, 20).map((conv, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-smooth animate-slide-in-right"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {conv.saved_at
                        ? new Date(conv.saved_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          conv.score >= 9
                            ? "bg-green-100 text-green-800"
                            : conv.score >= 7
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {conv.score || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          conv.sentiment?.toLowerCase().includes("positive")
                            ? "bg-green-100 text-green-800"
                            : conv.sentiment?.toLowerCase().includes("negative")
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {conv.sentiment || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{conv.total_turns || 0}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {conv.initial_transcription || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedConversation(conv)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversation Detail Modal */}
        {selectedConversation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Conversation Details</h3>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-lg font-semibold">{selectedConversation.score || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sentiment</p>
                    <p className="text-lg font-semibold">{selectedConversation.sentiment || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Turns</p>
                    <p className="text-lg font-semibold">{selectedConversation.total_turns || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-lg font-semibold">
                      {selectedConversation.saved_at
                        ? new Date(selectedConversation.saved_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Initial Transcription</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded">
                    {selectedConversation.initial_transcription || "N/A"}
                  </p>
                </div>
                {selectedConversation.initial_feedback_points?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Key Feedback Points</p>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedConversation.initial_feedback_points.map((point, i) => (
                        <li key={i} className="text-gray-800">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedConversation.final_transcription && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Final Transcription</p>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">
                      {selectedConversation.final_transcription}
                    </p>
                  </div>
                )}
                {selectedConversation.final_response && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">AI Final Response</p>
                    <p className="text-gray-800 bg-blue-50 p-3 rounded">
                      {selectedConversation.final_response}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

