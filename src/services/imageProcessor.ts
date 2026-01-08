import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';

export interface ImageProcessorOptions {
  recursive?: boolean;
  extensions?: string[];
}

export class ImageProcessor {
  private static readonly DEFAULT_IMAGE_EXTENSIONS = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'bmp',
    'svg',
  ];

  /**
   * Find all image files in a folder
   */
  static async findImages(
    folderPath: string,
    options: ImageProcessorOptions = {}
  ): Promise<string[]> {
    const {
      recursive = false,
      extensions = ImageProcessor.DEFAULT_IMAGE_EXTENSIONS,
    } = options;

    // Check if folder exists
    try {
      const stats = await fs.stat(folderPath);
      if (!stats.isDirectory()) {
        throw new Error(`Path is not a directory: ${folderPath}`);
      }
    } catch (error) {
      throw new Error(
        `Cannot access folder: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    // Create glob pattern
    const extPattern = extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}}`;
    const globPattern = recursive
      ? `**/*.${extPattern}`
      : `*.${extPattern}`;

    // Find matching files
    const files = await glob(globPattern, {
      cwd: folderPath,
      nocase: true, // Case-insensitive matching
      absolute: false,
    });

    return files.sort();
  }

  /**
   * Validate that a file is an image
   */
  static async isImageFile(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return false;
      }

      const ext = path.extname(filePath).toLowerCase().slice(1);
      return ImageProcessor.DEFAULT_IMAGE_EXTENSIONS.includes(ext);
    } catch {
      return false;
    }
  }

  /**
   * Get formatted file size
   */
  static async getFileSize(filePath: string): Promise<string> {
    const stats = await fs.stat(filePath);
    const bytes = stats.size;

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Get summary of images in a folder
   */
  static async getFolderSummary(
    folderPath: string,
    images: string[]
  ): Promise<{
    totalImages: number;
    totalSize: number;
    fileTypes: Map<string, number>;
  }> {
    let totalSize = 0;
    const fileTypes = new Map<string, number>();

    for (const image of images) {
      const fullPath = path.join(folderPath, image);
      const stats = await fs.stat(fullPath);
      totalSize += stats.size;

      const ext = path.extname(image).toLowerCase().slice(1);
      fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
    }

    return {
      totalImages: images.length,
      totalSize,
      fileTypes,
    };
  }
}
