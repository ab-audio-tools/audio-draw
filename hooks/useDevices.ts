/**
 * useDevices Hook
 * Manages device library with API and localStorage
 */

import { useState, useEffect } from 'react';
import { fetchDevices, createDevice as apiCreateDevice } from '@/lib/api';
import { parseDevice, type Device, type ParsedDevice } from '@/lib/deviceSchema';

const DEVICES_CACHE_KEY = 'audio-draw-devices';

export function useDevices() {
  const [devices, setDevices] = useState<ParsedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  async function loadDevices() {
    try {
      setLoading(true);
      setError(null);

      // Try loading from localStorage first for offline support
      const cached = localStorage.getItem(DEVICES_CACHE_KEY);
      if (cached) {
        const cachedDevices: Device[] = JSON.parse(cached);
        setDevices(cachedDevices.map(parseDevice));
      }

      // Fetch fresh data from API
      const apiDevices = await fetchDevices();
      const parsedDevices = apiDevices.map(parseDevice);
      setDevices(parsedDevices);

      // Update cache
      localStorage.setItem(DEVICES_CACHE_KEY, JSON.stringify(apiDevices));
    } catch (err) {
      console.error('Failed to load devices:', err);
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  }

  async function createDevice(data: {
    name: string;
    slug: string;
    imageUrl?: string;
    schemaJson: string;
  }) {
    try {
      const newDevice = await apiCreateDevice(data);
      const parsed = parseDevice(newDevice);
      
      setDevices((prev) => [...prev, parsed]);
      
      // Update cache
      const updatedDevices = [...devices, newDevice];
      localStorage.setItem(DEVICES_CACHE_KEY, JSON.stringify(updatedDevices));
      
      return parsed;
    } catch (err) {
      console.error('Failed to create device:', err);
      throw err;
    }
  }

  function getDeviceBySlug(slug: string): ParsedDevice | undefined {
    return devices.find((d) => d.slug === slug);
  }

  function getDeviceById(id: string): ParsedDevice | undefined {
    return devices.find((d) => d.id === id);
  }

  return {
    devices,
    loading,
    error,
    refresh: loadDevices,
    createDevice,
    getDeviceBySlug,
    getDeviceById,
  };
}
