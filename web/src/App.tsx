import { useEffect } from 'react'
import { WebSocketProvider } from './context/WebSocketContext'
import { useWorldStore } from './store/worldStore'
import { Globe } from './components/Globe/globe'
import { PulsePanel } from './components/PulsePanel/pulsePanel'
import type { Region } from './types/region'

function AppInner() {

  const setRegion = useWorldStore((s) => s.setRegions)

  // Load Regions On Startup
  useEffect(() => {
    fetch('api/regions')
      .then((r) => r.json())
      .then((data: Region[]) => setRegion(data))
      .then((err) => console.log("Failed To Load Region:", err))
  }, [])

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
      }}>
        <Globe />
      </div>

      <PulsePanel />
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
