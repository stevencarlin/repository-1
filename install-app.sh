#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║   Notion Image Uploader - Installation        ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Get the current directory
CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="Notion Image Uploader.app"
APP_PATH="$CURRENT_DIR/$APP_NAME"

# Check if the app exists
if [ ! -d "$APP_PATH" ]; then
    echo "❌ Error: $APP_NAME not found in $CURRENT_DIR"
    exit 1
fi

echo "Choose installation location:"
echo ""
echo "  1) Applications folder (recommended - available to all users)"
echo "  2) Desktop (easy access)"
echo "  3) Cancel"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        INSTALL_DIR="/Applications"
        echo ""
        echo "📁 Installing to /Applications..."

        # Check if we need sudo
        if [ -w "/Applications" ]; then
            cp -R "$APP_PATH" "$INSTALL_DIR/"
        else
            echo "🔐 Administrator password required..."
            sudo cp -R "$APP_PATH" "$INSTALL_DIR/"
        fi

        if [ $? -eq 0 ]; then
            echo "✅ Successfully installed to /Applications"
            echo ""
            echo "🎉 You can now:"
            echo "   • Find 'Notion Image Uploader' in your Applications folder"
            echo "   • Add it to your Dock for quick access"
            echo "   • Use Spotlight (⌘+Space) to launch it"
        else
            echo "❌ Installation failed"
            exit 1
        fi
        ;;
    2)
        INSTALL_DIR="$HOME/Desktop"
        echo ""
        echo "📁 Installing to Desktop..."
        cp -R "$APP_PATH" "$INSTALL_DIR/"

        if [ $? -eq 0 ]; then
            echo "✅ Successfully installed to Desktop"
            echo ""
            echo "🎉 You can now double-click the app on your Desktop to launch it!"
        else
            echo "❌ Installation failed"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "Installation cancelled"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚙️  IMPORTANT: Before first use"
echo ""
echo "   1. Make sure you have Node.js installed"
echo "      (Download from: https://nodejs.org)"
echo ""
echo "   2. Configure your Notion credentials:"
echo "      • Edit the .env file in $CURRENT_DIR"
echo "      • Add your NOTION_API_KEY and NOTION_DATABASE_ID"
echo ""
echo "   See README.md for detailed setup instructions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
