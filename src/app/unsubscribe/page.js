'use client'

// Reads the ?token= param from the URL and hits the unsubscribe endpoint on mount.
// One-shot: fires automatically, no button needed.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import './Unsubscribe.css'

export default function UnsubscribePage() {
  // 'loading' → 'success' | 'invalid' | 'error'
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    // Read token from query string (runs only in the browser)
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      setStatus('invalid')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/unsubscribe?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        // Backend returns { message: '...' } on success
        if (data.message) setStatus('success')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="unsub-wrapper">
      <div className="unsub-card">

        {/* ── LOADING ──────────────────────────────────────────────────────── */}
        {status === 'loading' && (
          <div className="unsub-center">
            <div className="unsub-spinner" aria-hidden="true" />
            <p className="unsub-loading-text">Processing your request...</p>
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────────────────────── */}
        {status === 'success' && (
          <div className="unsub-center">
            <div className="unsub-icon">👋</div>
            <h1 className="unsub-headline">You&apos;ve been unsubscribed.</h1>
            <p className="unsub-body">
              Sorry to see you go. You won&apos;t receive any more emails
              from CryptoBriefs.
            </p>
            {/* Soft CTA — gray, not purple, so it doesn't feel pushy */}
            <Link href="/subscribe" className="unsub-soft-link">
              Changed your mind? Subscribe again →
            </Link>
          </div>
        )}

        {/* ── INVALID (no token) or ERROR (link used / expired) ────────────── */}
        {(status === 'invalid' || status === 'error') && (
          <div className="unsub-center">
            <div className="unsub-icon">⚠️</div>
            <h1 className="unsub-headline">Link invalid or already used</h1>
            <p className="unsub-body">
              This unsubscribe link is invalid or has already been used.
            </p>
            <Link href="/subscribe" className="unsub-text-link">
              Go to subscribe page →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
