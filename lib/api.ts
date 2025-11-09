/**
 * API Client
 * Functions for interacting with backend API
 */

import axios from 'axios';
import type { Device, Project } from '@/lib/deviceSchema';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Devices
export async function fetchDevices(): Promise<Device[]> {
  const response = await api.get('/devices');
  return response.data;
}

export async function fetchDevice(id: string): Promise<Device> {
  const response = await api.get(`/devices/${id}`);
  return response.data;
}

export async function createDevice(data: {
  name: string;
  slug: string;
  imageUrl?: string;
  schemaJson: string;
}): Promise<Device> {
  const response = await api.post('/devices', data);
  return response.data;
}

export async function updateDevice(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    imageUrl: string;
    schemaJson: string;
  }>
): Promise<Device> {
  const response = await api.put(`/devices/${id}`, data);
  return response.data;
}

export async function deleteDevice(id: string): Promise<void> {
  await api.delete(`/devices/${id}`);
}

// Projects
export async function fetchProjects(): Promise<
  Omit<Project, 'data'>[]
> {
  const response = await api.get('/projects');
  return response.data;
}

export async function fetchProject(id: string): Promise<Project> {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}

export async function createProject(data: {
  name: string;
  description?: string;
  data: string;
  thumbnailUrl?: string;
}): Promise<Project> {
  const response = await api.post('/projects', data);
  return response.data;
}

export async function updateProject(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    data: string;
    thumbnailUrl: string;
  }>
): Promise<Project> {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
