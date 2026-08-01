// TypeScript Wrapper For Streams
export interface Stream {
    id: number
    name: string
    url: string 
    type: 'video' | 'audio' | 'both'
    category: string
    lat: number 
    lng: number
    current_score: number | null
}