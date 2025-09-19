# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Chrome browser extension that replaces the new tab page with inspiring daily quotes, beautiful animations, and a live clock. It's built using vanilla HTML, CSS, and JavaScript with Chrome Extension Manifest v3.

## Development Commands

### Chrome Extension Development
```bash
# Load extension in development mode
# 1. Open Chrome and navigate to chrome://extensions/
# 2. Enable "Developer mode" in the top-right corner
# 3. Click "Load unpacked" and select this directory

# Reload extension after changes
# Go to chrome://extensions/ and click the reload button for this extension
```

### Testing and Validation
```bash
# Validate manifest.json syntax
python -m json.tool manifest.json

# Check for common extension issues
# Open Chrome DevTools on any new tab page to view console errors

# Test quote loading
# Check that quotes.json is properly formatted
cat quotes.json | python -m json.tool
```

### File Structure Validation
```bash
# Ensure all required files exist
ls -la manifest.json newtab.html script.js styles.css quotes.json

# Check for missing icon files (referenced in manifest.json)
ls -la icons/
```

## Architecture Overview

### Core Components

**DailyQuotesExtension Class** (`script.js`):
- Main application controller that manages the entire extension lifecycle
- Handles quote loading, display logic, time updates, and user interactions
- Implements daily quote consistency using date-based seeding
- Manages smooth animations and transitions between quotes

**Quote Management System**:
- `quotes.json`: Central data store containing inspirational quotes and authors
- Daily quote algorithm: Uses day-of-year calculation to ensure same quote per day
- Fallback quotes: Hard-coded fallbacks if JSON loading fails
- Random quote generation: For manual refresh functionality

**UI Architecture**:
- `newtab.html`: Semantic HTML structure with glassmorphism design
- `styles.css`: Advanced CSS animations including gradient backgrounds, floating elements, and responsive design
- Layered visual system: Background animations, quote container, and controls

### Key Technical Patterns

**Animation System**:
- CSS-based animations for performance (transforms, opacity, backdrop-filter)
- Coordinated fade-out/fade-in transitions for quote changes
- Floating elements with parallax mouse effects
- Continuous gradient background animation

**State Management**:
- Chrome storage API for persistence with localStorage fallback
- Event-driven architecture for user interactions (click, keyboard)
- Time-based updates using setInterval
- Quote state tracking to prevent consecutive duplicates

**Responsive Design Pattern**:
- Mobile-first approach with progressive enhancement
- Flexible container sizing and adaptive typography
- Touch-friendly controls and spacing adjustments

## Extension-Specific Development

### Manifest v3 Considerations
- Uses `chrome_url_overrides.newtab` to replace new tab page
- Requires `storage` permission for daily quote persistence
- No background scripts needed - runs entirely on new tab page

### Quote System Customization
- Add quotes by editing `quotes.json` in the specific JSON format
- Daily quotes use deterministic seeding: `dayOfYear % quotes.length`
- Manual refresh uses true randomization with duplicate prevention

### Animation Performance
- All animations use CSS transforms and opacity for 60fps performance
- Backdrop-filter creates glassmorphism effects
- Floating elements use CSS animations rather than JavaScript for efficiency

## Common Development Patterns

### Adding New Features
1. Extend the `DailyQuotesExtension` class methods
2. Add corresponding HTML elements in `newtab.html`
3. Style new elements in `styles.css` following the glassmorphism design pattern
4. Update manifest.json if new permissions are needed

### Testing Extension Changes
1. Make code changes
2. Go to `chrome://extensions/`
3. Click reload button for the extension
4. Open new tab to test changes
5. Check browser console for any JavaScript errors

### Quote Data Management
- Quotes must follow exact JSON structure: `{"text": "quote", "author": "name"}`
- Consider quote length for responsive display
- Test with various screen sizes after adding quotes

## Key Files and Their Purposes

- `manifest.json`: Extension configuration and permissions
- `newtab.html`: New tab page structure and layout
- `script.js`: Core application logic and quote management
- `styles.css`: All styling, animations, and responsive design
- `quotes.json`: Quote database with structured data
- `README.md`: User installation and usage documentation