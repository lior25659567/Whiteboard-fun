import { useState } from 'react'
import './custom-challenge.css'
import PillButton from './ui/pill-button.jsx'
import { generateCustomPrompt, getApiKey, setApiKey } from '../lib/generate-prompt.js'

// Home-page panel: paste your own whiteboard challenge and let Claude fill in
// the brief + worked solution, then start a session on it.
const CustomChallenge = ({ minutes, onStart }) => {
  const [challenge, setChallenge] = useState('')
  const [apiKey, setKey] = useState(getApiKey())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onKeyChange = (v) => {
    setKey(v)
    setApiKey(v) // persist locally
  }

  const generate = async () => {
    setError('')
    if (!apiKey.trim()) return setError('Paste your Anthropic API key first.')
    if (challenge.trim().length < 8) return setError('Describe your challenge in a sentence or two.')
    setLoading(true)
    try {
      const prompt = await generateCustomPrompt(challenge, apiKey.trim())
      onStart(prompt, minutes)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="custom">
      <p className="t-eyebrow custom__legend">Or bring your own challenge</p>
      <p className="t-caption custom__lead">
        Paste any whiteboard prompt. Claude fills in the brief, the 8-step worked solution, and a
        sketch — then you practise on it.
      </p>

      <textarea
        className="custom__textarea t-body-md"
        rows={3}
        placeholder="e.g. Design an alert inbox for a security team triaging hundreds of incidents a day."
        value={challenge}
        onChange={(e) => setChallenge(e.target.value)}
        disabled={loading}
      />

      <label className="custom__key">
        <span className="t-caption custom__key-label">Anthropic API key</span>
        <input
          type="password"
          className="custom__key-input t-body-md"
          placeholder="sk-ant-…"
          value={apiKey}
          onChange={(e) => onKeyChange(e.target.value)}
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        <span className="t-micro custom__key-note">
          Stored only in this browser; used to call Claude directly. Get one at console.anthropic.com.
        </span>
      </label>

      {error && <p className="t-caption custom__error">{error}</p>}

      <div className="custom__actions">
        <PillButton variant="primary" onClick={generate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate & start'}
        </PillButton>
      </div>
    </section>
  )
}

export default CustomChallenge
