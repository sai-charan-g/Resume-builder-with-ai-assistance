"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [data, setData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const registerUser = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        // Redirect to login on successful registration
        router.push('/login')
      } else {
        const message = await response.text()
        setError(message || "An error occurred during registration.")
      }
    } catch (err) {
      setError("An unexpected error occurred!")
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>{error}</div>}
        
        <form onSubmit={registerUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label">Full Name</label>
            <input 
              className="input-field" 
              type="text" 
              placeholder="John Doe"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              className="input-field" 
              type="password" 
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Register
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
