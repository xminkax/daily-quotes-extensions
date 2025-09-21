#!/bin/bash

# Chrome Extension Packaging Script
# This script creates a clean package for Chrome Web Store submission

echo "📦 Packaging Daily Quotes Extension for Chrome Web Store..."

# Create a clean directory for packaging
PACKAGE_DIR="daily-quotes-extension-package"
rm -rf "$PACKAGE_DIR"
mkdir "$PACKAGE_DIR"

echo "✅ Created package directory: $PACKAGE_DIR"

# Copy essential files only (exclude development files)
cp manifest.json "$PACKAGE_DIR/"
cp newtab.html "$PACKAGE_DIR/"
cp script.js "$PACKAGE_DIR/"
cp styles.css "$PACKAGE_DIR/"
cp quotes.json "$PACKAGE_DIR/"
cp -r icons "$PACKAGE_DIR/"
cp README.md "$PACKAGE_DIR/"
cp PRIVACY_POLICY.md "$PACKAGE_DIR/"

echo "✅ Copied extension files"

# Create a ZIP file for Chrome Web Store
ZIP_FILE="daily-quotes-extension-v1.0.0.zip"
cd "$PACKAGE_DIR"
zip -r "../$ZIP_FILE" .
cd ..

echo "✅ Created ZIP package: $ZIP_FILE"

# Show package contents
echo ""
echo "📋 Package contents:"
unzip -l "$ZIP_FILE"

echo ""
echo "🎉 Extension package ready for Chrome Web Store!"
echo "📁 ZIP file: $ZIP_FILE"
echo "📁 Package directory: $PACKAGE_DIR"
echo ""
echo "Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole/"
echo "2. Upload the ZIP file: $ZIP_FILE"
echo "3. Fill out the store listing details"
echo "4. Submit for review"