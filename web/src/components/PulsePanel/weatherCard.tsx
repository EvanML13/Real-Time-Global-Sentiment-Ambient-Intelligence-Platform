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


