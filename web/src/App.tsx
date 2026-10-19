import { useEffect } from 'react'
import { WebSocketProvider } from './context/WebSocketContext'
import { useWorldStore } from './store/worldStore'
import { useUIStore } from './store/uiStore'
import { Globe } from './components/Globe/globe'
import type { Region } from './types/region'

function AppInner() {

  const setRegion = useWorldStore((s) => s.setRegions)
  const selectedRegionId = useUIStore((s) => s.selectedRegionId)
  const setSelectedRegionId = useUIStore((s) => s.setSelectedRegionId)
  const regions = useWorldStore((s) => s.regions)

  // Load Regions On Startup
  useEffect(() => {
    fetch('api/regions')
      .then((r) => r.json())
      .then((data: Region[]) => setRegion(data))
      .then((err) => console.log("Failed To Load Region:", err))
  }, [])

  const selectedRegion = regions.find((r) => r.id === selectedRegionId)

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      width: '100vw',
      alignItems: 'center',
      background: 'var(--color-bg-primary)',
      overflow: 'hidden',
    }}>

      {/* Globe: Always Visible, Centered Or Shifted Left When Panel Is Open */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.4s ease',
      }}>
        <Globe />
      </div>

      {/* Pulse Panel: Slides In From The Right When A Region Is Selected */}
      { selectedRegion && (
        <div style={{ 
          width: '380px',
          height: '100vh',
          background: 'var(--color-bg-secondary)',
          borderLeft: '1px solid var(--color-border)',
          padding: '1.5rem',
          overflowY: 'auto',
          animation: 'slideIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem'}}>
              {selectedRegion?.name}
            </h2>
            <button
              onClick={() => setSelectedRegionId(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              x
            </button>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            Pulse Panel Up Next...
          </p>
        </div>
      )}
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
