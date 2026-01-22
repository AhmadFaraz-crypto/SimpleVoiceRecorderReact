import React, { useState } from 'react';
import './Documentation.scss';

const Documentation: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<string>('readme');

  const docs = [
    { id: 'readme', label: 'README', content: readmeContent },
    { id: 'changelog', label: 'CHANGELOG', content: changelogContent },
    { id: 'usage', label: 'USAGE', content: usageContent },
  ];

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockContent: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="code-block">
              <code className={codeBlockLang}>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
          codeBlockLang = '';
        } else {
          codeBlockLang = line.replace('```', '').trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={index}>{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index}>{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index}>{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('#### ')) {
        elements.push(<h4 key={index}>{line.replace('#### ', '')}</h4>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.replace(/^[-*] /, '');
        const isBold = text.includes('**');
        const parts = text.split(/(\*\*.*?\*\*)/g);
        elements.push(
          <li key={index}>
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i}>{part.replace(/\*\*/g, '')}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<br key={index} />);
      } else if (line.startsWith('|')) {
        // Table row - handled separately
        return;
      } else {
        const text = line;
        const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
        elements.push(
          <p key={index}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
              } else if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={i} className="inline-code">{part.replace(/`/g, '')}</code>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
    });

    return <div className="markdown-content">{elements}</div>;
  };

  return (
    <div className="documentation">
      <div className="doc-tabs">
        {docs.map(doc => (
          <button
            key={doc.id}
            className={`doc-tab ${activeDoc === doc.id ? 'active' : ''}`}
            onClick={() => setActiveDoc(doc.id)}
            type="button"
          >
            {doc.label}
          </button>
        ))}
      </div>

      <div className="doc-content-wrapper">
        <div className="doc-content">
          {renderMarkdown(docs.find(doc => doc.id === activeDoc)?.content || '')}
        </div>
      </div>
    </div>
  );
};

const readmeContent = `# Simple Voice Recorder React

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

\`\`\`bash
npm install simplevoicerecorderreact
\`\`\`

or

\`\`\`bash
yarn add simplevoicerecorderreact
\`\`\`

## Quick Start

\`\`\`tsx
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
\`\`\`

## Props

### Recorder Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`blobUrl\` | \`(url: string \\| null) => void\` | \`undefined\` | Callback function that receives the audio URL when recording is completed |
| \`showAudioPlayUI\` | \`boolean\` | \`true\` | Show/hide the audio player after recording |
| \`title\` | \`string\` | \`''\` | Title displayed above the recorder |
| \`className\` | \`string\` | \`''\` | Additional CSS class names |
| \`hideAudioTitle\` | \`boolean\` | \`false\` | Hide the title header |
| \`status\` | \`(status: 'idle' \\| 'recording' \\| 'paused' \\| 'completed' \\| 'error') => void\` | \`undefined\` | Callback function for recording status changes |
| \`onRecordingStart\` | \`() => void\` | \`undefined\` | Callback fired when recording starts |
| \`onRecordingStop\` | \`() => void\` | \`undefined\` | Callback fired when recording stops |
| \`onRecordingPause\` | \`() => void\` | \`undefined\` | Callback fired when recording is paused |
| \`onRecordingResume\` | \`() => void\` | \`undefined\` | Callback fired when recording resumes |
| \`maxDuration\` | \`number\` | \`0\` | Maximum recording duration in seconds (0 = unlimited) |
| \`showDownloadButton\` | \`boolean\` | \`true\` | Show/hide the download button |
| \`showPauseButton\` | \`boolean\` | \`true\` | Show/hide the pause/resume button |
| \`showClearButton\` | \`boolean\` | \`true\` | Show/hide the clear button |
| \`downloadFileName\` | \`string\` | \`'recording'\` | Default filename for downloaded audio |
| \`disabled\` | \`boolean\` | \`false\` | Disable all recorder controls |

## Examples

### Basic Usage

\`\`\`tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  return <Recorder />;
}
\`\`\`

### With Callbacks

\`\`\`tsx
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  const handleAudioUrl = (url: string | null) => {
    if (url) {
      console.log('Recording completed:', url);
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
\`\`\`

### Using the Hook Directly

For more control, you can use the \`useRecorder\` hook directly:

\`\`\`tsx
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
\`\`\`

## Browser Support

This component uses the MediaRecorder API, which is supported in:

- Chrome 47+
- Firefox 25+
- Edge 79+
- Safari 14.1+
- Opera 36+

For older browsers, you may need polyfills.

## TypeScript

Full TypeScript support is included. Import types as needed:

\`\`\`tsx
import { Recorder, RecorderProps, UseRecorderReturn } from 'simplevoicerecorderreact';
\`\`\`

## Styling

**Important:** You must import the CSS file for the component to display correctly:

\`\`\`tsx
import 'simplevoicerecorderreact/dist/index.css';
\`\`\`

The component uses SCSS modules. You can override styles by:

1. Passing a \`className\` prop
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

Errors are displayed to the user and can be accessed via the \`error\` property when using the hook directly.

## Performance

- Proper cleanup of MediaRecorder and MediaStream
- Memory management with URL.revokeObjectURL
- Efficient timer implementation using setInterval
- No memory leaks

## License

ISC

## Author

Ahmad Faraz`;

const changelogContent = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [3.0.0] - 2024-01-XX

### Added

- ✨ Full TypeScript support with type definitions
- ✨ Pause/Resume recording functionality
- ✨ Download button for recorded audio
- ✨ Clear button to reset recording
- ✨ Enhanced error handling with user-friendly messages
- ✨ Comprehensive accessibility features (ARIA labels, keyboard navigation)
- ✨ SCSS modules for better styling
- ✨ Hours support in timer (previously only minutes and seconds)
- ✨ Maximum duration limit prop
- ✨ Multiple callback props (onRecordingStart, onRecordingStop, onRecordingPause, onRecordingResume)
- ✨ Better memory management with proper cleanup
- ✨ Custom download filename support
- ✨ Disabled state support
- ✨ Improved MediaRecorder configuration with audio enhancements (echo cancellation, noise suppression, auto gain control)
- ✨ Better MIME type detection and fallback
- ✨ Demo project with multiple examples
- ✨ Comprehensive documentation

### Changed

- 🔄 Converted from JavaScript to TypeScript
- 🔄 Converted from CSS to SCSS modules
- 🔄 Improved timer implementation using setInterval instead of setTimeout
- 🔄 Better cleanup of MediaRecorder and MediaStream on unmount
- 🔄 Enhanced useRecorder hook with more features and better error handling
- 🔄 Improved UI/UX with modern design
- 🔄 Better prop organization and naming

### Fixed

- 🐛 Fixed timer logic bugs
- 🐛 Fixed memory leaks with proper URL.revokeObjectURL calls
- 🐛 Fixed MediaStream cleanup issues
- 🐛 Fixed timer reset issues
- 🐛 Fixed React bundling issues
- 🐛 Fixed pause/resume state management
- 🐛 Fixed MediaRecorder start issues with recovery mechanism

### Removed

- ❌ Removed old JavaScript files
- ❌ Removed CSS module file (replaced with SCSS)

## [2.1.3] - Previous Version

### Features

- Basic recording functionality
- Audio playback UI
- Timer display
- Basic props support`;

const usageContent = `# Usage Guide - Simple Voice Recorder React

## Installation

\`\`\`bash
npm install simplevoicerecorderreact
# or
yarn add simplevoicerecorderreact
\`\`\`

## Important: Import CSS

**You MUST import the CSS file for the component to work correctly:**

\`\`\`tsx
import 'simplevoicerecorderreact/dist/index.css';
\`\`\`

## React Version Compatibility

This package works with:
- React 16.8+ (hooks support required)
- React 17.x
- React 18.x
- Next.js 12+
- Next.js 13+ (App Router)
- Next.js 14+

## Basic Usage

\`\`\`tsx
import React from 'react';
import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';

function App() {
  return <Recorder />;
}
\`\`\`

## Next.js Usage

### Pages Router (pages/)

\`\`\`tsx
// pages/index.tsx
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
\`\`\`

### App Router (app/)

\`\`\`tsx
// app/page.tsx
'use client'; // Required for client components in App Router

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
\`\`\`

## Troubleshooting

### React is null error

If you encounter "Cannot read properties of null (reading 'useState')", ensure:

1. **React is installed** in your project:
   \`\`\`bash
   npm install react react-dom
   \`\`\`

2. **React version is compatible** (16.8+)

3. **CSS is imported**:
   \`\`\`tsx
   import 'simplevoicerecorderreact/dist/index.css';
   \`\`\`

4. **Clear cache and reinstall**:
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

### Module Resolution Issues

If you're using a monorepo or have module resolution issues:

1. Ensure React is hoisted to the root \`node_modules\`
2. Check that there's only one React instance
3. Use npm/yarn workspaces correctly

### Webpack/Bundler Issues

The package properly externalizes React. If you're using a custom webpack config, ensure React is not being bundled:

\`\`\`javascript
// webpack.config.js
module.exports = {
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  }
};
\`\`\`

## TypeScript Support

Full TypeScript support is included:

\`\`\`tsx
import { Recorder, RecorderProps, useRecorder, UseRecorderReturn } from 'simplevoicerecorderreact';
\`\`\`

## Browser Compatibility

- Chrome 47+
- Firefox 25+
- Edge 79+
- Safari 14.1+
- Opera 36+

For older browsers, you may need polyfills for MediaRecorder API.`;

export default Documentation;

