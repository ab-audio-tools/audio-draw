/**
 * Home Page - Project Dashboard
 * List and manage audio patchbay projects
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Trash2, Clock } from 'lucide-react';
import { fetchProjects, deleteProject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/deviceSchema';

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Omit<Project, 'data'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  }

  function handleNewProject() {
    router.push('/projects/new');
  }

  function handleOpenProject(id: string) {
    router.push(`/projects/${id}`);
  }

  return (
    <>
      <Head>
        <title>Audio Draw - Audio Patchbay Editor</title>
        <meta name="description" content="Visual audio patchbay editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-5xl font-bold text-gray-900"
            >
              Audio Draw
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Visual Audio Patchbay Editor
            </motion.p>
            
            {/* Quick link to connector showcase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <a
                href="/connectors"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                View Connector Graphics →
              </a>
            </motion.div>
          </div>

          {/* New Project Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <Button onClick={handleNewProject} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Project
            </Button>
          </motion.div>

          {/* Projects Grid */}
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Recent Projects</h2>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-gray-500">Loading projects...</div>
              </div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center"
              >
                <FolderOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-medium text-gray-900">No projects yet</h3>
                <p className="mb-6 text-gray-600">
                  Create your first audio patchbay project to get started
                </p>
                <Button onClick={handleNewProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                  >
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="block w-full text-left"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-purple-50">
                        {project.thumbnailUrl ? (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FolderOpen className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="absolute right-2 top-2 rounded-lg bg-white p-2 opacity-0 shadow-md transition-opacity hover:bg-red-50 group-hover:opacity-100"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
