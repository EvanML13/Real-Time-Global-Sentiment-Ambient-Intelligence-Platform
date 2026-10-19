import { useEffect, useRef } from "react";
import { useWorldStore } from "../../store/worldStore";
import { useUIStore } from "../../store/uiStore";
import { sentimentToColor, DEFAULT_REGION_COLOR } from "./sentimentColor";
import { useGlobe } from "./useGlobe";

const GLOBE_SIZE = Math.min(window.innerWidth * 0.6, window.innerHeight * 0.9)

export function Globe() {

    const regions = useWorldStore((s) => s.regions)
    const sentiment = useWorldStore((s) => s.sentiment)
    const selectedRegionId = useUIStore((s) => s.selectedRegionId)
    const setSelectedRegionId = useUIStore((s) => s.setSelectedRegionId)

    // Call The Use Globe Funtion From useGlobe.ts To Handle User Interactions
    const { svgRef, redraw } = useGlobe({
        width: GLOBE_SIZE,
        height: GLOBE_SIZE,
        onRegionClick: (region) => setSelectedRegionId(region.id),
    })

    // Recompute Sentiment Colors Whenever Sentiment Data Or Selection Changes
    const sentimentColorsRef = useRef<Record<number, string>>({})

    useEffect(() => {
        const colors: Record<number, string> = {}

        // Iterate Through Each Region And Get The Sentiment
        regions.forEach((region) => {
            const s = sentiment[region.id]
            if (s) {
                // Get The Color For The Sentiment From sentimentColor.ts
                colors[region.id] = sentimentToColor(
                    s.dominant_emotion,
                    s.valence,
                    selectedRegionId === region.id
                )
            } else {
                // Use Default Color Until Sentiment Data Populates
                colors[region.id] = DEFAULT_REGION_COLOR
            }
        })
        sentimentColorsRef.current = colors
    }, [regions, sentiment, selectedRegionId])

    // Continuously Redraw On Animation Frames So Rotation And Color Updates Work
    useEffect(() => {
        let animFrame: number

        function draw() {
            redraw(regions, sentimentColorsRef.current, selectedRegionId)
            animFrame = requestAnimationFrame(draw)
        }

        animFrame = requestAnimationFrame(draw)
        return() => cancelAnimationFrame(animFrame)
    }, [regions, redraw, selectedRegionId])

    return (
        <svg 
            ref={svgRef}
            width={GLOBE_SIZE}
            height={GLOBE_SIZE}
            style={{ cursor: 'grab', flexShrink: 0 }}
        />
    )
}