'use client'

// Reads the ?token= param from the URL and hits the verify endpoint on mount.
// No auth, no session — just a one-shot confirmation link handler.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import './Verify.css'

export default function VerifyPage() {
  // 'loading' → 'success' | 'invalid' | 'error'
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    // Read token from query string (runs only in the browser)
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      setStatus('invalid')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        // Backend returns { message: '...' } on success
        if (data.message) setStatus('success')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="verify-wrapper">
      <div className="verify-card">

        {/* ── LOADING ──────────────────────────────────────────────────────── */}
        {status === 'loading' && (
          <div className="verify-center">
            <div className="verify-spinner" aria-hidden="true" />
            <p className="verify-loading-text">Confirming your subscription...</p>
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────────────────────── */}
        {status === 'success' && (
          <div className="verify-center">
            <div className="verify-icon">✅</div>
            <h1 className="verify-headline">You&apos;re confirmed!</h1>
            <p className="verify-body">
              Welcome to CryptoBriefs. Your first brief arrives tomorrow morning.
            </p>
            <Link href="/brief" className="verify-cta-btn">
              Read today&apos;s brief →
            </Link>
          </div>
        )}

        {/* ── INVALID (no token in URL) ─────────────────────────────────────── */}
        {status === 'invalid' && (
          <div className="verify-center">
            <div className="verify-icon">❌</div>
            <h1 className="verify-headline">Invalid link</h1>
            <p className="verify-body">
              This verification link is missing or broken.
              Please subscribe again.
            </p>
            <Link href="/subscribe" className="verify-text-link">
              Back to subscribe →
            </Link>
          </div>
        )}

        {/* ── ERROR (API returned error / link expired) ─────────────────────── */}
        {status === 'error' && (
          <div className="verify-center">
            <div className="verify-icon">⚠️</div>
            <h1 className="verify-headline">Link expired or already used</h1>
            <p className="verify-body">
              This link may have already been used or has expired.
              If you&apos;re already subscribed, you&apos;re good to go!
            </p>
            <Link href="/brief" className="verify-text-link">
              Read the brief →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
