import { create } from 'zustand'

interface UIState {

    // Which Region Is Currently Sellected In The Pulse Panel
    selectedRegionId: number | null 
    setSelectedRegionId: (id: number | null) => void
        
    // Weither The Ambient Layer Panel Is Open
    ambientOpen: boolean
    setAmbientOpen: (open: boolean) => void
}

// Constructor For UI State
export const useUIState = create<UIState>((set) => ({
    selectedRegionId: null,
    setSelectedRegionId: (id) => set( { selectedRegionId: id }),

    ambientOpen: false,
    setAmbientOpen: (open) => set( { ambientOpen: open }),
})) 
