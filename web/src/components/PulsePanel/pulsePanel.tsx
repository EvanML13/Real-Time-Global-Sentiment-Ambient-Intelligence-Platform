import { useEffect, useState } from "react";
import { useWorldStore } from "../../store/worldStore";
import { useUIStore } from "../../store/uiStore";
import type { RegionPulseData } from "../../types/region";
import { WeatherCard } from "./weatherCard";
import { TrendingCard } from "./trendingCard";

function SectionLabel ({ children }: { children: React.ReactNode }) {
    return(
        <div style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: '0.5rem',
        }}>
            {children}
        </div>
    )
}

function MoodBar ({ label, value, color }: { label: string, value: number; color: string }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{(value * 100).toFixed(0)}%</span>
            </div>
            <div style={{
                height: '4px',
                background: 'var(--color-bg-primary)',
                borderRadius: '2px',
                overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%',
                    width: `${Math.min(value * 100, 100)}%`,
                    background: color,
                    borderRadius: '2px',
                    transition: 'width 0.5s ease'
                }} />
            </div>
        </div>
    )
}

export function PlusePanel() {

    const selectedRegionId = useUIStore((s) => s.selectedRegionId)
    const setSelectedRegionId = useUIStore((s) => s.setSelectedRegionId)
    const regions = useWorldStore((s) => s.regions)
    const sentiment = useWorldStore((s) => s.sentiment)

    const [pulse, setPulse] = useState<RegionPulseData | null>(null)
    const [loading, setLoading] = useState(false)

    const selectedRegion = regions.find((r) => r.id === selectedRegionId)
    const currentSentiment = selectedRegionId ? sentiment[selectedRegionId] : null

    // Fetch Pulse Data When Region Changes
    useEffect(() => {
        if (!selectedRegionId) {
            setPulse(null)
            return 
        }

        setLoading(true)
        fetch(`/api/regions/${selectedRegionId}/pulse`)
            .then((r) => r.json())
            .then((data: RegionPulseData) => {
                setPulse(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Failed to Fetch Pulse:', err)
                setLoading(false)
            })
    }, [selectedRegionId])

    if (!selectedRegionId) return null

    return (
        <div style={{
            width: '380px',
            height: '100vh',
            background: 'var(--color-bg-secondary)',
            borderLeft: '1px solid var(-color-border)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease',
            flexShrink: 0,
        }}>
            {/* Header */}
            <div style={{
                padding: '1.25rem 1.25rem 1rem',
                borderBottom: '1px solid var(-color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>
                <div>
                    <h2 style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        marginBottom: '0.25rem',
                    }}>
                        {selectedRegion?.name}
                    </h2>
                    {currentSentiment && (
                        <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                        }}>
                            Feeling{' '}
                            <span style={{ color: `var(--color-${currentSentiment.dominant_emotion})`}}>
                                {currentSentiment.dominant_emotion}
                            </span>
                            {' '}· valence {currentSentiment.valence.toFixed(2)}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setSelectedRegionId(null)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        fontSize: '1.1 rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                >
                    x
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="scrollable" style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {loading && (
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                        Loading Pulse Data...
                    </div>
                )}

                {!loading && pulse && (
                    <>
                        {/* Weather */}
                        {pulse.weather && (
                            <section>
                                <SectionLabel>Right Now</SectionLabel>
                                <WeatherCard weather={pulse.weather} />
                            </section>
                        )}

                        {/* Top Threads */}
                        {pulse.top_threads && pulse.top_threads.length > 0 && (
                            <section>
                                <SectionLabel>Discussing</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {pulse.top_threads.map((item, i) => (
                                        <TrendingCard key={item.id} item={item} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Top Headlines */}
                        {pulse.top_headlines && pulse.top_headlines.length > 0 && (
                            <section>
                                <SectionLabel>In The News</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {pulse.top_headlines.map((item, i) => (
                                        <TrendingCard key={item.id} item={item} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Sentiment Details */}
                        {pulse.sentiment && (
                            <section>
                                <SectionLabel>Mood Analysis</SectionLabel>
                                <div style={{
                                    background: 'var(--color-bg-tertiary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    padding: '0.875rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                }}>
                                    <MoodBar label="Valence" value={(pulse.sentiment.valence + 1) / 2} color="var(--color-hopeful)" />
                                    <MoodBar label="Arousal" value={pulse.sentiment.arousal} color="var(--color-excited)" />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                                        Based on {pulse.sentiment.sample_count} posts
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
