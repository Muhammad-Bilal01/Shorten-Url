import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:3000'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setAnalytics(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, {
        url: url.trim()
      })

      setShortUrl(response.data.shortUrl)
      setAnalytics({
        shortCode: response.data.shortCode,
        visitCount: response.data.visitCount,
        createdAt: response.data.createdAt
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const fetchAnalytics = async () => {
    if (!analytics?.shortCode) return

    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics/${analytics.shortCode}`)
      setAnalytics(prev => ({
        ...prev,
        visitCount: response.data.visitCount
      }))
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    }
  }

  const resetForm = () => {
    setUrl('')
    setShortUrl('')
    setAnalytics(null)
    setError('')
    setCopied(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 URL Shortener</h1>
        <p>Transform long URLs into short, shareable links</p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="url-input"
              disabled={loading}
              required
            />
            <button 
              type="submit" 
              className="shorten-btn"
              disabled={loading || !url.trim()}
            >
              {loading ? '⏳' : '✂️'} {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}

        {shortUrl && (
          <div className="result">
            <div className="result-header">
              <h3>✅ URL Shortened Successfully!</h3>
              <button onClick={resetForm} className="reset-btn">
                🔄 New URL
              </button>
            </div>
            
            <div className="short-url-container">
              <div className="short-url">
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="short-link"
                >
                  {shortUrl}
                </a>
                <button 
                  onClick={copyToClipboard}
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {analytics && (
              <div className="analytics">
                <h4>📊 Analytics</h4>
                <div className="stats">
                  <div className="stat">
                    <span className="stat-label">Visits:</span>
                    <span className="stat-value">{analytics.visitCount}</span>
                    <button onClick={fetchAnalytics} className="refresh-btn">
                      🔄
                    </button>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Created:</span>
                    <span className="stat-value">
                      {new Date(analytics.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="features">
          <h3>✨ Features</h3>
          <div className="feature-grid">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Instant shortening</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Visit tracking</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔗</span>
              <span>Easy sharing</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Secure & fast</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with ❤️ using React & Express</p>
      </footer>
    </div>
  )
}

export default App
