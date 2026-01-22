# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- 🐛 Removed console.log statements

### Removed
- ❌ Removed old JavaScript files
- ❌ Removed CSS module file (replaced with SCSS)

## [2.1.3] - Previous Version

### Features
- Basic recording functionality
- Audio playback UI
- Timer display
- Basic props support

