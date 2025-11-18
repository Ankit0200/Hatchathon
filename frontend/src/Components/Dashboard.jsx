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
  AreaChart,
  Area,
} from "recharts";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// Color constants
const RATING_COLORS = {
  High: "#10B981",
  Medium: "#F59E0B",
  Low: "#EF4444",
};
const SENTIMENT_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#14B8A6",
  "#F97316",
];

function Dashboard() {
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState("30d");
  const [appliedRangeLabel, setAppliedRangeLabel] = useState("Last 30 days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => handlePreset(timeframe), [timeframe]);

  // Utils
  const toISODate = (d) => d.toISOString().split("T")[0];

  const handlePreset = (range) => {
    if (range === "custom") return;

    const now = new Date();
    const presets = {
      "7d": { start: toISODate(new Date(now - 6 * 86400000)), label: "Last 7 days" },
      "30d": { start: toISODate(new Date(now - 29 * 86400000)), label: "Last 30 days" },
      all: { start: null, label: "All time" },
    };

    const selected = presets[range] || presets["all"];
    fetchData({ start_date: selected.start, label: selected.label });
  };

  const fetchData = async ({ start_date = null, end_date = null, label = "All Time" }) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await axios.get(`${BACKEND_URL}/analytics/summary`, {
        params: { ...(start_date && { start_date }), ...(end_date && { end_date }) },
      });

      setData(response.data);
      setAppliedRangeLabel(label);
    } catch (error) {
      setErrorMsg(error?.response?.data?.detail || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomApply = () => {
    if (!customStart || !customEnd) return setErrorMsg("Both dates required");
    if (new Date(customStart) > new Date(customEnd))
      return setErrorMsg("Invalid range");

    fetchData({
      start_date: customStart,
      end_date: customEnd,
      label: `Custom: ${customStart} → ${customEnd}`,
    });
  };

  // Chart Data Transformers
  const ratingCategory = (score) => (score >= 9 ? "High" : score >= 7 ? "Medium" : "Low");

  const ratingData = data?.conversations
    ? ["High", "Medium", "Low"].map((cat) => ({
        name: cat,
        value: data.conversations.filter((c) => ratingCategory(c.score) === cat).length,
      }))
    : [];

  const sentimentData = data?.summary?.sentiment_breakdown
    ? Object.entries(data.summary.sentiment_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const trendData = data?.conversations
    ? data.conversations
        .filter((c) => c.saved_at)
        .sort((a, b) => new Date(a.saved_at) - new Date(b.saved_at))
        .map((c) => ({
          date: new Date(c.saved_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: c.score || 0,
        }))
    : [];

  const topFeedback = data?.top_feedback
    ? data.top_feedback.slice(0, 8).map((i) => ({
        name: i.text.length > 40 ? i.text.slice(0, 40) + "..." : i.text,
        count: i.count,
        full: i.text,
      }))
    : [];

  const turnsData = data?.conversations
    ? Object.entries(
        data.conversations.reduce((acc, c) => {
          const t = c.total_turns || 0;
          acc[t] = (acc[t] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([turns, count]) => ({
          turns: Number(turns),
          label: `${turns} turn${turns > 1 ? "s" : ""}`,
          count,
        }))
        .sort((a, b) => a.turns - b.turns)
    : [];

  // UI States
  if (loading)
    return (
      <LoadingScreen text="Loading analytics dashboard..." sub="Gathering insights" />
    );

  if (errorMsg)
    return (
      <ErrorScreen
        msg={errorMsg}
        onRetry={() => fetchData({})}
      />
    );

  if (!data)
    return <EmptyScreen />;

  const summary = data.summary;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Header */}
      <Header appliedLabel={appliedRangeLabel} timeframe={timeframe} setTimeframe={setTimeframe} />

      {/* Custom Range */}
      {timeframe === "custom" && (
        <CustomRange
          start={customStart}
          end={customEnd}
          setStart={setCustomStart}
          setEnd={setCustomEnd}
          onApply={handleCustomApply}
        />
      )}

      {/* Dashboard */}
      <main className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Conversations" value={summary.total_conversations} icon="💬" />
          <StatCard
            label="Average Rating"
            value={summary.avg_score?.toFixed(1) || "N/A"}
            icon="⭐"
            trend={summary.avg_score >= 7 ? "up" : "down"}
          />
          <StatCard label="Follow-ups Needed" value={`${summary.followup_required_pct}%`} icon="🔄" />
          <StatCard label="Avg Turns" value={summary.avg_turns?.toFixed(1)} icon="📈" />
        </div>

        <ChartRow>
          <PieSection title="Rating Distribution" data={ratingData} colors={RATING_COLORS} />
          <PieSection title="Sentiment Breakdown" data={sentimentData} colors={SENTIMENT_COLORS} />
        </ChartRow>

        <FullChart title="Rating Trend">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis domain={[0, 10]} stroke="#9CA3AF" />
              <Tooltip contentStyle={ttStyle} />
              <Area dataKey="score" stroke="#6366F1" fill="url(#lineColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </FullChart>

        <ChartRow>
          <BarSection title="Top Feedback" data={topFeedback} dataKey="count" nameKey="name" />
          <BarSection title="Turns Distribution" data={turnsData} dataKey="count" nameKey="label" />
        </ChartRow>
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const ttStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
};

// Header
function Header({ appliedLabel, timeframe, setTimeframe }) {
  const presets = [
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "all", label: "All Time" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {appliedLabel}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setTimeframe(p.key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeframe === p.key
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// Custom range section
function CustomRange({ start, end, setStart, setEnd, onApply }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
      <div className="bg-white/10 p-8 border border-white/20 rounded-2xl">
        <h3 className="text-white font-semibold mb-4">Select Date Range</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <InputDate label="Start" value={start} onChange={setStart} />
          <InputDate label="End" value={end} onChange={setEnd} />
          <div className="flex items-end">
            <button
              onClick={onApply}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const InputDate = ({ label, value, onChange }) => (
  <div className="flex-1">
    <label className="text-gray-300 text-sm mb-1 block">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
    />
  </div>
);

// Stats
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="text-gray-300 text-sm">{label}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Layout wrappers
const ChartRow = ({ children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">{children}</div>
);

const FullChart = ({ title, children }) => (
  <ChartCard title={title} full>{children}</ChartCard>
);

function ChartCard({ title, children, full }) {
  return (
    <div
      className={`bg-white/10 border border-white/20 rounded-2xl p-6 ${
        full ? "" : ""
      }`}
    >
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Chart components
function PieSection({ title, data, colors }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={colors[entry.name] || colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={ttStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function BarSection({ title, data, dataKey, nameKey }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey={nameKey} type="category" width={140} stroke="#9CA3AF" />
          <Tooltip contentStyle={ttStyle} />
          <Bar dataKey={dataKey} fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* Loading / Error / Empty screens */
const LoadingScreen = ({ text, sub }) => (
  <Screen>
    <div className="relative">
      <Spinner />
    </div>
    <p className="text-white text-xl">{text}</p>
    <p className="text-purple-300 text-sm">{sub}</p>
  </Screen>
);

const ErrorScreen = ({ msg, onRetry }) => (
  <Screen>
    <h2 className="text-red-400 text-2xl font-bold mb-2">Error</h2>
    <p className="text-gray-300 mb-4">{msg}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
    >
      Retry
    </button>
  </Screen>
);

const EmptyScreen = () => (
  <Screen>
    <p className="text-gray-300 text-lg">No Data Available</p>
  </Screen>
);

const Screen = ({ children }) => (
  <div className="w-full h-screen flex flex-col items-center justify-center text-center">
    {children}
  </div>
);

const Spinner = () => (
  <div className="w-20 h-20 mx-auto mb-6 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
);

export default Dashboard;
