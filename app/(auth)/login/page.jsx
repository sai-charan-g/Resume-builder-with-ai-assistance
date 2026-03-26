"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [data, setData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const loginUser = async (e) => {
    e.preventDefault()
    
    // Using standard credentials provider
    const signInData = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (signInData?.error) {
      setError("Invalid email or password")
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>{error}</div>}
        
        <form onSubmit={loginUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            Sign In
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}
