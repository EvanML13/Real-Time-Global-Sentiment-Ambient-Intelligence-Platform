import { create } from 'zustand'
import type { Region, RegionSentiment, RegionWeather } from '../types/region'

interface WorldState {
    // Regions Load On Startup From /api/regions
    // Create Regions List And setRegion To Update The List 
    regions: Region []
    setRegions: (regions: Region[]) => void 

    // Live Sentiment Per Region ID Updated Via WebSocket
    // Create Region Sentiment Variable And updateRegionSentiment To Update It
    sentiment: Record<number, RegionSentiment>
    updateSentiment: (update: RegionSentiment) => void 

    // Live Weather Per Region ID Updated Via WebSocket
    // Create Weather Variable And updateWeather To Update It
    weather: Record<number, RegionWeather>
    updateWeather: (update: RegionWeather) => void
}

// Constructor For WorldState
export const useWorldStore = create<WorldState>((set) => ({
    regions: [],
    setRegions: (regions) => set({ regions }),

    sentiment: {},
    updateSentiment: (update) => 
        set((state) => ({
            sentiment: { ...state.sentiment, [update.region_id]: update },
        })),

    weather: {},
    updateWeather: (update) =>
        set((state) => ({
            weather: { ...state.weather, [update.region_id]: update },
        })),
}))
