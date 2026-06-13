import { useState } from 'react'

function App() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight">IncludeIQ</h1>
          <p className="text-xl text-slate-600">AI Chief Accessibility Officer</p>
        </header>

        <main className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-semibold text-slate-700">
              Paste Document or Text to Analyze
            </label>
            <textarea
              id="content"
              rows={8}
              className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 font-mono text-sm bg-slate-50"
              placeholder="e.g., Job description, meeting transcript, or policy..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Analyzing with Azure AI...' : 'Analyze Document'}
          </button>
        </main>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Accessibility Score</span>
                <span className={`text-6xl font-black ${result.accessibility_score > 80 ? 'text-green-500' : result.accessibility_score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {result.accessibility_score}/100
                </span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Inclusion Risk</span>
                <span className={`text-6xl font-black ${result.inclusion_risk_score > 50 ? 'text-red-500' : result.inclusion_risk_score > 20 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {result.inclusion_risk_score}/100
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Context Detected</h3>
                <p className="text-slate-700">{result.context}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Highest Risk Areas</h3>
                <ul className="space-y-4">
                  {result.highest_risk_areas?.map((area, idx) => (
                    <li key={idx} className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <strong className="text-red-800 block mb-1">{area.area}</strong>
                      <span className="text-red-700 text-sm">{area.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Recommended Actions</h3>
                <ul className="space-y-3">
                  {result.recommended_actions?.map((action, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="text-slate-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
