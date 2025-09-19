# Daily Quotes - Chrome Extension

A beautiful Chrome extension that replaces your new tab page with inspiring daily quotes and smooth animations.

## Features

- 🌟 **Daily Inspirational Quotes**: Automatically displays a new quote each day
- ✨ **Smooth Animations**: Beautiful gradient backgrounds with floating elements
- 🎨 **Modern UI**: Clean, glassmorphism design with backdrop blur effects
- 🕒 **Live Clock**: Shows current time in an elegant display
- 🔄 **Manual Refresh**: Click the refresh button or press spacebar for new quotes
- 📱 **Responsive Design**: Works perfectly on all screen sizes
- ⚡ **Fast Performance**: Lightweight and optimized for speed

## Installation

### Method 1: Load as Unpacked Extension (Developer Mode)

1. **Enable Developer Mode in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top-right corner

2. **Load the Extension:**
   - Click "Load unpacked"
   - Select the `daily-quotes-extension` folder
   - The extension will be installed and active immediately

3. **Test the Extension:**
   - Open a new tab to see your daily quote!

### Method 2: Pack and Install

1. **Pack the Extension:**
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `daily-quotes-extension` folder as the root directory
   - Click "Pack Extension" (this creates a .crx file)

2. **Install the Packed Extension:**
   - Drag and drop the .crx file onto the chrome://extensions/ page
   - Click "Add Extension" when prompted

## Usage

- **New Tab**: Simply open a new tab in Chrome to see your daily inspirational quote
- **Refresh Quote**: Click the refresh button (⟲) or press the spacebar to get a new random quote
- **Daily Quote**: The extension shows a consistent quote for each day, but you can always get random quotes using the refresh function

## Customization

### Adding Your Own Quotes

1. Edit the `quotes.json` file
2. Add your quotes in the following format:
   ```json
   {
     "text": "Your inspiring quote here",
     "author": "Quote Author"
   }
   ```
3. Reload the extension in `chrome://extensions/`

### Customizing Colors and Animations

- **Background Gradient**: Edit the `background` property in `styles.css` (line 11)
- **Animation Speed**: Modify animation durations in the CSS keyframes
- **Quote Container**: Customize the glassmorphism effect in `.quote-container` class

## File Structure

```
daily-quotes-extension/
├── manifest.json          # Chrome extension configuration
├── newtab.html            # New tab page structure
├── styles.css             # Styling and animations
├── script.js              # JavaScript functionality
├── quotes.json            # Collection of inspirational quotes
└── README.md              # This documentation
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage (for remembering daily quotes)
- **Override**: New Tab page
- **Compatibility**: Chrome, Edge, and other Chromium-based browsers

## Features Breakdown

### Animations
- Gradient background with continuous color shifting
- Floating bubble elements with parallax mouse effects
- Smooth quote transitions with fade effects
- Hover animations on interactive elements

### Responsive Design
- Mobile-friendly layout
- Adaptive text sizing
- Flexible container sizing
- Touch-friendly controls

### Performance
- Efficient animation using CSS transforms
- Minimal DOM manipulation
- Optimized asset loading
- Local storage for preferences

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development
1. Clone or download this project
2. Make your changes
3. Load as unpacked extension in Chrome
4. Test your modifications

### Adding Features
- **Weather Integration**: Add weather API calls in `script.js`
- **Background Images**: Implement Unsplash API for dynamic backgrounds
- **User Settings**: Create options page for customization
- **Quote Categories**: Add filtering by quote categories

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the correct directory
- Check the browser console for errors
- Verify manifest.json is valid JSON

### Quotes Not Displaying
- Check that quotes.json is properly formatted
- Verify file paths in HTML are correct
- Look for network errors in developer tools

### Animations Not Working
- Ensure CSS files are loading properly
- Check for JavaScript errors in console
- Verify browser supports CSS animations

## Contributing

Feel free to contribute to this project by:
- Adding new inspirational quotes
- Improving animations and visual effects
- Adding new features
- Fixing bugs
- Enhancing documentation

## License

This project is open source and available under the MIT License.

## Credits

- **Icons**: SVG icons for refresh button
- **Quotes**: Collection of inspirational quotes from various sources
- **Design**: Modern glassmorphism UI principles

---

Enjoy your daily dose of inspiration! 🌟