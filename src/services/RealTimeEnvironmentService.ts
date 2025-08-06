/**
 * Real-time Environment Service
 * Provides real-time weather and time of day based on user's location and timezone
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  timezone: string;
  city?: string;
  country?: string;
}

export interface WeatherData {
  condition: 'clear' | 'rain' | 'storm' | 'fog' | 'snow';
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

export interface TimeData {
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  hour: number;
  localTime: Date;
  sunriseTime: Date;
  sunsetTime: Date;
}

export class RealTimeEnvironmentService {
  private static instance: RealTimeEnvironmentService;
  private locationData: LocationData | null = null;
  private lastWeatherUpdate = 0;
  private cachedWeatherData: WeatherData | null = null;
  private weatherUpdateInterval = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  public static getInstance(): RealTimeEnvironmentService {
    if (!RealTimeEnvironmentService.instance) {
      RealTimeEnvironmentService.instance = new RealTimeEnvironmentService();
    }
    return RealTimeEnvironmentService.instance;
  }

  /**
   * Initialize the service by getting user's location
   */
  public async initialize(): Promise<void> {
    try {
      await this.getUserLocation();
      console.log(
        '[RealTimeEnvironmentService] Initialized with location:',
        this.locationData,
      );
    } catch (error) {
      console.warn(
        '[RealTimeEnvironmentService] Failed to get location, using default:',
        error,
      );
      // Use a default location (e.g., New York) if geolocation fails
      this.locationData = {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
        city: 'New York',
        country: 'US',
      };
    }
  }

  /**
   * Get user's location using browser geolocation API
   */
  private async getUserLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            // Get timezone from coordinates using a free service
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            this.locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timezone: timezone,
            };

            // Optionally get city name using reverse geocoding (free service)
            await this.getCityName();
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        error => {
          reject(error);
        },
        { timeout: 10000, enableHighAccuracy: false },
      );
    });
  }

  /**
   * Get city name from coordinates using a free reverse geocoding service
   */
  private async getCityName(): Promise<void> {
    if (!this.locationData) return;

    try {
      // Use a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.locationData.latitude}&lon=${this.locationData.longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'KONIVRER-Game/1.0',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.locationData.city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          'Unknown';
        this.locationData.country =
          data.address?.country_code?.toUpperCase() || 'Unknown';
      }
    } catch (error) {
      console.warn(
        '[RealTimeEnvironmentService] Failed to get city name:',
        error,
      );
    }
  }

  /**
   * Get current real-time weather data
   */
  public async getCurrentWeather(): Promise<WeatherData> {
    if (!this.locationData) {
      await this.initialize();
    }

    const now = Date.now();

    // Return cached data if it's still fresh
    if (
      this.cachedWeatherData &&
      now - this.lastWeatherUpdate < this.weatherUpdateInterval
    ) {
      return this.cachedWeatherData;
    }

    try {
      // Use a free weather service (OpenWeatherMap has a free tier)
      // Note: In production, you'd need an API key, but for this demo we'll simulate
      const weatherData = await this.fetchWeatherData();
      this.cachedWeatherData = weatherData;
      this.lastWeatherUpdate = now;
      return weatherData;
    } catch (error) {
      console.warn(
        '[RealTimeEnvironmentService] Failed to fetch weather, using simulated data:',
        error,
      );
      return this.getSimulatedWeather();
    }
  }

  /**
   * Fetch weather data from a weather service
   */
  private async fetchWeatherData(): Promise<WeatherData> {
    if (!this.locationData) {
      throw new Error('No location data available');
    }

    // For this demo, we'll use a free weather service or simulate
    // In production, you would use a service like OpenWeatherMap, WeatherAPI, etc.

    // Simulate realistic weather based on current conditions
    return this.getSimulatedWeather();
  }

  /**
   * Generate simulated weather data based on time and season
   */
  private getSimulatedWeather(): WeatherData {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();

    // Simulate weather patterns based on time and season
    let condition: WeatherData['condition'] = 'clear';
    let temperature = 20; // Base temperature in Celsius

    // Seasonal adjustments
    if (month >= 11 || month <= 1) {
      // Winter
      temperature -= 10;
      if (Math.random() < 0.3) condition = 'snow';
      else if (Math.random() < 0.4) condition = 'fog';
    } else if (month >= 5 && month <= 7) {
      // Summer
      temperature += 8;
      if (Math.random() < 0.2) condition = 'storm';
    } else {
      // Spring/Fall
      if (Math.random() < 0.3) condition = 'rain';
      else if (Math.random() < 0.1) condition = 'fog';
    }

    // Time-based adjustments
    if (hour >= 6 && hour <= 18) {
      temperature += 5; // Warmer during day
    } else {
      temperature -= 5; // Cooler at night
      if (Math.random() < 0.2) condition = 'fog'; // More fog at night
    }

    return {
      condition,
      temperature,
      humidity: 50 + Math.random() * 40,
      windSpeed: Math.random() * 20,
      description: this.getWeatherDescription(condition),
    };
  }

  /**
   * Get human-readable weather description
   */
  private getWeatherDescription(condition: WeatherData['condition']): string {
    const descriptions = {
      clear: 'Clear sky',
      rain: 'Light rain',
      storm: 'Thunderstorm',
      fog: 'Foggy conditions',
      snow: 'Light snowfall',
    };
    return descriptions[condition];
  }

  /**
   * Get current time of day based on real time and location
   */
  public getCurrentTimeOfDay(): TimeData {
    if (!this.locationData) {
      // Use local time if no location data
      return this.getTimeDataFromDate(new Date());
    }

    // Get current time in the user's timezone
    const now = new Date();
    const localTime = new Date(
      now.toLocaleString('en-US', { timeZone: this.locationData.timezone }),
    );

    return this.getTimeDataFromDate(localTime);
  }

  /**
   * Calculate time of day from a date object
   */
  private getTimeDataFromDate(date: Date): TimeData {
    const hour = date.getHours();

    // Calculate approximate sunrise/sunset times
    // This is a simplified calculation - in production you'd use a solar calculation library
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const sunriseHour = 6 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 1.5; // Varies from ~4:30 to ~7:30
    const sunsetHour = 18 - Math.sin((dayOfYear / 365) * 2 * Math.PI) * 1.5; // Varies from ~16:30 to ~19:30

    const sunriseTime = new Date(date);
    sunriseTime.setHours(Math.floor(sunriseHour), (sunriseHour % 1) * 60, 0, 0);

    const sunsetTime = new Date(date);
    sunsetTime.setHours(Math.floor(sunsetHour), (sunsetHour % 1) * 60, 0, 0);

    let timeOfDay: TimeData['timeOfDay'];

    if (hour >= sunriseHour - 1 && hour < sunriseHour + 1) {
      timeOfDay = 'dawn';
    } else if (hour >= sunriseHour + 1 && hour < sunsetHour - 1) {
      timeOfDay = 'day';
    } else if (hour >= sunsetHour - 1 && hour < sunsetHour + 1) {
      timeOfDay = 'dusk';
    } else {
      timeOfDay = 'night';
    }

    return {
      timeOfDay,
      hour,
      localTime: date,
      sunriseTime,
      sunsetTime,
    };
  }

  /**
   * Get location data
   */
  public getLocationData(): LocationData | null {
    return this.locationData;
  }

  /**
   * Start automatic updates for time and weather
   */
  public startAutomaticUpdates(
    callback: (timeData: TimeData, weatherData: WeatherData) => void,
  ): void {
    // Update every minute for time, every 10 minutes for weather
    const updateInterval = setInterval(async () => {
      try {
        const timeData = this.getCurrentTimeOfDay();
        const weatherData = await this.getCurrentWeather();
        callback(timeData, weatherData);
      } catch (error) {
        console.warn(
          '[RealTimeEnvironmentService] Failed to update environment data:',
          error,
        );
      }
    }, 60000); // Update every minute

    // Store interval ID for cleanup
    (this as any).updateInterval = updateInterval;
  }

  /**
   * Stop automatic updates
   */
  public stopAutomaticUpdates(): void {
    if ((this as any).updateInterval) {
      clearInterval((this as any).updateInterval);
      (this as any).updateInterval = null;
    }
  }
}

export const realTimeEnvironmentService =
  RealTimeEnvironmentService.getInstance();
