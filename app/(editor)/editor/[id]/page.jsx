"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Save, ArrowLeft, Download, Plus, Trash2, ChevronUp, ChevronDown, LogOut, ClipboardCheck, Layout, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useReactToPrint } from 'react-to-print'
import ResumeTemplate from '@/components/ResumeTemplate'
import { useResumeStore } from '@/lib/store'
import { ToastProvider, useToast } from '@/components/Toast'
import { use } from 'react'

function EditorContent({ params }) {
  const router = useRouter()
  const { id } = use(params)
  const toast = useToast()
  
  const [resume, setResume] = useState(null)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [targetJob, setTargetJob] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [enhancingIndex, setEnhancingIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')
  const [skillInput, setSkillInput] = useState('')

  // ATS Checker state
  const [showATS, setShowATS] = useState(false)
  const [atsJobDesc, setAtsJobDesc] = useState('')
  const [atsResult, setAtsResult] = useState(null)
  const [atsLoading, setAtsLoading] = useState(false)

  // Share state
  const [isPublic, setIsPublic] = useState(false)

  // AI Recommendations state
  const [recsLoading, setRecsLoading] = useState(false)
  const [recsResult, setRecsResult] = useState(null)

  const { resumeData, setResumeData, updatePersonalInfo, 
    addExperience, updateExperience, removeExperience, moveExperience,
    addEducation, updateEducation, removeEducation, moveEducation,
    addSkill, removeSkill,
    addProject, updateProject, removeProject, moveProject,
    addCertification, updateCertification, removeCertification,
    addLanguage, updateLanguage, removeLanguage,
    addCustomSection, updateCustomSection, removeCustomSection,
    updateTheme } = useResumeStore()

  const printRef = useRef(null)
  const autoSaveTimer = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title || 'Professional_Resume',
  })

  useEffect(() => {
    fetchResume()
  }, [id])

  // Auto-save: debounce 2 seconds after last change
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      doSave(true)
    }, 2000)
  }, [id, title, targetJob])

  useEffect(() => {
    if (resume) triggerAutoSave()
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [resumeData, title, targetJob])

  const fetchResume = async () => {
    try {
      const res = await fetch(`/api/resumes/${id}`)
      if (res.ok) {
        const data = await res.json()
        setResume(data)
        setTitle(data.title)
        setTargetJob(data.targetJob || '')
        setIsPublic(data.isPublic || false)
        if (data.content) {
          try {
            const parsed = JSON.parse(data.content)
            // Ensure all arrays exist with defaults
            setResumeData({
              theme: parsed.theme || { color: '#2563eb', fontFamily: "'Inter', sans-serif", template: 'classic' },
              personalInfo: parsed.personalInfo || {},
              experience: parsed.experience || [],
              education: parsed.education || [],
              skills: parsed.skills || [],
              projects: parsed.projects || [],
              certifications: parsed.certifications || [],
              languages: parsed.languages || [],
              customSections: parsed.customSections || [],
            })
          } catch (e) { console.error("Could not parse content", e) }
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const doSave = async (isAuto = false) => {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetJob, content: JSON.stringify(resumeData) })
      })
      if (!res.ok) throw new Error("Failed to save")
      if (!isAuto) toast.success("Resume saved successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save resume.")
    } finally {
      setTimeout(() => setSaving(false), 300)
    }
  }

  const handleSave = () => doSave(false)

  const handleAIAssist = async () => {
    if (!targetJob && resumeData.experience.length === 0) {
      toast.warning("Please enter a Target Job Role or add some Experience first!")
      return
    }
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetJob, experience: resumeData.experience })
      })
      if (res.ok) {
        const data = await res.json()
        updatePersonalInfo({ summary: data.summary })
        toast.success("AI summary generated!")
      } else throw new Error("Generation failed")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate AI summary.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhanceBullets = async (index) => {
    const exp = resumeData.experience[index]
    if (!exp.bullets || exp.bullets.length === 0 || exp.bullets.join('').trim() === '') {
      toast.warning("Please enter some bullets to enhance first.")
      return
    }
    setEnhancingIndex(index)
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: exp.bullets.join('\n'), type: 'bullets' })
      })
      if (res.ok) {
        const data = await res.json()
        updateExperience(index, { bullets: data.enhancedText.split('\n').filter(b => b.trim() !== '') })
        toast.success("Bullets enhanced!")
      } else throw new Error("Enhancement failed")
    } catch (err) {
      console.error(err)
      toast.error("Failed to enhance bullets.")
    } finally {
      setEnhancingIndex(null)
    }
  }

  const handleATSCheck = async () => {
    if (!atsJobDesc.trim()) {
      toast.warning("Please paste a job description first.")
      return
    }
    setAtsLoading(true)
    try {
      const res = await fetch('/api/ai/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription: atsJobDesc })
      })
      if (res.ok) {
        const data = await res.json()
        setAtsResult(data)
        toast.success("ATS analysis complete!")
      } else throw new Error("ATS check failed")
    } catch (err) {
      console.error(err)
      toast.error("Failed to analyze resume.")
    } finally {
      setAtsLoading(false)
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      addSkill(skillInput.trim())
      setSkillInput('')
    }
  }

  const handleGetRecommendations = async () => {
    setRecsLoading(true)
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, targetJob })
      })
      if (res.ok) {
        const data = await res.json()
        setRecsResult(data)
        toast.success("AI recommendations ready!")
      } else throw new Error("Failed")
    } catch (err) {
      console.error(err)
      toast.error("Failed to get recommendations.")
    } finally {
      setRecsLoading(false)
    }
  }

  const handleShareToggle = async () => {
    const newPublic = !isPublic
    setIsPublic(newPublic)
    try {
      await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newPublic })
      })
      if (newPublic) {
        const shareUrl = `${window.location.origin}/shared/${id}`
        navigator.clipboard?.writeText(shareUrl)
        toast.success("Share link copied to clipboard!")
      } else {
        toast.info("Resume is now private.")
      }
    } catch (err) {
      toast.error("Failed to update sharing.")
    }
  }

  if (!resume) {
    return (
      <>
        <style>{`
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
        <div className="flex-center" style={{ minHeight: '100vh' }}>
          <div style={{ width: '80%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '0.75rem', height: '3rem' }} />
            <div style={{ background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '0.75rem', height: '6rem' }} />
            <div style={{ background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '0.75rem', height: '12rem' }} />
          </div>
        </div>
      </>
    )
  }

  const tabs = [
    { key: 'personal', label: 'Personal' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'certifications', label: 'Certs' },
    { key: 'languages', label: 'Languages' },
    { key: 'custom', label: 'Custom' },
    { key: 'ats', label: 'ATS Check' },
    { key: 'recommendations', label: 'AI Tips' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <nav className="glass" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', borderRadius: 0, flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 auto', minWidth: 0 }}>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.5rem', flexShrink: 0 }}>
            <ArrowLeft size={18} />
          </Link>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '1.1rem', fontWeight: 600, background: 'transparent', border: 'none', color: 'var(--foreground)', outline: 'none', minWidth: 0, flex: '1 1 auto' }}
          />
          {saving && <span style={{ fontSize: '0.75rem', opacity: 0.5, flexShrink: 0 }}>Auto-saving...</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={handleAIAssist} className="btn-secondary" style={{ color: 'var(--primary)', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} disabled={isGenerating}>
            <Sparkles size={16} style={{ marginRight: '0.35rem' }} />
            {isGenerating ? 'Generating...' : 'AI Summary'}
          </button>
          <button onClick={handleShareToggle} className="btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: isPublic ? '#16a34a' : undefined }}>
            {isPublic ? '🔗 Shared' : '🔒 Private'}
          </button>
          <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
            <Download size={16} style={{ marginRight: '0.35rem' }} />
            PDF
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
            <Save size={16} style={{ marginRight: '0.35rem' }} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary" style={{ padding: '0.5rem', color: '#ef4444' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Editor Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)', minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', borderBottom: '1px solid var(--border)', flexShrink: 0, padding: '0 0.5rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '0.6rem 0.8rem',
                  border: 'none',
                  background: activeTab === tab.key ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--primary)' : 'var(--foreground)',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
            {/* Theme Settings - always visible at top */}
            <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', display: activeTab === 'personal' ? 'block' : 'none' }}>
              <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, color: 'var(--primary-hover)', fontSize: '0.9rem' }}>Theme Customizer</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ color: 'var(--primary-hover)', fontSize: '0.8rem' }}>Template</label>
                  <select 
                    className="input-field"
                    style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                    value={resumeData.theme?.template || 'classic'}
                    onChange={(e) => updateTheme({ template: e.target.value })}
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="two-column">Two Column</option>
                  </select>
                </div>
                <div>
                  <label className="label" style={{ color: 'var(--primary-hover)', fontSize: '0.8rem' }}>Color</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#475569', '#000000'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateTheme({ color })}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color,
                          border: resumeData.theme?.color === color ? '2px solid white' : 'none',
                          outline: resumeData.theme?.color === color ? `2px solid ${color}` : 'none',
                          cursor: 'pointer',
                        }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" style={{ color: 'var(--primary-hover)', fontSize: '0.8rem' }}>Font</label>
                  <select 
                    className="input-field" 
                    style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                    value={resumeData.theme?.fontFamily || "'Inter', sans-serif"}
                    onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                  >
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Merriweather', serif">Merriweather</option>
                    <option value="'Outfit', sans-serif">Outfit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* === PERSONAL TAB === */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Target Job Role</label>
                  <input className="input-field" value={targetJob} onChange={(e) => setTargetJob(e.target.value)} placeholder="e.g. Senior Software Engineer" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input-field" value={resumeData.personalInfo.name || ''} onChange={(e) => updatePersonalInfo({ name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input className="input-field" type="email" value={resumeData.personalInfo.email || ''} onChange={(e) => updatePersonalInfo({ email: e.target.value })} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input-field" value={resumeData.personalInfo.phone || ''} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input className="input-field" value={resumeData.personalInfo.location || ''} onChange={(e) => updatePersonalInfo({ location: e.target.value })} placeholder="City, State" />
                  </div>
                  <div>
                    <label className="label">LinkedIn</label>
                    <input className="input-field" value={resumeData.personalInfo.linkedin || ''} onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" />
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <input className="input-field" value={resumeData.personalInfo.website || ''} onChange={(e) => updatePersonalInfo({ website: e.target.value })} placeholder="johndoe.dev" />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="label">Professional Summary</label>
                    <button onClick={handleAIAssist} disabled={isGenerating} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      <Sparkles size={12} style={{ marginRight: '0.25rem' }} />
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                  <textarea className="input-field" rows={4} value={resumeData.personalInfo.summary || ''} onChange={(e) => updatePersonalInfo({ summary: e.target.value })} placeholder="Write a brief summary..." />
                </div>
              </div>
            )}

            {/* === EXPERIENCE TAB === */}
            {activeTab === 'experience' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 600 }}>Experience</h4>
                  <button onClick={() => addExperience({ company: '', role: '', date: '', bullets: [''] })} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add
                  </button>
                </div>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.25rem' }}>
                      {index > 0 && (
                        <button onClick={() => moveExperience(index, index - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', opacity: 0.5, padding: '0.2rem' }} title="Move up">
                          <ChevronUp size={14} />
                        </button>
                      )}
                      {index < resumeData.experience.length - 1 && (
                        <button onClick={() => moveExperience(index, index + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', opacity: 0.5, padding: '0.2rem' }} title="Move down">
                          <ChevronDown size={14} />
                        </button>
                      )}
                      <button onClick={() => removeExperience(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem', paddingRight: '4rem' }}>
                      <div>
                        <label className="label">Company</label>
                        <input className="input-field" value={exp.company || ''} onChange={(e) => updateExperience(index, { company: e.target.value })} placeholder="e.g. Google" />
                      </div>
                      <div>
                        <label className="label">Role</label>
                        <input className="input-field" value={exp.role || ''} onChange={(e) => updateExperience(index, { role: e.target.value })} placeholder="e.g. Software Engineer" />
                      </div>
                      <div>
                        <label className="label">Dates</label>
                        <input className="input-field" value={exp.date || ''} onChange={(e) => updateExperience(index, { date: e.target.value })} placeholder="e.g. 2020 - Present" />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="label" style={{ marginBottom: 0 }}>Bullets (one per line)</label>
                        <button onClick={() => handleEnhanceBullets(index)} disabled={enhancingIndex === index} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--primary)' }}>
                          <Sparkles size={12} style={{ marginRight: '0.25rem' }} />
                          {enhancingIndex === index ? 'Enhancing...' : 'Enhance AI'}
                        </button>
                      </div>
                      <textarea className="input-field" rows={3} value={exp.bullets ? exp.bullets.join('\n') : ''} onChange={(e) => updateExperience(index, { bullets: e.target.value.split('\n') })} placeholder={"Developed new features...\nLed a team of 5..."} />
                    </div>
                  </div>
                ))}
                {resumeData.experience.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No experience added yet. Click "Add" to get started.</div>
                )}
              </div>
            )}

            {/* === EDUCATION TAB === */}
            {activeTab === 'education' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 600 }}>Education</h4>
                  <button onClick={() => addEducation({ school: '', degree: '', gradYear: '' })} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add
                  </button>
                </div>
                {resumeData.education.map((edu, index) => (
                  <div key={index} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.25rem' }}>
                      {index > 0 && (
                        <button onClick={() => moveEducation(index, index - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', opacity: 0.5, padding: '0.2rem' }} title="Move up"><ChevronUp size={14} /></button>
                      )}
                      {index < resumeData.education.length - 1 && (
                        <button onClick={() => moveEducation(index, index + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', opacity: 0.5, padding: '0.2rem' }} title="Move down"><ChevronDown size={14} /></button>
                      )}
                      <button onClick={() => removeEducation(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}><Trash2 size={14} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', paddingRight: '4rem' }}>
                      <div>
                        <label className="label">School / University</label>
                        <input className="input-field" value={edu.school || ''} onChange={(e) => updateEducation(index, { school: e.target.value })} placeholder="e.g. Stanford University" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="label">Degree</label>
                          <input className="input-field" value={edu.degree || ''} onChange={(e) => updateEducation(index, { degree: e.target.value })} placeholder="e.g. BS Computer Science" />
                        </div>
                        <div>
                          <label className="label">Graduation Year</label>
                          <input className="input-field" value={edu.gradYear || ''} onChange={(e) => updateEducation(index, { gradYear: e.target.value })} placeholder="e.g. 2024" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {resumeData.education.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No education added yet.</div>
                )}
              </div>
            )}

            {/* === SKILLS TAB === */}
            {activeTab === 'skills' && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Skills</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    className="input-field" 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() } }}
                    placeholder="Type a skill and press Enter" 
                    style={{ flex: 1 }}
                  />
                  <button onClick={handleAddSkill} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(resumeData.skills || []).map((skill, idx) => (
                    <span key={idx} style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.35rem 0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--primary)'
                    }}>
                      {skill}
                      <button onClick={() => removeSkill(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, lineHeight: 1, fontSize: '1rem' }}>×</button>
                    </span>
                  ))}
                </div>
                {(resumeData.skills || []).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No skills added yet. Start typing above!</div>
                )}
              </div>
            )}

            {/* === PROJECTS TAB === */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 600 }}>Projects</h4>
                  <button onClick={() => addProject({ name: '', description: '', link: '' })} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add
                  </button>
                </div>
                {(resumeData.projects || []).map((proj, index) => (
                  <div key={index} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.25rem' }}>
                      {index > 0 && <button onClick={() => moveProject(index, index - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '0.2rem' }}><ChevronUp size={14} /></button>}
                      {index < (resumeData.projects || []).length - 1 && <button onClick={() => moveProject(index, index + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '0.2rem' }}><ChevronDown size={14} /></button>}
                      <button onClick={() => removeProject(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}><Trash2 size={14} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingRight: '4rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="label">Project Name</label>
                        <input className="input-field" value={proj.name || ''} onChange={(e) => updateProject(index, { name: e.target.value })} placeholder="e.g. E-commerce App" />
                      </div>
                      <div>
                        <label className="label">Link (optional)</label>
                        <input className="input-field" value={proj.link || ''} onChange={(e) => updateProject(index, { link: e.target.value })} placeholder="github.com/..." />
                      </div>
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea className="input-field" rows={2} value={proj.description || ''} onChange={(e) => updateProject(index, { description: e.target.value })} placeholder="Built a full-stack..." />
                    </div>
                  </div>
                ))}
                {(resumeData.projects || []).length === 0 && <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No projects added yet.</div>}
              </div>
            )}

            {/* === CERTIFICATIONS TAB === */}
            {activeTab === 'certifications' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 600 }}>Certifications</h4>
                  <button onClick={() => addCertification({ name: '', issuer: '', date: '' })} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add
                  </button>
                </div>
                {(resumeData.certifications || []).map((cert, index) => (
                  <div key={index} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <button onClick={() => removeCertification(index)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', paddingRight: '2rem' }}>
                      <div>
                        <label className="label">Name</label>
                        <input className="input-field" value={cert.name || ''} onChange={(e) => updateCertification(index, { name: e.target.value })} placeholder="AWS Certified" />
                      </div>
                      <div>
                        <label className="label">Issuer</label>
                        <input className="input-field" value={cert.issuer || ''} onChange={(e) => updateCertification(index, { issuer: e.target.value })} placeholder="Amazon" />
                      </div>
                      <div>
                        <label className="label">Date</label>
                        <input className="input-field" value={cert.date || ''} onChange={(e) => updateCertification(index, { date: e.target.value })} placeholder="2024" />
                      </div>
                    </div>
                  </div>
                ))}
                {(resumeData.certifications || []).length === 0 && <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No certifications added yet.</div>}
              </div>
            )}

            {/* === LANGUAGES TAB === */}
            {activeTab === 'languages' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 600 }}>Languages</h4>
                  <button onClick={() => addLanguage({ name: '', proficiency: '' })} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add
                  </button>
                </div>
                {(resumeData.languages || []).map((lang, index) => (
                  <div key={index} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <button onClick={() => removeLanguage(index)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingRight: '2rem' }}>
                      <div>
                        <label className="label">Language</label>
                        <input className="input-field" value={lang.name || ''} onChange={(e) => updateLanguage(index, { name: e.target.value })} placeholder="English" />
                      </div>
                      <div>
                        <label className="label">Proficiency</label>
                        <select className="input-field" value={lang.proficiency || ''} onChange={(e) => updateLanguage(index, { proficiency: e.target.value })}>
                          <option value="">Select (optional)</option>
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {(resumeData.languages || []).length === 0 && <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No languages added yet.</div>}
              </div>
            )}

            {/* === CUSTOM SECTIONS TAB === */}
            {activeTab === 'custom' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 600 }}>Custom Sections</h4>
                  <button onClick={() => addCustomSection({ title: '', content: '' })} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add Section
                  </button>
                </div>
                {(resumeData.customSections || []).map((section, index) => (
                  <div key={index} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <button onClick={() => removeCustomSection(index)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    <div style={{ paddingRight: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <label className="label">Section Title</label>
                        <input className="input-field" value={section.title || ''} onChange={(e) => updateCustomSection(index, { title: e.target.value })} placeholder="e.g. Volunteer Work, Publications..." />
                      </div>
                      <div>
                        <label className="label">Content</label>
                        <textarea className="input-field" rows={4} value={section.content || ''} onChange={(e) => updateCustomSection(index, { content: e.target.value })} placeholder="Add your content here..." />
                      </div>
                    </div>
                  </div>
                ))}
                {(resumeData.customSections || []).length === 0 && <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No custom sections. Add one for unique content like Volunteer Work, Publications, Awards, etc.</div>}
              </div>
            )}

            {/* === ATS CHECK TAB === */}
            {activeTab === 'ats' && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ClipboardCheck size={20} /> ATS Score Checker
                </h4>
                <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Paste a job description below and our AI will analyze how well your resume matches.
                </p>
                <textarea 
                  className="input-field" 
                  rows={6} 
                  value={atsJobDesc} 
                  onChange={(e) => setAtsJobDesc(e.target.value)} 
                  placeholder="Paste the job description here..."
                  style={{ marginBottom: '1rem' }}
                />
                <button onClick={handleATSCheck} className="btn-primary" disabled={atsLoading} style={{ width: '100%', marginBottom: '1.5rem' }}>
                  {atsLoading ? 'Analyzing...' : 'Analyze Resume'}
                </button>

                {atsResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Score */}
                    <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: 'var(--radius-md)', background: atsResult.score >= 70 ? 'rgba(22,163,74,0.1)' : atsResult.score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${atsResult.score >= 70 ? '#16a34a' : atsResult.score >= 40 ? '#f59e0b' : '#ef4444'}30` }}>
                      <div style={{ fontSize: '3rem', fontWeight: 800, color: atsResult.score >= 70 ? '#16a34a' : atsResult.score >= 40 ? '#f59e0b' : '#ef4444' }}>
                        {atsResult.score}%
                      </div>
                      <div style={{ fontWeight: 500 }}>ATS Match Score</div>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <h5 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Summary</h5>
                      <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{atsResult.summary}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ padding: '1rem', border: '1px solid #16a34a30', borderRadius: 'var(--radius-md)', background: 'rgba(22,163,74,0.05)' }}>
                        <h5 style={{ fontWeight: 600, color: '#16a34a', marginBottom: '0.5rem' }}>✓ Matched Keywords</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {atsResult.matchedKeywords?.map((kw, i) => (
                            <span key={i} style={{ padding: '0.15rem 0.5rem', backgroundColor: 'rgba(22,163,74,0.1)', borderRadius: '999px', fontSize: '0.8rem', color: '#16a34a' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ padding: '1rem', border: '1px solid #ef444430', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.05)' }}>
                        <h5 style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>✗ Missing Keywords</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {atsResult.missingKeywords?.map((kw, i) => (
                            <span key={i} style={{ padding: '0.15rem 0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '999px', fontSize: '0.8rem', color: '#ef4444' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <h5 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>💡 Suggestions</h5>
                      <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                        {atsResult.suggestions?.map((s, i) => (
                          <li key={i} style={{ marginBottom: '0.3rem' }}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* === AI RECOMMENDATIONS TAB === */}
            {activeTab === 'recommendations' && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={20} /> AI Recommendations
                </h4>
                <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Get personalized AI-powered suggestions to strengthen your resume.
                </p>
                <button onClick={handleGetRecommendations} className="btn-primary" disabled={recsLoading} style={{ width: '100%', marginBottom: '1.5rem' }}>
                  <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
                  {recsLoading ? 'Analyzing your resume...' : 'Get AI Recommendations'}
                </button>

                {recsResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Overall Rating */}
                    <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: 'var(--radius-md)', background: recsResult.overallRating >= 7 ? 'rgba(22,163,74,0.1)' : recsResult.overallRating >= 4 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${recsResult.overallRating >= 7 ? '#16a34a' : recsResult.overallRating >= 4 ? '#f59e0b' : '#ef4444'}30` }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: recsResult.overallRating >= 7 ? '#16a34a' : recsResult.overallRating >= 4 ? '#f59e0b' : '#ef4444' }}>
                        {recsResult.overallRating}/10
                      </div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Overall Resume Rating</div>
                    </div>

                    {/* Strengths */}
                    {recsResult.strengths?.length > 0 && (
                      <div style={{ padding: '1rem', border: '1px solid #16a34a30', borderRadius: 'var(--radius-md)', background: 'rgba(22,163,74,0.05)' }}>
                        <h5 style={{ fontWeight: 600, color: '#16a34a', marginBottom: '0.5rem' }}>💪 Strengths</h5>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                          {recsResult.strengths.map((s, i) => (
                            <li key={i} style={{ marginBottom: '0.3rem' }}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {recsResult.recommendations?.length > 0 && (
                      <div>
                        <h5 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>📋 Recommendations</h5>
                        {recsResult.recommendations.map((rec, i) => {
                          const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#3b82f6' }
                          return (
                            <div key={i} style={{ padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', borderLeft: `3px solid ${priorityColors[rec.priority] || '#3b82f6'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                <strong style={{ fontSize: '0.9rem' }}>{rec.title}</strong>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <span style={{ padding: '0.1rem 0.4rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: `${priorityColors[rec.priority]}15`, color: priorityColors[rec.priority] }}>
                                    {rec.priority}
                                  </span>
                                  <span style={{ padding: '0.1rem 0.4rem', borderRadius: '999px', fontSize: '0.7rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                                    {rec.category}
                                  </span>
                                </div>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>{rec.description}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Suggested Skills */}
                    {recsResult.suggestedSkills?.length > 0 && (
                      <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <h5 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>🎯 Suggested Skills to Add</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {recsResult.suggestedSkills.map((skill, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (!(resumeData.skills || []).includes(skill)) {
                                  addSkill(skill)
                                  toast.success(`Added "${skill}" to your skills!`)
                                } else {
                                  toast.info(`"${skill}" is already in your skills.`)
                                }
                              }}
                              style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)', cursor: 'pointer', transition: 'all 0.2s' }}
                              title="Click to add this skill"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improved Summary */}
                    {recsResult.improvedSummary && recsResult.improvedSummary.trim() !== '' && (
                      <div style={{ padding: '1rem', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)' }}>
                        <h5 style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>✨ Suggested Summary</h5>
                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                          &quot;{recsResult.improvedSummary}&quot;
                        </p>
                        <button
                          onClick={() => {
                            updatePersonalInfo({ summary: recsResult.improvedSummary })
                            toast.success("Summary updated!")
                          }}
                          className="btn-primary"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                        >
                          Apply This Summary
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div style={{ flex: 1, background: 'var(--border)', padding: '1.5rem', overflowY: 'auto', minWidth: 0 }}>
          <div style={{ 
            width: '100%', 
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            transform: 'scale(0.8)',
            transformOrigin: 'top center'
          }}>
            <div ref={printRef} style={{ width: '100%' }}>
              <ResumeTemplate resumeData={resumeData} targetJob={targetJob} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage({ params }) {
  return (
    <ToastProvider>
      <EditorContent params={params} />
    </ToastProvider>
  )
}
