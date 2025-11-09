import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * API Route: GET /api/projects/[id]
 * Returns a single project by ID (includes full data)
 * 
 * API Route: PUT /api/projects/[id]
 * Updates a project
 * 
 * API Route: DELETE /api/projects/[id]
 * Deletes a project
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, description, data, thumbnailUrl } = req.body;

      // Validate data if provided
      if (data) {
        try {
          JSON.parse(data);
        } catch {
          return res.status(400).json({ error: 'Invalid data format' });
        }
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(data && { data }),
          ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        },
      });

      return res.status(200).json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Failed to update project' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.project.delete({
        where: { id },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
