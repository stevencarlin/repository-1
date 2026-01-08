import { Client } from '@notionhq/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import mime from 'mime-types';

export interface NotionConfig {
  apiKey: string;
  databaseId: string;
}

export interface ImageUploadResult {
  fileName: string;
  success: boolean;
  pageId?: string;
  error?: string;
}

export class NotionService {
  private client: Client;
  private databaseId: string;

  constructor(config: NotionConfig) {
    this.client = new Client({
      auth: config.apiKey,
    });
    this.databaseId = config.databaseId;
  }

  /**
   * Upload an image to Notion by creating a new page in the database
   */
  async uploadImage(imagePath: string): Promise<ImageUploadResult> {
    const fileName = path.basename(imagePath);

    try {
      // Read the image file
      const imageBuffer = await fs.readFile(imagePath);
      const mimeType = mime.lookup(imagePath) || 'image/jpeg';

      // Create a page in the Notion database with the image
      const response = await this.client.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: fileName,
                },
              },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'image',
            image: {
              type: 'external',
              external: {
                url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
              },
            },
          },
        ],
      });

      return {
        fileName,
        success: true,
        pageId: response.id,
      };
    } catch (error) {
      return {
        fileName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Upload multiple images from a folder
   */
  async uploadImagesFromFolder(
    folderPath: string,
    imageFiles: string[]
  ): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];

    for (const file of imageFiles) {
      const fullPath = path.join(folderPath, file);
      console.log(`Uploading ${file}...`);

      const result = await this.uploadImage(fullPath);
      results.push(result);

      if (result.success) {
        console.log(`✓ ${file} uploaded successfully`);
      } else {
        console.log(`✗ ${file} failed: ${result.error}`);
      }
    }

    return results;
  }

  /**
   * Verify connection to Notion and database access
   */
  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.databases.retrieve({
        database_id: this.databaseId,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
