import React, { forwardRef } from 'react'

const TwoColumnTemplate = forwardRef(({ resumeData, targetJob }, ref) => {
  if (!resumeData) return <div ref={ref}>No resume data</div>

  const content = resumeData;
  const theme = content.theme || { color: '#2563eb', fontFamily: "'Inter', sans-serif" };
  const skills = content.skills || [];
  const projects = content.projects || [];
  const certifications = content.certifications || [];
  const languages = content.languages || [];
  const customSections = content.customSections || [];

  const sidebarBg = `${theme.color}08`;

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
        fontSize: '10pt',
        display: 'flex',
      }}
    >
      {/* Left Sidebar */}
      <div style={{ 
        width: '35%', 
        backgroundColor: sidebarBg, 
        padding: '0.5in 0.4in',
        borderRight: `3px solid ${theme.color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Name */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '18pt', fontWeight: 800, color: theme.color, margin: '0 0 0.25rem 0', lineHeight: 1.1 }}>
            {content.personalInfo.name || "YOUR NAME"}
          </h1>
          <div style={{ fontSize: '10pt', color: '#555', fontWeight: 500 }}>
            {targetJob || "Professional Title"}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '9pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem', borderBottom: `1px solid ${theme.color}30`, paddingBottom: '0.2rem' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '9pt', color: '#444' }}>
            {content.personalInfo.email && <div>✉ {content.personalInfo.email}</div>}
            {content.personalInfo.phone && <div>☎ {content.personalInfo.phone}</div>}
            {content.personalInfo.location && <div>📍 {content.personalInfo.location}</div>}
            {content.personalInfo.linkedin && <div>🔗 {content.personalInfo.linkedin}</div>}
            {content.personalInfo.website && <div>🌐 {content.personalInfo.website}</div>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h4 style={{ fontSize: '9pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem', borderBottom: `1px solid ${theme.color}30`, paddingBottom: '0.2rem' }}>Skills</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '9.5pt' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: theme.color, flexShrink: 0 }} />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h4 style={{ fontSize: '9pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem', borderBottom: `1px solid ${theme.color}30`, paddingBottom: '0.2rem' }}>Languages</h4>
            {languages.map((lang, idx) => (
              <div key={idx} style={{ marginBottom: '0.2rem', fontSize: '9.5pt' }}>
                <strong>{lang.name}</strong>
                <div style={{ color: '#666', fontSize: '9pt' }}>{lang.proficiency}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h4 style={{ fontSize: '9pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem', borderBottom: `1px solid ${theme.color}30`, paddingBottom: '0.2rem' }}>Certifications</h4>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: '0.3rem', fontSize: '9.5pt' }}>
                <strong>{cert.name}</strong>
                <div style={{ color: '#666', fontSize: '9pt' }}>{cert.issuer} • {cert.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* Education in sidebar */}
        {content.education.length > 0 && (
          <div>
            <h4 style={{ fontSize: '9pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.4rem', borderBottom: `1px solid ${theme.color}30`, paddingBottom: '0.2rem' }}>Education</h4>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', fontSize: '9.5pt' }}>
                <strong>{edu.school}</strong>
                <div style={{ color: '#555' }}>{edu.degree}</div>
                <div style={{ color: '#888', fontSize: '9pt' }}>{edu.gradYear}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div style={{ flex: 1, padding: '0.5in 0.4in', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Summary */}
        {content.personalInfo.summary && (
          <section>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', borderBottom: `2px solid ${theme.color}`, paddingBottom: '0.2rem' }}>
              Profile
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#333', fontSize: '10pt' }}>
              {content.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <section>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', borderBottom: `2px solid ${theme.color}`, paddingBottom: '0.2rem' }}>
              Professional Experience
            </h3>
            {content.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '10.5pt', color: '#111' }}>{exp.role}</strong>
                  <span style={{ fontSize: '9pt', color: '#888' }}>{exp.date}</span>
                </div>
                <div style={{ color: theme.color, fontWeight: 500, fontSize: '10pt', marginBottom: '0.2rem' }}>{exp.company}</div>
                <ul style={{ margin: '0', paddingLeft: '1rem', color: '#333' }}>
                  {exp.bullets?.map((b, i) => (
                    <li key={i} style={{ marginBottom: '0.15rem', lineHeight: 1.5 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', borderBottom: `2px solid ${theme.color}`, paddingBottom: '0.2rem' }}>
              Projects
            </h3>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '10.5pt' }}>{proj.name}</strong>
                  {proj.link && <span style={{ fontSize: '8.5pt', color: theme.color }}>{proj.link}</span>}
                </div>
                <p style={{ margin: '0.1rem 0 0 0', color: '#444', lineHeight: 1.5, fontSize: '10pt' }}>{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((section, idx) => (
          <section key={idx}>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', borderBottom: `2px solid ${theme.color}`, paddingBottom: '0.2rem' }}>
              {section.title || "Custom Section"}
            </h3>
            <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: '#333', fontSize: '10pt' }}>{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  )
})

TwoColumnTemplate.displayName = "TwoColumnTemplate"
export default TwoColumnTemplate
