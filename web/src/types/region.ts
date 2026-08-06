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
