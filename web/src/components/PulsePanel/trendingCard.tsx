import type { PulseItem } from "../../types/region";

interface TrendingCardProps {
    item: PulseItem
    index: number
} 

export function TrendingCard({ item, index }: TrendingCardProps) {
    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '6px',
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
                cursor: 'pointer',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(-color-accent-gold)'
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(-color-border)'
            }}
        >
            {/* Index Number */}
            <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                fontWeight: 600,
                minWidth: '16px',
                paddingTop: '2px'
            }}>
                {index + 1}
            </span>

            {/* Title */}
            <span style={{
                fontSize: '0.82rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                lineHeight: 1.5,
                flex: 1,
            }}>
                {item.title}
            </span>

            {/* Score Badge Shown For Threads */}
            {item.type === 'thread' && item.score > 0 && (
                <span style={{
                    fontSize: '0.7rem',
                    color: 'var(-color-accent-gold)',
                    alignSelf: 'flex-start',
                    whiteSpace: 'nowrap',
                }}>
                    ↑ {item.score}
                </span>
            )}
        </a>
    )
}
