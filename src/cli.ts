#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import * as path from 'path';
import { NotionService } from './services/notionService';
import { ImageProcessor } from './services/imageProcessor';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('notion-image-uploader')
  .description('Upload folders of images to Notion')
  .version('1.0.0');

program
  .command('upload')
  .description('Upload images from a folder to Notion')
  .argument('<folder>', 'Path to the folder containing images')
  .option('-r, --recursive', 'Include images in subfolders', false)
  .option(
    '-e, --extensions <extensions>',
    'Comma-separated list of file extensions (default: jpg,jpeg,png,gif,webp,bmp,svg)'
  )
  .option('-k, --api-key <key>', 'Notion API key (overrides .env)')
  .option('-d, --database-id <id>', 'Notion database ID (overrides .env)')
  .action(async (folder: string, options) => {
    try {
      // Get configuration
      const apiKey = options.apiKey || process.env.NOTION_API_KEY;
      const databaseId = options.databaseId || process.env.NOTION_DATABASE_ID;

      if (!apiKey) {
        console.error('Error: NOTION_API_KEY is required. Set it in .env or use --api-key');
        process.exit(1);
      }

      if (!databaseId) {
        console.error('Error: NOTION_DATABASE_ID is required. Set it in .env or use --database-id');
        process.exit(1);
      }

      // Resolve folder path
      const folderPath = path.resolve(folder);
      console.log(`\n📁 Scanning folder: ${folderPath}`);

      // Find images
      const extensions = options.extensions
        ? options.extensions.split(',').map((ext: string) => ext.trim())
        : undefined;

      const images = await ImageProcessor.findImages(folderPath, {
        recursive: options.recursive,
        extensions,
      });

      if (images.length === 0) {
        console.log('\n❌ No images found in the specified folder.');
        process.exit(0);
      }

      // Show summary
      const summary = await ImageProcessor.getFolderSummary(folderPath, images);
      console.log(`\n📊 Found ${summary.totalImages} image(s):`);
      for (const [ext, count] of summary.fileTypes.entries()) {
        console.log(`   • ${ext.toUpperCase()}: ${count} file(s)`);
      }
      console.log(`   Total size: ${(summary.totalSize / (1024 * 1024)).toFixed(2)} MB`);

      // Initialize Notion service
      console.log('\n🔗 Connecting to Notion...');
      const notionService = new NotionService({ apiKey, databaseId });

      // Verify connection
      const verification = await notionService.verifyConnection();
      if (!verification.success) {
        console.error(`\n❌ Failed to connect to Notion: ${verification.error}`);
        process.exit(1);
      }
      console.log('✓ Connected successfully');

      // Upload images
      console.log(`\n⬆️  Uploading ${images.length} image(s)...\n`);
      const results = await notionService.uploadImagesFromFolder(folderPath, images);

      // Show results
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      console.log('\n' + '='.repeat(50));
      console.log('📈 Upload Summary:');
      console.log(`   ✓ Successful: ${successful}`);
      if (failed > 0) {
        console.log(`   ✗ Failed: ${failed}`);
      }
      console.log('='.repeat(50) + '\n');

      if (failed > 0) {
        console.log('Failed uploads:');
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            console.log(`   • ${r.fileName}: ${r.error}`);
          });
        console.log();
      }
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('test-connection')
  .description('Test connection to Notion')
  .option('-k, --api-key <key>', 'Notion API key (overrides .env)')
  .option('-d, --database-id <id>', 'Notion database ID (overrides .env)')
  .action(async (options) => {
    try {
      const apiKey = options.apiKey || process.env.NOTION_API_KEY;
      const databaseId = options.databaseId || process.env.NOTION_DATABASE_ID;

      if (!apiKey) {
        console.error('Error: NOTION_API_KEY is required. Set it in .env or use --api-key');
        process.exit(1);
      }

      if (!databaseId) {
        console.error('Error: NOTION_DATABASE_ID is required. Set it in .env or use --database-id');
        process.exit(1);
      }

      console.log('\n🔗 Testing connection to Notion...');
      const notionService = new NotionService({ apiKey, databaseId });
      const result = await notionService.verifyConnection();

      if (result.success) {
        console.log('✓ Connection successful! Your Notion configuration is working.\n');
      } else {
        console.error(`✗ Connection failed: ${result.error}\n`);
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse();
