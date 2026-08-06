import { createContext, useContext, useEffect, useRef } from 'react'
import type { WSMessage } from '../types/ws-messages'
import { useWorldStore } from '../store/worldStore'

// Data Exposed By The Conext Is A Single Send Function That Accepts A String Message
interface WSContextValue {
    send: (msg: string) => void
}

// Initialize React Context Object With Send Function
const WSContext = createContext<WSContextValue>({ send: () => {} })

export function WebSocketProvider( { children }: { children: React.ReactNode }) {

    // Store Active WebSocket Instance
    const wsRef = useRef<WebSocket | null>(null)

    // Setters For useWorldStorw
    const updateSentiment = useWorldStore((s) => s.updateSentiment)
    const updateWeather = useWorldStore((s) => s.updateWeather)

    // Run Once The WebSocket Connection Opens
    useEffect(() => {
        function connect() {
            // In Dev Vite Proxies /ws To localhost:8080
            // In Production This Hits The Same Domain The App Is Served From
            const ws = new WebSocket(`ws://${window.location.host}/ws`) 

            // Save The Live Socket Instance
            wsRef.current = ws

            ws.onopen = () => {
                console.log('WebSocket Connected')
            }

            ws.onmessage = (event) => {
                try {
                    // Parse The JSON Text Bytes Sent From The Go Server Over WebSockets 
                    const msg: WSMessage = JSON.parse(event.data)

                    switch (msg.type) {

                        // Load Sentiment Update From The Server In The Frontend
                        // No Data Transformation Needed From Go Server To Type Script Type
                        case 'sentiment_update':
                            updateSentiment(msg.payload)
                            break 
                        
                        // Load Weather Update From The Server In The Frontend
                        // Frontend Receives Data That Is Not Stored In The TypeScript Type So A Transformation Is Necessary  
                        case 'weather_update':
                            updateWeather({
                                region_id: msg.payload.region_id,
                                temperature_c: msg.payload.temperature_c,
                                wind_speed_kmh: msg.payload.wind_speed_kmh,
                                condition_text: msg.payload.condition_text,
                                is_day: msg.payload.is_day,
                            })
                            break
                    }
                } catch (err) {
                    console.log('WebSocket Message Parse Error:', err)
                }
            }

            ws.onclose = () => {
                console.log('WebSocket Closed - Reconnecting In 3s')
                // Exponential Backoff Reconnect
                setTimeout(connect, 3000)
            }

            ws.onerror = (err) => {
                console.error('WebSocket Error:', err)
                ws.close()
            }
        }

        // Call The WebSocket Connect Funtion
        connect()

        // Verify The React Provider Closes The WebSocket Connection
        return () => {
            wsRef.current?.close()
        }
    }, [])

    // Verify Ready State And Open WebSocket Connection Before Transmitting Data
    const send = (msg: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(msg)
        }
    }

    // Give Every Child In The Conext Tree Access To The Send Function
    return <WSContext.Provider value={{ send }}>{ children }</WSContext.Provider>
}

// Allow Any UI Componet To Use The Send Function Via const { send } = useWebSocket()
export const useWebSocket = () => useContext(WSContext)
