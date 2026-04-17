import { useState,useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiReady, setAiReady] = useState(false);

  useEffect(()=> {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300)
    return () => clearInterval(checkReady);
  }, [])
  
  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");
    setError("");

    try {
      const result = await window.puter.ai.chat(`Please summarize the following text: ${text}`);
      setSummary(result.message?.content || "No summary available.");
    } catch (err) {
      setError(err.message || "An error occurred while summarizing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-slate-950
     to-indigo-950 flex flex-col items-center justify-center p-3 gap-6">
      <h1 className="text-6xl sm:text-8xl bg-gradient-to-r
       from-blue-700 via-emerald-700 to-teal-500 bg-clip-text text-transparent text-center">AI Text Summarizer</h1>

       <div className={`px-4 py-2 rounded-full text-sm ${
        aiReady ? "bg-blue-800/20 text-blue-300 border border-blue-500/30" : "bg-amber-400/20 text-yellow-300 border border-amber-400/30"

       }`}>
        {aiReady ? "🟢 AI is ready" : "🟡 Initializing AI..."}
       </div>

       <div className="w-full max-w-2xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md border
       border-gray-600 rounded-3xl p-6 shadow-2xl">
        <textarea className="w-full h-40 p-4 bg-gray-700/80 border
        border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none
        focus:ring-2 focus:ring-emerald-400 transition duration-300 disabled:opacity-50 resize-none shadow-xl focus:shadow-emerald-700/70"
        placeholder="Paste/type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!aiReady || loading}
         ></textarea>

         <button onClick={handleSummarize} className="mt-4 px-6 py-3
         bg-gradient-to-r from-green-950 to-teal-800 hover:opacity-80
         text-white font-semibold rounded-2xl transition disabled:opacity-50
         disabled:cursor-not-allowed cursor-pointer"
         disabled={!aiReady || loading || !text.trim()}
         >
          {
            loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2
                 border-white/30 border-t-white rounded-full"></div>
                Summarizing...
              </div>
            ) : (
              "Summarize"
            )
          }
         </button>

         <div className="mt-4 space-y-4 text-white">
          {summary && ( 
            <div className="p-4 bg-gray-700/60 border border-gray-500
            rounded-xl whitespace-pre-wrap">
              {summary}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border
            border-red-300 rounded-xl">
              {error}
            </div>
          )}
         </div>
       </div>
    </div>
  );
}

export default App
