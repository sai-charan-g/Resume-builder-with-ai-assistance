"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import ResumeTemplate from '@/components/ResumeTemplate'

export default function SharedResumePage() {
  const params = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [title, setTitle] = useState('')
  const [targetJob, setTargetJob] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) fetchSharedResume()
  }, [params.id])

  const fetchSharedResume = async () => {
    try {
      const res = await fetch(`/api/resumes/share/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setTitle(data.title)
        setTargetJob(data.targetJob || '')
        setAuthorName(data.authorName || '')
        if (data.content) {
          try {
            setResumeData(JSON.parse(data.content))
          } catch (e) {
            console.error('Parse error', e)
          }
        }
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p>Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error || !resumeData) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h2>Resume Not Found</h2>
        <p style={{ opacity: 0.7 }}>This resume may not be shared publicly or may have been removed.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>{title}</h2>
        {authorName && <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>by {authorName}</p>}
      </div>
      <ResumeTemplate resumeData={resumeData} targetJob={targetJob} />
    </div>
  )
}
