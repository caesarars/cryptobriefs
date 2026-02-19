'use client'

import { useState } from 'react'
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe`  || ""

// Basic email format check — runs before the API call
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Map backend message text to a display colour variant
function getVariant(msg) {
  const lower = msg.toLowerCase()
  if (
    lower.includes('already subscribed') ||
    lower.includes('please check your email to confirm')
  ) return 'amber'
  if (lower.includes('welcome back')) return 'green'
  return 'red'
}

export default function SubscribeForm() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState('idle')   // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation before hitting the network
    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(
        `${API_BASE}/subscribe`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        }
      )

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // Keep `email` in state so the success card can display it
        setStatus('success')
      } else {
        setStatus('error')
        setMessage(data?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  // ── SUCCESS — hide the form, show confirmation card ──────────────────────
  if (status === 'success') {
    return (
      <div className="sub-success-card">
        <div className="sub-success-icon">✉️</div>
        <p className="sub-success-headline">Check your inbox!</p>
        <p className="sub-success-body">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your subscription.
        </p>
        <p className="sub-success-note">Don&apos;t see it? Check your spam folder.</p>
      </div>
    )
  }

  const variant = message ? getVariant(message) : 'red'

  // ── IDLE / LOADING / ERROR — show the form ───────────────────────────────
  return (
    <form onSubmit={handleSubmit}>
      <div className="sub-input-wrap">
        <input
          type="email"
          className="sub-input"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          required
        />

        <button
          type="submit"
          className="sub-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="sub-spinner" aria-hidden="true" />
              Subscribing...
            </>
          ) : (
            'Subscribe for free →'
          )}
        </button>
      </div>

      {/* Inline feedback — colour reflects severity of the message */}
      {message && (
        <p
          className={`sub-msg sub-msg-${variant}`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  )
}
