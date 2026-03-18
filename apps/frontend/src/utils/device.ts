const DEVICE_ID_KEY = 'chatbox_device_id'

export interface DeviceInfo {
  deviceId: string
  browser: string
  os: string
  language: string
  timezone: string
  screenResolution: string
}

export function generateDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  
  return deviceId
}

export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent
  
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edge')) browser = 'Edge'
  
  let os = 'Unknown'
  if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  
  return {
    deviceId: generateDeviceId(),
    browser: `${browser} ${getBrowserVersion(ua)}`,
    os,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  }
}

function getBrowserVersion(ua: string): string {
  const match = ua.match(/(Chrome|Safari|Firefox|Edge)\/(\d+)/)
  return match ? match[2] : ''
}

export function getDeviceId(): string {
  return generateDeviceId()
}