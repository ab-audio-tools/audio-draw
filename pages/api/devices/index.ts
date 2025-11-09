import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * API Route: GET /api/devices
 * Returns all devices from the database
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const devices = await prisma.device.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      return res.status(200).json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      return res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, slug, imageUrl, schemaJson } = req.body;

      // Validate required fields
      if (!name || !slug || !schemaJson) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate JSON
      try {
        JSON.parse(schemaJson);
      } catch {
        return res.status(400).json({ error: 'Invalid schemaJson format' });
      }

      // Check if slug already exists
      const existing = await prisma.device.findUnique({
        where: { slug },
      });

      if (existing) {
        return res.status(409).json({ error: 'Device with this slug already exists' });
      }

      // Create device
      const device = await prisma.device.create({
        data: {
          name,
          slug,
          imageUrl: imageUrl || null,
          schemaJson,
        },
      });

      return res.status(201).json(device);
    } catch (error) {
      console.error('Error creating device:', error);
      return res.status(500).json({ error: 'Failed to create device' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
