import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react'

const MAP = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
}

export default function WeatherIcon({ name, ...props }) {
  const Icon = MAP[name] || Cloud
  return <Icon {...props} />
}
