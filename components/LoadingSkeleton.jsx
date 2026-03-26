"use client"

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const skeletonStyle = {
    background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'var(--radius-md)',
  }

  if (type === 'card') {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div className="grid-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="glass glass-panel" style={{ padding: '2rem' }}>
              <div style={{ ...skeletonStyle, width: '60%', height: '1.5rem', marginBottom: '1rem' }} />
              <div style={{ ...skeletonStyle, width: '40%', height: '1rem', marginBottom: '0.75rem' }} />
              <div style={{ ...skeletonStyle, width: '50%', height: '0.875rem' }} />
            </div>
          ))}
        </div>
      </>
    )
  }

  if (type === 'editor') {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ ...skeletonStyle, width: '100%', height: '3rem', marginBottom: '1.5rem' }} />
            <div style={{ ...skeletonStyle, width: '80%', height: '2rem', marginBottom: '1rem' }} />
            <div style={{ ...skeletonStyle, width: '100%', height: '8rem', marginBottom: '1rem' }} />
            <div style={{ ...skeletonStyle, width: '100%', height: '4rem', marginBottom: '1rem' }} />
            <div style={{ ...skeletonStyle, width: '60%', height: '2rem' }} />
          </div>
        </div>
      </>
    )
  }

  if (type === 'text') {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ ...skeletonStyle, width: `${80 - i * 10}%`, height: '1rem' }} />
          ))}
        </div>
      </>
    )
  }

  return null
}
