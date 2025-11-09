import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * API Route: GET /api/devices/[id]
 * Returns a single device by ID
 * 
 * API Route: PUT /api/devices/[id]
 * Updates a device
 * 
 * API Route: DELETE /api/devices/[id]
 * Deletes a device
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid device ID' });
  }

  if (req.method === 'GET') {
    try {
      const device = await prisma.device.findUnique({
        where: { id },
      });

      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      return res.status(200).json(device);
    } catch (error) {
      console.error('Error fetching device:', error);
      return res.status(500).json({ error: 'Failed to fetch device' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, slug, imageUrl, schemaJson } = req.body;

      // Validate schemaJson if provided
      if (schemaJson) {
        try {
          JSON.parse(schemaJson);
        } catch {
          return res.status(400).json({ error: 'Invalid schemaJson format' });
        }
      }

      const device = await prisma.device.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(schemaJson && { schemaJson }),
        },
      });

      return res.status(200).json(device);
    } catch (error) {
      console.error('Error updating device:', error);
      return res.status(500).json({ error: 'Failed to update device' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.device.delete({
        where: { id },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting device:', error);
      return res.status(500).json({ error: 'Failed to delete device' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
