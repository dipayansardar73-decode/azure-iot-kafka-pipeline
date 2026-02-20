import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // In prod, rely on proxy or env var

export interface Device {
    deviceId: string;
    deviceType: string;
    metrics: {
        rpm?: number;
        temperature?: number;
        power?: number;
        status?: string;
        vibration?: number;
        humidity?: number;
        targetTemperature?: number;
        compressor?: string;
        brightness?: number;
        colorTemperature?: number;
    };
    timestamp: string;
}

export const fetchDevices = async (skip = 0, limit = 50): Promise<Device[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/devices`, {
            params: { skip, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching devices:", error);
        return [];
    }
};

export const fetchDeviceDetails = async (deviceId: string): Promise<Device | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/devices/${deviceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching device details for ${deviceId}:`, error);
        return null;
    }
};

export const fetchAnalytics = async (): Promise<any> => {
    // Placeholder - usually fetch aggregated stats
    return {
        totalDevices: 50000,
        avgPower: 124.5,
        alerts: 5
    };
};
