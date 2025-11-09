import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * API Route: GET /api/projects
 * Returns all projects
 * 
 * API Route: POST /api/projects
 * Creates a new project
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const projects = await prisma.project.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          thumbnailUrl: true,
          createdAt: true,
          updatedAt: true,
          // Don't return data field in list view (can be large)
        },
      });

      return res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, data, thumbnailUrl } = req.body;

      // Validate required fields
      if (!name || !data) {
        return res.status(400).json({ error: 'Missing required fields: name, data' });
      }

      // Validate JSON
      try {
        JSON.parse(data);
      } catch {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Create project
      const project = await prisma.project.create({
        data: {
          name,
          description: description || null,
          data,
          thumbnailUrl: thumbnailUrl || null,
        },
      });

      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
