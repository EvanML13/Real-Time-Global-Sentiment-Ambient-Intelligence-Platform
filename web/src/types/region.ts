// TypeScript Wrapper For Each Regions Info Returned By The Workers
export interface Region {
    id: number
    name: string
    code: string
    center_lat: number
    center_lng: number
}

export interface RegionSentiment {
    region_id: number
    valence: number
    arousal: number
    dominant_emotion: string
}

export interface RegionWeather {
    region_id: number
    temperature_c: number
    wind_speed_kmh: number
    condition_text: string
    is_day: boolean
}

export interface PulseItem {
    id: number
    title: string 
    url: string
    score: number
    type: string
}

export interface RegionPulseData {
    region_id: number
    region_name: string
    sentiment: {
        valence: number
        arousal: number 
        dominant_emotion: string
        sample_count: number
        recorded_at: string
    } | null
    weather: {
        temperature_c: number
        condition_text: string
        wind_speed_kmh: number
        is_day: boolean
        updated_at: string
    } | null
    top_threads: PulseItem[]
    top_headlines: PulseItem[]
}
