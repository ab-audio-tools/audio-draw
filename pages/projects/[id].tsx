/**
 * Project Editor Page
 * Main audio patchbay editor interface
 */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/hooks/useEditorStore';
import { fetchProject, updateProject, createProject } from '@/lib/api';
import { parseProjectData } from '@/lib/deviceSchema';
import { exportCanvasToPNG, exportCanvasToSVG, exportProjectJSON, importProjectJSON } from '@/lib/export';
import { toast } from '@/hooks/use-toast';
import Toolbar from '@/components/Toolbar';
import DevicesPalette from '@/components/DevicesPalette';

// Dynamically import EditorCanvas to avoid SSR issues with React Flow
const EditorCanvas = dynamic(() => import('@/components/EditorCanvas'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center">Loading editor...</div>,
});

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const editorRef = useRef<HTMLDivElement>(null);
  
  const {
    nodes,
    edges,
    viewport,
    projectId,
    projectName,
    setProjectId,
    setProjectName,
    loadProject,
    setIsDirty,
  } = useEditorStore();

  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load project on mount
  useEffect(() => {
    if (id && id !== 'new' && typeof id === 'string') {
      loadExistingProject(id);
    } else if (id === 'new') {
      // New project
      setProjectId(null);
      setProjectName('Untitled Project');
      loadProject([], [], { x: 0, y: 0, zoom: 1 });
    }
  }, [id]);

  async function loadExistingProject(projectId: string) {
    try {
      const project = await fetchProject(projectId);
      const data = parseProjectData(project.data);
      
      setProjectId(project.id);
      setProjectName(project.name);
      loadProject(data.nodes, data.edges, data.viewport);
      
      toast({
        title: 'Project Loaded',
        description: `Loaded "${project.name}"`,
      });
    } catch (error) {
      console.error('Failed to load project:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project',
      });
      router.push('/');
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const projectData = {
        version: '1.0.0',
        nodes,
        edges,
        viewport,
      };

      const data = JSON.stringify(projectData);

      if (projectId) {
        // Update existing project
        await updateProject(projectId, {
          name: projectName,
          data,
        });
        toast({
          title: 'Saved',
          description: 'Project saved successfully',
        });
      } else {
        // Create new project
        const newProject = await createProject({
          name: projectName,
          data,
        });
        setProjectId(newProject.id);
        router.replace(`/projects/${newProject.id}`, undefined, { shallow: true });
        toast({
          title: 'Created',
          description: 'New project created',
        });
      }

      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleExportPNG() {
    if (!editorRef.current) return;
    
    try {
      const canvas = editorRef.current.querySelector('.react-flow') as HTMLElement;
      if (canvas) {
        await exportCanvasToPNG(canvas, `${projectName}.png`);
        toast({
          title: 'Exported',
          description: 'Canvas exported as PNG',
        });
      }
    } catch (error) {
      console.error('Failed to export PNG:', error);
      toast({
        title: 'Error',
        description: 'Failed to export PNG',
      });
    }
  }

  async function handleExportSVG() {
    if (!editorRef.current) return;
    
    try {
      const canvas = editorRef.current.querySelector('.react-flow') as HTMLElement;
      if (canvas) {
        await exportCanvasToSVG(canvas, `${projectName}.svg`);
        toast({
          title: 'Exported',
          description: 'Canvas exported as SVG',
        });
      }
    } catch (error) {
      console.error('Failed to export SVG:', error);
      toast({
        title: 'Error',
        description: 'Failed to export SVG',
      });
    }
  }

  function handleExportJSON() {
    const projectData = {
      version: '1.0.0',
      nodes,
      edges,
      viewport,
    };
    
    exportProjectJSON(projectData, projectName);
    toast({
      title: 'Exported',
      description: 'Project exported as JSON',
    });
  }

  function handleImportJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const data = await importProjectJSON(file);
        loadProject(data.nodes, data.edges, data.viewport);
        toast({
          title: 'Imported',
          description: 'Project imported successfully',
        });
      } catch (error) {
        console.error('Failed to import:', error);
        toast({
          title: 'Error',
          description: 'Failed to import project',
        });
      }
    };
    
    input.click();
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, viewport, projectId, projectName]);

  // Create page title
  const pageTitle = `${projectName || 'Untitled'} - Audio Draw`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className="flex h-screen flex-col">
        <Toolbar
          onSave={handleSave}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
        />

        <div className="flex flex-1 overflow-hidden">
          <DevicesPalette onAddDevice={() => setShowDeviceModal(true)} />
          
          <div ref={editorRef} className="flex-1">
            <EditorCanvas onSave={handleSave} />
          </div>
        </div>
      </div>
    </>
  );
}
