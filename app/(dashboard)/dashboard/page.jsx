"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, FileText, LogOut, Copy, Share2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { ToastProvider, useToast } from '@/components/Toast'

function DashboardContent() {
  const router = useRouter()
  const toast = useToast()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resumes')
      if (res.ok) {
        const data = await res.json()
        setResumes(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Resume', targetJob: '' })
      })
      if (res.ok) {
        const newResume = await res.json()
        toast.success("Resume created!")
        router.push(`/editor/${newResume.id}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create resume.")
    }
  }

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duplicateFrom: id })
      })
      if (res.ok) {
        const newResume = await res.json()
        setResumes(prev => [newResume, ...prev])
        toast.success("Resume duplicated!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to duplicate resume.")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setResumes(resumes.filter(r => r.id !== id))
        toast.success("Resume deleted.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete resume.")
    }
  }

  const handleShareToggle = async (resume) => {
    const newPublic = !resume.isPublic
    try {
      const res = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newPublic })
      })
      if (res.ok) {
        setResumes(prev => prev.map(r => r.id === resume.id ? { ...r, isPublic: newPublic } : r))
        if (newPublic) {
          const shareUrl = `${window.location.origin}/shared/${resume.id}`
          navigator.clipboard?.writeText(shareUrl)
          toast.success("Share link copied to clipboard!")
        } else {
          toast.info("Resume is now private.")
        }
      }
    } catch (error) {
      toast.error("Failed to update sharing.")
    }
  }

  const skeletonStyle = {
    background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'var(--radius-md)',
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>My Resumes</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCreate} className="btn-primary">
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Create New
          </button>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary" style={{ color: '#ef4444' }}>
            <LogOut size={18} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass glass-panel" style={{ padding: '2rem' }}>
              <div style={{ ...skeletonStyle, width: '60%', height: '1.5rem', marginBottom: '1rem' }} />
              <div style={{ ...skeletonStyle, width: '40%', height: '1rem', marginBottom: '0.75rem' }} />
              <div style={{ ...skeletonStyle, width: '50%', height: '0.875rem' }} />
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass glass-panel flex-center" style={{ flexDirection: 'column', gap: '1rem', minHeight: '300px' }}>
          <FileText size={48} style={{ opacity: 0.5 }} />
          <h3>No resumes found</h3>
          <p style={{ opacity: 0.8 }}>Create your first AI-powered resume to get started.</p>
          <button onClick={handleCreate} className="btn-primary" style={{ marginTop: '1rem' }}>
            Create Resume
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {resumes.map((resume, idx) => (
            <div key={resume.id} className="glass glass-panel animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume.title}</h3>
                  {resume.targetJob && (
                    <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {resume.targetJob}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <Link href={`/editor/${resume.id}`} className="btn-secondary" style={{ padding: '0.45rem', borderRadius: '50%' }} title="Edit">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDuplicate(resume.id)} className="btn-secondary" style={{ padding: '0.45rem', borderRadius: '50%' }} title="Duplicate">
                    <Copy size={15} />
                  </button>
                  <button onClick={() => handleShareToggle(resume)} className="btn-secondary" style={{ padding: '0.45rem', borderRadius: '50%', color: resume.isPublic ? '#16a34a' : undefined }} title={resume.isPublic ? "Shared (click to unshare)" : "Share"}>
                    <Share2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(resume.id)} className="btn-secondary" style={{ padding: '0.45rem', borderRadius: '50%', color: '#ef4444', borderColor: 'transparent' }} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>
                  Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                {resume.isPublic && (
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 500 }}>🔗 Public</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  )
}
