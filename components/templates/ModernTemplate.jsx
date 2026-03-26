import React, { forwardRef } from 'react'

const ModernTemplate = forwardRef(({ resumeData, targetJob }, ref) => {
  if (!resumeData) return <div ref={ref}>No resume data</div>

  const content = resumeData;
  const theme = content.theme || { color: '#2563eb', fontFamily: "'Inter', sans-serif" };
  const skills = content.skills || [];
  const projects = content.projects || [];
  const certifications = content.certifications || [];
  const languages = content.languages || [];
  const customSections = content.customSections || [];

  const sectionTitle = (text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.color, flexShrink: 0 }} />
      <h3 style={{ fontSize: '13pt', fontWeight: 700, color: theme.color, margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
        {text}
      </h3>
      <div style={{ flex: 1, height: '1px', backgroundColor: `${theme.color}30` }} />
    </div>
  );

  return (
    <div 
      ref={ref} 
      style={{
        width: '100%',
        maxWidth: '8.5in',
        minHeight: '11in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        fontFamily: theme.fontFamily,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontSize: '10.5pt'
      }}
    >
      {/* Modern Header with accent bar */}
      <header style={{ 
        background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`, 
        color: '#ffffff', 
        padding: '1.5in 0.5in 1rem 0.5in',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: '6px', 
          background: `linear-gradient(90deg, ${theme.color}, #ec4899, ${theme.color})`
        }} />
        <h1 style={{ fontSize: '28pt', fontWeight: 800, margin: '0 0 0.25rem 0', letterSpacing: '-1px' }}>
          {content.personalInfo.name || "YOUR NAME"}
        </h1>
        <h2 style={{ fontSize: '14pt', fontWeight: 400, margin: '0 0 0.75rem 0', opacity: 0.9 }}>
          {targetJob || "Professional Title"}
        </h2>
        
        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '9.5pt', opacity: 0.9, flexWrap: 'wrap' }}>
          {content.personalInfo.email && <span>✉ {content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>☎ {content.personalInfo.phone}</span>}
          {content.personalInfo.location && <span>📍 {content.personalInfo.location}</span>}
          {content.personalInfo.linkedin && <span>🔗 {content.personalInfo.linkedin}</span>}
          {content.personalInfo.website && <span>🌐 {content.personalInfo.website}</span>}
        </div>
      </header>

      <div style={{ padding: '1.25rem 0.5in', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Summary */}
        {content.personalInfo.summary && (
          <section>
            {sectionTitle("About")}
            <p style={{ margin: 0, lineHeight: 1.6, color: '#333' }}>
              {content.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <section>
            {sectionTitle("Experience")}
            {content.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: `2px solid ${theme.color}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt', color: '#111' }}>{exp.role}</strong>
                  <span style={{ fontSize: '9.5pt', color: theme.color, fontWeight: 500 }}>{exp.date}</span>
                </div>
                <div style={{ color: '#555', marginBottom: '0.25rem', fontWeight: 500 }}>{exp.company}</div>
                <ul style={{ margin: '0', paddingLeft: '1rem', color: '#333' }}>
                  {exp.bullets?.map((b, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem', lineHeight: 1.5 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <section>
            {sectionTitle("Education")}
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: `2px solid ${theme.color}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt' }}>{edu.school}</strong>
                  <span style={{ fontSize: '9.5pt', color: theme.color }}>{edu.gradYear}</span>
                </div>
                <div style={{ color: '#555' }}>{edu.degree}</div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            {sectionTitle("Skills")}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{ 
                  padding: '0.25rem 0.75rem', 
                  backgroundColor: `${theme.color}12`, 
                  color: theme.color,
                  borderRadius: '999px', 
                  fontSize: '9.5pt',
                  fontWeight: 500
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            {sectionTitle("Projects")}
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '0.6rem', paddingLeft: '1rem', borderLeft: `2px solid ${theme.color}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{proj.name}</strong>
                  {proj.link && <span style={{ fontSize: '9pt', color: theme.color }}>{proj.link}</span>}
                </div>
                <p style={{ margin: '0.15rem 0 0 0', color: '#444', lineHeight: 1.5 }}>{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            {sectionTitle("Certifications")}
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{cert.name}</strong> — {cert.issuer}</span>
                <span style={{ fontSize: '9.5pt', color: theme.color }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            {sectionTitle("Languages")}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {languages.map((lang, idx) => (
                <span key={idx}><strong>{lang.name}</strong> — <span style={{ color: '#555' }}>{lang.proficiency}</span></span>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((section, idx) => (
          <section key={idx}>
            {sectionTitle(section.title || "Custom Section")}
            <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: '#333' }}>{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  )
})

ModernTemplate.displayName = "ModernTemplate"
export default ModernTemplate
