// 'var(--color-calm)': emotionColors Maping Function To Map Emotions To Colors From index.css -> resolveCSSVar(): Get The Hex Code For The Given Emotion -> hexToHue(): Get The HSL Hue For The Hex Code -> hsl(200, 45%, 38%): Return The Hue Saturation Lightness CSS Color For The Map 

// Map Dominant Emotion To Its CSS Variable Color In index.css Via Record (Maps A Key To A Value)
const emotionColors: Record<string, string> = {
    calm:       'var(--color-calm)',
    curious:    'var(--color-curious)',
    excited:    'var(--color-excited)',
    anxious:    'var(--color-anxious)',
    angry:      'var(--color-angry)',
    grieving:   'var(--color-grieving)',
    hopeful:    'var(--color-hopeful)',
    frustrated: 'var(--color-frustrated)', 
}

// Function To Turn The CSS Variables Into Its Hex Value
function resolveCSSVar(varName: string): string {
    return getComputedStyle(document.documentElement)
        // Read The Hex Code And Remove var() And Trailing Whitespace
        .getPropertyValue(varName.replace('var(', '').replace(')', '').trim()) 
        .trim()
}

// Function To Convert From Hex Code To HSL
function hexToHue(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    if (d === 0) return 0
    let h = 0
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    return Math.round(h * 60 + 360) % 360
}

export function sentimentToColor(
    dominantEmotion: string,
    valence: number,
    isSelected: boolean,
): string {

    // Lookup The CSS Variable Assigned To The Emotion, Default To Calm If Lookup Is Unknown
    const cssVar = emotionColors[dominantEmotion] ?? emotionColors.calm
    // Get The Hex Color From The CSS Variable
    const baseColor = resolveCSSVar(cssVar)
    // Get The Hue From The Hex Code 
    const hue = hexToHue(baseColor)

    // Clamp Valence Between -1.0 And 1.0 To Prevent Faulty Outputs From The LLM
    const v = Math.max(-1, Math.min(1, valence))

    // Valence Controls Saturation And Lightness
    // Emotionally Intense Valence -> More Saturated
    // Moderate Valence -> Lighter, Less Saturated 
    const absValence = Math.abs(v)
    const saturation = 30 + absValence * 50 // 30% To 80% Saturation

    // Negative Valence = Darker, Positive Valence = Lighter, Neutral = Mid
    const lightness = valence >= 0
        ? 35 + valence * 20 // 35% To 55% Lightness For Positive
        : 35 + valence * 15 // 20% To 35% Lightness For Negative

    // Selected Region Gets A Brightness Boost 
    const finalLightness = isSelected ? Math.min(lightness + 15, 77) : lightness

    // Return Hue, Saturation, Lightness (HSL)
    return `hsl(${hue}, ${saturation}%, ${finalLightness}%)`
}