// TypeScript Wrapper For messages.go
export type WSMessageType =
    |   'sentiment_update'
    |   'stream_rescore'
    |   'pulse_event'
    |   'weather_update'

export interface SentimentUpdatePayload {
    region_id: number
    valence: number 
    arousal: number 
    dominant_emotion: string 
}

export interface StreamRescorePayload {
    category: string
    stream_id: string
    score: number
}

export interface PulseEventPayload {
    region_id: number
    event_type: string
    title: string
    url: string
    score: number
}

export interface WeatherUpdatePayload {
    region_id: number
    region_name: string
    temperature_c: number
    wind_speed_kmh: number
    condition_code: number
    condition_text: string
    is_day: boolean  
}

export type WSMessage =
    | { type: 'sentiment_update'; payload: SentimentUpdatePayload }
    | { type: 'stream_rescore'; payload: StreamRescorePayload}
    | { type: 'pulse_event'; payload: PulseEventPayload }
    | { type: 'weather_update'; payload: WeatherUpdatePayload }
