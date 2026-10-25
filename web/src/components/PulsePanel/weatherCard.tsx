import {
    WiDaySunny,
    WiDayCloudyHigh,
    WiDayCloudy,
    WiDaySunnyOvercast,
    WiFog,
    WiDaySleet,
    WiDayRainMix,
    WiDayRainWind,
    WiRainMix,
    WiRainWind,
    WiRain,
    WiDayHail,
    WiHail,
    WiNightSnow,
    WiSnow,
    WiSnowWind,
    WiDayShowers,
    WiShowers,
    WiStormShowers,
    WiThunderstorm,
    WiNightSnowThunderstorm,
    WiNightThunderstorm,
    WiNightClear,
    WiNightAltCloudy,
    WiNightAltCloudyHigh,
    WiNightFog,
    WiNightSleet,
    WiNightRainMix,
    WiNightRainWind,
    WiNightRain,
    WiNightHail,
    WiDaySnow,
    WiNightShowers,
    WiDaySnowThunderstorm,
    WiDayThunderstorm,
} from 'react-icons/wi'
import type { IconType } from 'react-icons'

interface WeatherCardProps {
    weather: {
        temperature_c: number
        condition_text: string
        wind_speed_kmh: number
        is_day: boolean
    }
}

// Lookup For Day Icons 
const dayConditionIcons: Record<string, IconType> = {
    'Clear Sky':                        WiDaySunny,
    'Mainly Clear':                     WiDayCloudyHigh,
    'Partly Cloudy':                    WiDayCloudy,
    'Overcast':                         WiDaySunnyOvercast, 
    'Fog':                              WiFog,
    'Freezing Fog':                     WiFog,
    'Light Drizzle':                    WiDaySleet,
    'Moderate Drizzle':                 WiDayRainMix,
    'Dense Drizzle':                    WiDayRainWind,
    'Light Freezing Drizzle':           WiDaySleet,
    'Dense Freezing Drizzle':           WiDayRainMix,
    'Slight Rain':                      WiRainMix,
    'Moderate Rain':                    WiRainWind,
    'Heavy Rain':                       WiRain,
    'Light Freezing Rain':              WiDayHail,
    'Heavy Freezing Rain':              WiHail,
    'Slight Snow Fall':                 WiDaySnow,
    'Moderate Snow Fall':               WiSnow,
    'Heavy Snow Fall':                  WiSnowWind,
    'Snow Grains':                      WiSnow,
    'Slight Rain Showers':              WiDayShowers,
    'Moderate Rain Showers':            WiShowers,
    'Violent Rain Showers':             WiStormShowers,
    'Slight Snow Showers':              WiSnow,
    'Heavy Snow Showers':               WiSnowWind,
    'Thunderstorm':                     WiThunderstorm,
    'Thunderstorm With Slight Hail':    WiDaySnowThunderstorm,
    'Thunderstorm With Heavy Hail':     WiDayThunderstorm,           
}

// Lookup For Night Icons 
const nightConditionIcons: Record<string, IconType> = {
    'Clear Sky':                        WiNightClear,
    'Mainly Clear':                     WiNightAltCloudy,
    'Partly Cloudy':                    WiNightAltCloudyHigh,
    'Fog':                              WiNightFog,
    'Freezing Fog':                     WiNightFog,
    'Light Drizzle':                    WiNightSleet,
    'Moderate Drizzle':                 WiNightRainMix,
    'Dense Drizzle':                    WiNightRainWind,
    'Light Freezing Drizzle':           WiNightSleet,
    'Dense Freezing Drizzle':           WiNightRainMix,
    'Slight Rain':                      WiNightRainMix,
    'Moderate Rain':                    WiNightRainWind,
    'Heavy Rain':                       WiNightRain,
    'Light Freezing Rain':              WiNightHail,
    'Slight Snow Fall':                 WiNightSnow,
    'Slight Rain Showers':              WiNightShowers,
    'Thunderstorm With Slight Hail':    WiNightSnowThunderstorm,
    'Thunderstorm With Heavy Hail':     WiNightThunderstorm,      
}

export function WeatherCard({ weather }: WeatherCardProps) {

    // If Its Day Use The Day Condition Icons If Its Night Merge The Day Condition Icons With The Night Condition Icons 
    const iconMap: Record<string, IconType> = weather.is_day
        ? dayConditionIcons
        : { ...dayConditionIcons, ...nightConditionIcons }
    // If The Condition Does Not Match The Map Fall Back To The Sunny Icon For Day And Clear Icon For Night
    const WeatherIcon = iconMap[weather.condition_text] ?? (weather.is_day ? WiDaySunny : WiNightClear)

    return (
        <div style={{
            background: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        }}>
            <WeatherIcon size={48} color='var(--color-text-secondary)' />
            <div>
                <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                }}>
                    {Math.round(weather.temperature_c)}°C
                </div>
                <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '0.2rem',
                }}>
                    {weather.condition_text} · {Math.round(weather.wind_speed_kmh)} km/h
                </div>
            </div>
        </div>
    )
}
