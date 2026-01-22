# Simple Voice Recorder React

A modern, feature-rich React voice recorder component with TypeScript support, pause/resume functionality, download capability, and comprehensive accessibility features.

## Features

- 🎤 **High-quality audio recording** using MediaRecorder API
- ⏸️ **Pause/Resume** recording functionality
- 📥 **Download** recorded audio files
- 🎨 **Modern UI** with SCSS styling
- ♿ **Accessibility** features (ARIA labels, keyboard navigation)
- 📱 **Responsive design** for mobile and desktop
- 🔧 **TypeScript** support with full type definitions
- ⏱️ **Timer** with hours, minutes, and seconds display
- 🚫 **Error handling** with user-friendly messages
- 🎛️ **Customizable** props for flexible usage
- 🧹 **Memory management** with proper cleanup

## Installation

```bash
npm install simplevoicerecorderreact
```

or

```bash
yarn add simplevoicerecorderreact
```

## Quick Start

```tsx
import React from 'react';
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

const App = () => {
  const handleAudioUrl = (url: string | null) => {
    console.log('Audio URL:', url);
  };

  const handleStatus = (status: 'idle' | 'recording' | 'paused' | 'completed' | 'error') => {
    console.log('Recording status:', status);
  };

  return (
    <Recorder
      blobUrl={handleAudioUrl}
      status={handleStatus}
      title="My Voice Recorder"
    />
  );
};

export default App;
```

## Props

### Recorder Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blobUrl` | `(url: string \| null) => void` | `undefined` | Callback function that receives the audio URL when recording is completed |
| `showAudioPlayUI` | `boolean` | `true` | Show/hide the audio player after recording |
| `title` | `string` | `''` | Title displayed above the recorder |
| `className` | `string` | `''` | Additional CSS class names |
| `hideAudioTitle` | `boolean` | `false` | Hide the title header |
| `status` | `(status: 'idle' \| 'recording' \| 'paused' \| 'completed' \| 'error') => void` | `undefined` | Callback function for recording status changes |
| `onRecordingStart` | `() => void` | `undefined` | Callback fired when recording starts |
| `onRecordingStop` | `() => void` | `undefined` | Callback fired when recording stops |
| `onRecordingPause` | `() => void` | `undefined` | Callback fired when recording is paused |
| `onRecordingResume` | `() => void` | `undefined` | Callback fired when recording resumes |
| `maxDuration` | `number` | `0` | Maximum recording duration in seconds (0 = unlimited) |
| `showDownloadButton` | `boolean` | `true` | Show/hide the download button |
| `showPauseButton` | `boolean` | `true` | Show/hide the pause/resume button |
| `showClearButton` | `boolean` | `true` | Show/hide the clear button |
| `downloadFileName` | `string` | `'recording'` | Default filename for downloaded audio |
| `disabled` | `boolean` | `false` | Disable all recorder controls |

## Examples

### Basic Usage

```tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  return <Recorder />;
}
```

### With Callbacks

```tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  const handleAudioUrl = (url: string | null) => {
    if (url) {
      console.log('Recording completed:', url);
      // Do something with the audio URL
    }
  };

  const handleStatus = (status: string) => {
    console.log('Status:', status);
  };

  return (
    <Recorder
      blobUrl={handleAudioUrl}
      status={handleStatus}
      title="Voice Recorder"
    />
  );
}
```

### Custom Styling

```tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';
import './CustomStyles.scss';

function App() {
  return (
    <Recorder
      className="my-custom-recorder"
      title="Custom Styled Recorder"
    />
  );
}
```

### With Maximum Duration

```tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  return (
    <Recorder
      maxDuration={60} // 60 seconds maximum
      title="60 Second Recorder"
    />
  );
}
```

### Minimal UI (No Audio Player)

```tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  const handleAudioUrl = (url: string | null) => {
    // Handle audio URL programmatically
    if (url) {
      // Upload to server, etc.
    }
  };

  return (
    <Recorder
      showAudioPlayUI={false}
      blobUrl={handleAudioUrl}
      title="Minimal Recorder"
    />
  );
}
```

### Using the Hook Directly

For more control, you can use the `useRecorder` hook directly:

```tsx
import { useRecorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function CustomRecorder() {
  const {
    audioURL,
    isRecording,
    isPaused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    error,
    audioBlob,
  } = useRecorder();

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <button onClick={startRecording} disabled={isRecording}>
        Start
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
      {isRecording && (
        <button onClick={isPaused ? resumeRecording : pauseRecording}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
      {audioURL && <audio controls src={audioURL} />}
    </div>
  );
}
```

### Next.js Usage

```tsx
// pages/index.tsx or app/page.tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

export default function Home() {
  return (
    <div>
      <h1>Voice Recorder</h1>
      <Recorder />
    </div>
  );
}
```

## Browser Support

This component uses the [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), which is supported in:

- Chrome 47+
- Firefox 25+
- Edge 79+
- Safari 14.1+
- Opera 36+

For older browsers, you may need polyfills.

## TypeScript

Full TypeScript support is included. Import types as needed:

```tsx
import { Recorder, RecorderProps, UseRecorderReturn } from 'simplevoicerecorderreact';
```

## Styling

**Important:** You must import the CSS file for the component to display correctly:

```tsx
import 'simplevoicerecorderreact/dist/index.css';
```

The component uses SCSS modules. You can override styles by:

1. Passing a `className` prop
2. Using CSS specificity to override default styles
3. Importing the styles module and extending it

## Accessibility

The component includes:

- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Semantic HTML

## Error Handling

The component handles various error scenarios:

- Microphone permission denied
- Microphone not available
- MediaRecorder API not supported
- Recording errors

Errors are displayed to the user and can be accessed via the `error` property when using the hook directly.

## Performance

- Proper cleanup of MediaRecorder and MediaStream
- Memory management with URL.revokeObjectURL
- Efficient timer implementation using setInterval
- No memory leaks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Ahmad Faraz

## Changelog

### Version 3.0.0

- ✨ Added TypeScript support
- ✨ Added pause/resume functionality
- ✨ Added download button
- ✨ Added clear button
- ✨ Improved error handling
- ✨ Enhanced accessibility features
- ✨ Better timer implementation
- ✨ SCSS styling
- ✨ Memory leak fixes
- ✨ Better cleanup on unmount
- ✨ More customization options

### Version 2.1.3

- Basic recording functionality
- Audio playback UI
- Timer display
