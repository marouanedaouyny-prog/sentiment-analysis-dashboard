"use client";

import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { MessageSquare, ThumbsUp, ThumbsDown, Activity, RefreshCw, AlertCircle, TrendingUp, Search } from "lucide-react";

export default function SentimentDashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const COLORS = ['#10b981', '#6366f1', '#ef4444'];
  
  const sentimentStats = results ? [
    { name: 'Positive', value: results.results.filter((r: any) => r.analysis.sentiment === 'Positive').length || 1 },
    { name: 'Neutral', value: results.results.filter((r: any) => r.analysis.sentiment === 'Neutral').length || 0 },
    { name: 'Negative', value: results.results.filter((r: any) => r.analysis.sentiment === 'Negative').length || 0 },
  ] : [
    { name: 'Positive', value: 65 },
    { name: 'Neutral', value: 20 },
    { name: 'Negative', value: 15 },
  ];

  const trendData = [
    { day: 'Mon', score: 7.2 },
    { day: 'Tue', score: 7.8 },
    { day: 'Wed', score: 6.5 },
    { day: 'Thu', score: 8.1 },
    { day: 'Fri', score: 7.9 },
  ];

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8007/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setResults(data);
        alert(`Analysis complete. Average Score: ${data.summary.averageScore.toFixed(1)}/10`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Sentiment API. Ensure the backend is running on port 8007.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b pb-8 border-gray-100">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <MessageSquare className="text-indigo-600" />
              SentiTracker <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium tracking-wide italic">AI-powered customer sentiment & review aggregator.</p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
             <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  className="pl-12 pr-4 py-3 bg-white border rounded-2xl w-80 outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                  placeholder="Review URL (Trustpilot, Amazon...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
             </div>
             <button 
               onClick={handleAnalyze}
               disabled={!url || loading}
               className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20 disabled:opacity-50"
             >
               {loading ? <RefreshCw className="animate-spin" size={18} /> : <TrendingUp size={18} />}
               Analyze
             </button>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <SummaryCard title="Positive Feedback" value="65%" icon={<ThumbsUp size={20}/>} color="bg-emerald-50 text-emerald-600" />
           <SummaryCard title="Avg. Sentiment Score" value="7.8/10" icon={<Activity size={20}/>} color="bg-indigo-50 text-indigo-600" />
           <SummaryCard title="Negative Alerts" value="2 Critical" icon={<ThumbsDown size={20}/>} color="bg-rose-50 text-rose-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Sentiment Pie Chart */}
           <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-gray-50">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2"><Activity size={20} className="text-indigo-600"/> Sentiment Breakdown</h3>
              <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={sentimentStats} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                          {sentimentStats.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                 {sentimentStats.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-500">
                       <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div> {s.name}
                    </div>
                 ))}
              </div>
           </div>

           {/* Trend Line Chart */}
           <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-gray-50">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2"><TrendingUp size={20} className="text-indigo-600"/> Weekly Sentiment Trend</h3>
              <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                       <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                       <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Insight Section */}
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-slate-900/20 flex items-center justify-between overflow-hidden relative group">
           <div className="relative z-10 space-y-1">
              <h4 className="text-xl font-bold flex items-center gap-2">
                 <AlertCircle size={24} className="text-yellow-400" />
                 AI Strategy Insight
              </h4>
              <p className="text-sm opacity-70 leading-relaxed font-medium max-w-2xl">
                 Sentiment in the "Shipping" category has dropped by 22% this week. Analysis suggests that delays in local distribution are the primary cause. Recommend shifting priority to Express partners for high-value orders.
              </p>
           </div>
           <Activity size={100} className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12 group-hover:scale-125 transition duration-1000" />
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ title, value, icon, color }: any) {
  return (
    <div className={`p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-gray-50 flex items-center justify-between ${color} transition hover:scale-[1.02] duration-300`}>
       <div className="space-y-1">
          <h4 className="text-sm font-bold uppercase tracking-widest opacity-70">{title}</h4>
          <p className="text-3xl font-extrabold tracking-tight">{value}</p>
       </div>
       <div className="p-4 bg-white/40 rounded-2xl shadow-sm">{icon}</div>
    </div>
  );
}
