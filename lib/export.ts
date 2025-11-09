/**
 * Export Utilities
 * Functions for exporting canvas as PNG/SVG and project as JSON
 */

import { saveAs } from 'file-saver';
import type { ProjectData } from '@/lib/deviceSchema';

// Dynamic import to avoid SSR issues
const getDomToImage = async () => {
  if (typeof window === 'undefined') {
    throw new Error('dom-to-image-more can only be used in browser environment');
  }
  const module = await import('dom-to-image-more');
  return module.default;
};

/**
 * Export canvas as PNG
 */
export async function exportCanvasToPNG(
  element: HTMLElement,
  filename: string = 'audio-setup.png'
): Promise<void> {
  try {
    const domtoimage = await getDomToImage();
    const dataUrl = await domtoimage.toPng(element, {
      quality: 0.95,
      bgcolor: '#ffffff',
    });
    
    saveAs(dataUrl, filename);
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('Failed to export PNG');
  }
}

/**
 * Export canvas as SVG
 */
export async function exportCanvasToSVG(
  element: HTMLElement,
  filename: string = 'audio-setup.svg'
): Promise<void> {
  try {
    const domtoimage = await getDomToImage();
    const dataUrl = await domtoimage.toSvg(element, {
      bgcolor: '#ffffff',
    });
    
    saveAs(dataUrl, filename);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw new Error('Failed to export SVG');
  }
}

/**
 * Export project data as JSON
 */
export function exportProjectJSON(
  projectData: any,
  projectName: string = 'audio-project'
): void {
  const json = JSON.stringify(projectData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${projectName}.json`);
}

/**
 * Import project data from JSON file
 */
export function importProjectJSON(file: File): Promise<ProjectData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ProjectData;
        
        // Validate basic structure
        if (!data.version || !data.nodes || !data.edges) {
          throw new Error('Invalid project file format');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse project file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Generate thumbnail from canvas
 */
export async function generateThumbnail(
  element: HTMLElement,
  width: number = 300,
  height: number = 200
): Promise<string> {
  try {
    const domtoimage = await getDomToImage();
    const dataUrl = await domtoimage.toPng(element, {
      width,
      height,
      quality: 0.8,
      bgcolor: '#ffffff',
    });
    
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    return '';
  }
}
