import { useEffect } from 'react'
import { WebSocketProvider } from './context/WebSocketContext'
import { useWorldStore } from './store/worldStore'
import type { Region } from './types/region'

function AppInner() {

  const setRegion = useWorldStore((s) => s.setRegions)
  const regions = useWorldStore((s) => s.regions)
  const sentiment = useWorldStore((s) => s.sentiment)

  // Load Regions On Startup
  useEffect(() => {
    fetch('api/regions')
      .then((r) => r.json())
      .then((data: Region[]) => setRegion(data))
      .then((err) => console.log("Failed To Load Region:", err))
  }, [])

  // Returned Styled HTML
  return (
    <div style={{ padding: '2rem', color: 'var(--color-text-primary)' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-accent-gold)' }}>
        Atmora
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Backend Connected - {regions.length} regions loaded
      </p>

      {/* Live Sentiment Data As A Sanity Check Before Building The Globe */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {regions.map((region) => {
          const s = sentiment[region.id]
          return (
            <div 
              key={region.id}
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                {region.name}
              </div>
              {s ? (
                <>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    {s.dominant_emotion}
                  </div>
                  <div style={{ color: 'var(----color-text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    valence {s.valence.toFixed(2)} · arousal {s.arousal.toFixed(2)}
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(----color-text-tertiary)', fontSize: '0.85rem' }}>
                  waiting for data...
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <WebSocketProvider>
      <AppInner />
    </WebSocketProvider>
  )
}
