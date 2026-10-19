import { useEffect, useRef, useCallback } from "react";
import * as d3geo from 'd3-geo'
import { select } from "d3-selection";
import { feature } from "topojson-client";
import type { Topology } from 'topojson-specification'
import type { Region } from "../../types/region";
import { DEFAULT_REGION_COLOR, GLOBE_OCEAN_COLOR, GRID_LINES_COLOR } from "./sentimentColor";

interface UseGlobeOptions {
    width: number
    height: number 
    onRegionClick: (region: Region) => void
}

interface GlobeState {
    svgRef: React.RefObject<SVGSVGElement | null>
    redraw: (
        regions: Region[],
        sentimentColors: Record<number, string>,
        selectedId: number | null
    ) => void 
}

// Constructor For Using The Globe 
export function useGlobe({ width, height, onRegionClick }: UseGlobeOptions): GlobeState {

    // Store The Raw SVG Element - useRef To Draw Circles, Lines, And Map Countries Inside Of It 
    const svgRef = useRef<SVGSVGElement | null>(null)

    // Store Cartography Math Engines - useRef To Prevent Internal Settings That Change During Rotation From Rerendering 
    const projectionRef = useRef<d3geo.GeoProjection | null>(null)
    const pathRef = useRef<d3geo.GeoPath | null>(null)

    // Store Geometric Border Data - useRef So We Only Need To Download The World Map Once 
    const contriesRef = useRef<GeoJSON.FeatureCollection | null>(null)
    const regionMapRef = useRef<Record<string, Region>>({}) 

    // Store Rotation, Dragging, And Animated Frame - useRef So Data Is Saved Until Update 
    const rotationRef = useRef<[number, number, number]>([0, -20, 0])
    const isDraggingRef = useRef(false)
    const animatedFrameRef = useRef<number>(0)

    useEffect(() => {

        if(!svgRef.current) return 

        const svg = svgRef.current
        const cx = width / 2
        const cy = height / 2
        const radius = Math.min(width, height) / 2 - 20 
        
        // Orthographic Projection To Give The Globe A 3D Appearence
        const projection = d3geo.geoOrthographic()
            .scale(radius)
            .translate([cx, cy])
            .clipAngle(90)
            .rotate(rotationRef.current)

        projectionRef.current = projection
        pathRef.current = d3geo.geoPath(projection)

        // Clear And Set Up SVG Layers
        const svgEl = select(svg)
        svgEl.selectAll('*').remove() 

        // Ocean Sphere
        svgEl.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', radius)
            .attr('fill', GLOBE_OCEAN_COLOR)
            .attr('stroke', 'hsl(220, 30%, 18%)')
            .attr('stroke-width', 1)
            
        // Grid Lines
        const graticule = d3geo.geoGraticule()()
        svgEl.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('fill', 'none')
            .attr('stroke', GRID_LINES_COLOR)
            .attr('stroke-width', 0.5)
            .attr('d', pathRef.current)

        // Country Layer
        svgEl.append('g').attr('class', 'countries')
        
        // Load World Geography
        fetch('/data/world.json')
            .then(r => r.json())
            .then((topology: Topology) => {
                const geo = feature(topology, topology.objects.countries)
                contriesRef.current = geo as GeoJSON.FeatureCollection
            })
            .catch(err => console.error('Failed to Load World Geography: ', err)) 

        // Auto-Rotate When Not Dragging
        function rotate() {
            if (!isDraggingRef.current && projectionRef.current) {
                const r = rotationRef.current
                rotationRef.current = [r[0] + 0.1, r[1], r[2]]
                projectionRef.current.rotate(rotationRef.current)
            }
            animatedFrameRef.current = requestAnimationFrame(rotate)
        }
        animatedFrameRef.current = requestAnimationFrame(rotate)

        // Drag To Rotate 
        let lastX = 0
        let lastY = 0

        svg.addEventListener('mousedown', (e) => {
            isDraggingRef.current = true
            lastX = e.clientX
            lastY = e.clientY
        })

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingRef.current || !projectionRef.current) return
            const dx = e.clientX - lastX
            const dy = e.clientY - lastY
            const r = rotationRef.current
            rotationRef.current = [r[0] + dx * 0.3, r[1] - dy * 0.3, r[2]]
            projectionRef.current.rotate(rotationRef.current)
            lastX = e.clientX
            lastY = e.clientY
        })

        window.addEventListener('mouseup', () => {
            isDraggingRef.current = false
        })

        return () => {
            cancelAnimationFrame(animatedFrameRef.current)
        }
    }, [width, height])

    // Redraw Countries With Current Sentiment Colors When New Live Data Arrives, Called By globe.tsx On Every Animation Frame
    const redraw = useCallback((
        regions: Region[],
        sentimentColors: Record<number, string>,
        selectedId: number | null
         
    ) => {
        if (!svgRef.current || !contriesRef.current || !pathRef.current) return

        // Get The D3 Saved Globe Element To Manipulate It
        const svg = select(svgRef.current)
        const g = svg.select<SVGAElement>('g.countries')
        const path = pathRef.current

        // Create A Lookup Mapping Region ID To Region For Click Handling 
        regionMapRef.current = {}
        regions.forEach(r => { regionMapRef.current[r.id] = r })

        // SPATIAL LOOKUP: Frontend Draws The Globe Via GeoJSON, The Backend Uses The PostGIS SQL Regions Table To Get Sentiment Data - Spatial Look Maps The Regions Table To The Geographic Data

        // Get Geographic Data And Calculate Shape And Color
        g.selectAll<SVGAElement, GeoJSON.Feature>('path')
            .data(contriesRef.current.features)
            .join('path')
            .attr('d', (d) => path(d) ?? '')
            .attr('fill', (_d, i) => {
                // PLACEHOLDER MAPPING - REPLACE WITH POSTGIS SPACIAL LOOKUP
                const region = regions[i % regions.length]
                if (!region) return DEFAULT_REGION_COLOR
                return sentimentColors[region.id] ?? DEFAULT_REGION_COLOR
            })
            .attr('stroke', 'hsl(220, 20%, 25%)')
            .attr('stroke-width', 0.5)
            .attr('cursor', 'pointer')
            .on('click', (_event, _d) => {
                // PLACEHOLDER CLICK - REPLACE WITH SPACIAL LOOKUP
                const region = regions[0]
                if (region) onRegionClick(region)
            })
    }, [onRegionClick])
  
    return { svgRef, redraw}
} 