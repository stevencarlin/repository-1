# Notion Image Uploader

A standalone Mac application to upload folders of images to Notion databases with a beautiful web interface. Built with TypeScript and Node.js.

## Features

- **🖥️ Standalone Mac App** - Double-click to launch, no terminal commands needed
- **🎨 Beautiful Web GUI** - Drag-and-drop interface that opens in your browser
- **📁 Folder Upload** - Upload entire folders of images with one click
- **🔄 Drag & Drop** - Simply drag folders into the app
- **📊 Progress Tracking** - Real-time upload progress with visual feedback
- **🖼️ Multiple Formats** - Support for JPG, PNG, GIF, WebP, BMP, SVG
- **♻️ Recursive Scanning** - Include images from subfolders
- **✅ Connection Testing** - Verify Notion setup before uploading
- **💻 CLI Alternative** - Command-line interface also available

## Quick Start (Recommended)

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org) if you haven't already.

### 2. Install the Mac App

Run the installation script:
```bash
./install-app.sh
```

Choose where to install:
- **Applications folder** (recommended) - Available from Spotlight and Launchpad
- **Desktop** - Quick access, just double-click

### 3. Configure Notion

Edit the `.env` file in this folder:
```bash
nano .env
```

Add your Notion credentials:
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

See [Setting Up Notion](#setting-up-notion) below for how to get these.

### 4. Launch the App

- **From Applications**: Open Spotlight (⌘+Space), type "Notion Image Uploader"
- **From Desktop**: Double-click the app icon
- **From Finder**: Navigate to where you installed it and double-click

The app will:
1. Open Terminal (first time only: installs dependencies)
2. Start the server
3. Open your browser automatically
4. Show the upload interface

### 5. Upload Images

Drag a folder onto the interface and watch your images upload!

---

## Advanced Installation (For Developers)

1. Clone the repository:
```bash
git clone <repository-url>
cd notion-image-uploader
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure your Notion credentials in `.env`:
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

## Setting Up Notion

### 1. Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Image Uploader")
4. Select the workspace where you want to use it
5. Copy the "Internal Integration Token" - this is your `NOTION_API_KEY`

### 2. Create a Database

1. In Notion, create a new database (or use an existing one)
2. Add a "Name" property (title type) - this will store the image filename
3. Share the database with your integration:
   - Click "Share" in the top-right corner
   - Invite your integration
   - Give it "Can edit" permissions

### 3. Get the Database ID

The database ID is in the URL of your database page:
```
https://www.notion.so/[workspace]/[DATABASE_ID]?v=[view_id]
```

Copy the `DATABASE_ID` part (32 characters, letters and numbers).

## Usage

### 🎨 Using the Web GUI (Recommended)

The easiest way to use the app is through the web interface:

1. **Start the app:**
   ```bash
   npm run gui
   ```

2. **The app will automatically:**
   - Build the project
   - Start the server
   - Open your web browser to http://localhost:3000

3. **Upload your images:**
   - Drag and drop a folder onto the upload zone, OR
   - Click "Browse Folders" to select a folder
   - Watch the progress in real-time
   - See a summary when complete

4. **Stop the app:**
   - Press `Ctrl + C` in the terminal

**Quick Start Example:**
```bash
# Make sure you've configured .env first!
npm run gui
# Browser opens automatically - just drag a folder in!
```

### 💻 Using the Command Line (Alternative)

If you prefer the command line:

#### Build the Project

```bash
npm run build
```

#### Upload Images

Upload all images from a folder:
```bash
npm run cli upload /path/to/your/images
```

Upload images recursively (including subfolders):
```bash
npm run cli upload /path/to/your/images --recursive
```

Specify custom file extensions:
```bash
npm run cli upload /path/to/your/images --extensions jpg,png,webp
```

Override environment variables:
```bash
npm run cli upload /path/to/your/images --api-key YOUR_KEY --database-id YOUR_DB_ID
```

### Test Connection

Verify your Notion configuration is correct:
```bash
npm run cli test-connection
```

### Global Installation (Optional)

To use the tool globally on your Mac:

```bash
npm run build
npm link
```

Then you can use it anywhere:
```bash
notion-upload upload /path/to/images
notion-upload test-connection
```

## Command Reference

### `upload <folder>`

Upload images from a folder to Notion.

**Arguments:**
- `<folder>` - Path to the folder containing images (required)

**Options:**
- `-r, --recursive` - Include images in subfolders
- `-e, --extensions <ext>` - Comma-separated list of file extensions (default: jpg,jpeg,png,gif,webp,bmp,svg)
- `-k, --api-key <key>` - Notion API key (overrides .env)
- `-d, --database-id <id>` - Notion database ID (overrides .env)

**Examples:**
```bash
# Upload images from a folder
npm run cli upload ~/Pictures/vacation

# Upload images recursively
npm run cli upload ~/Pictures/vacation --recursive

# Upload only JPG and PNG files
npm run cli upload ~/Pictures/vacation --extensions jpg,png
```

### `test-connection`

Test connection to your Notion database.

**Options:**
- `-k, --api-key <key>` - Notion API key (overrides .env)
- `-d, --database-id <id>` - Notion database ID (overrides .env)

**Example:**
```bash
npm run cli test-connection
```

## Project Structure

```
.
├── src/
│   ├── cli.ts                    # CLI interface and commands
│   ├── services/
│   │   ├── notionService.ts      # Notion API integration
│   │   └── imageProcessor.ts     # Image file handling
│   ├── index.ts                  # Express server (legacy)
│   └── routes/                   # API routes (legacy)
├── dist/                         # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env                          # Configuration (create from .env.example)
```

## Development

### Run in Development Mode

```bash
# Test the CLI during development
npm run cli upload /path/to/images

# Run with TypeScript hot-reload (for server mode)
npm run dev
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## How It Works

1. **Image Discovery**: The tool scans the specified folder for image files matching the configured extensions
2. **Notion Connection**: Verifies connection to your Notion database
3. **Upload Process**: For each image:
   - Reads the image file
   - Converts it to base64 encoding
   - Creates a new page in your Notion database
   - Adds the image as a block in the page
   - Sets the page title to the filename
4. **Progress Reporting**: Shows real-time upload progress and final summary

## Limitations

- Base64 encoding is used for image uploads, which may have size limitations in Notion's API
- Large images may take longer to upload
- The Notion API has rate limits - for very large batches, uploads may be throttled

## Troubleshooting

### "NOTION_API_KEY is required"
Make sure you've created a `.env` file and added your Notion API key, or pass it via `--api-key`.

### "Failed to connect to Notion"
- Verify your API key is correct
- Ensure the database ID is correct
- Check that you've shared the database with your integration
- Run `npm run cli test-connection` to diagnose the issue

### "No images found"
- Check that the folder path is correct
- Verify the folder contains supported image formats
- Try using `--recursive` to search subfolders
- Check file permissions

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
