# Simple Voice Recorder React - Demo

This is a demo project showcasing the features and usage of the Simple Voice Recorder React component.

## Getting Started

### Prerequisites

- Node.js 14+ 
- npm or yarn

### Installation

1. **First, build the parent package**:

```bash
cd ..
npm run build
cd demo
```

2. **Install dependencies**:

```bash
npm install
```

**Note:** The demo uses `file:..` to link to the parent package. If you encounter React resolution issues:

```bash
# Remove React from package's node_modules
cd ..
rm -rf node_modules/react node_modules/react-dom
cd demo

# Clear cache and reinstall
rm -rf node_modules/.cache node_modules/simplevoicerecorderreact
npm install
```

3. **Start the development server**:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the demo in your browser.

## Troubleshooting

### React is null error

If you encounter "Cannot read properties of null (reading 'useState')":

1. **Ensure React is not in package's node_modules**:
   ```bash
   cd ..
   rm -rf node_modules/react node_modules/react-dom
   cd demo
   ```

2. **Clear all caches**:
   ```bash
   rm -rf node_modules/.cache node_modules/simplevoicerecorderreact .cache build
   ```

3. **Reinstall**:
   ```bash
   npm install
   ```

4. **Restart the dev server**:
   ```bash
   npm start
   ```

### Using the setup script

For convenience, use the setup script:

```bash
./setup.sh
npm start
```

## Demo Features

The demo includes four examples:

1. **Basic Example** - Simple usage with default settings
2. **Advanced Example** - All features including callbacks, max duration, and status tracking
3. **Hook Usage** - Custom implementation using the `useRecorder` hook directly
4. **Custom Styled** - Example of custom styling with CSS/SCSS

## Examples Included

### Basic Example
Shows the simplest way to use the component with minimal configuration.

### Advanced Example
Demonstrates:
- All callback functions (onRecordingStart, onRecordingStop, etc.)
- Status tracking
- Maximum duration limit
- Recording history
- Download functionality

### Hook Usage Example
Shows how to use the `useRecorder` hook directly for complete control over the UI and behavior.

### Custom Styled Example
Demonstrates how to customize the appearance using CSS classes.

## Important Notes

- **CSS Import Required**: Don't forget to import the CSS file:
  ```tsx
  import 'simplevoicerecorderreact/dist/index.css';
  ```

- **React Version**: The demo uses React 18.2.0, but the package supports React 16.8+

## Learn More

- Check out the main [README.md](../README.md) for full documentation
- Visit the [GitHub repository](https://github.com/AhmadFaraz-crypto/SimpleVoiceRecorderReact) for source code
