import React from 'react';
import './HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Simple Voice Recorder React</h1>
          <p className="hero-subtitle">
            A modern, feature-rich React voice recorder component with TypeScript support, 
            pause/resume functionality, and comprehensive accessibility features.
          </p>
          <div className="hero-badges">
            <span className="badge">TypeScript</span>
            <span className="badge">React 16.8+</span>
            <span className="badge">Accessible</span>
            <span className="badge">Modern UI</span>
          </div>
          <div className="hero-actions">
            <a
              href="https://www.npmjs.com/package/simplevoicerecorderreact"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on npm
            </a>
            <a
              href="https://github.com/AhmadFaraz-crypto/SimpleVoiceRecorderReact"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>High-Quality Recording</h3>
            <p>Uses MediaRecorder API for professional audio quality with echo cancellation and noise suppression</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏸️</div>
            <h3>Pause & Resume</h3>
            <p>Full control over recording with pause and resume functionality</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📥</div>
            <h3>Download Audio</h3>
            <p>Download recorded audio files with custom filenames</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">♿</div>
            <h3>Accessible</h3>
            <p>Built with accessibility in mind - ARIA labels, keyboard navigation, screen reader support</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>TypeScript</h3>
            <p>Full TypeScript support with comprehensive type definitions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Highly customizable with props for styling, behavior, and callbacks</p>
          </div>
        </div>
      </section>

      <section className="quick-install-section">
        <h2 className="section-title">Quick Installation</h2>
        <div className="install-content">
          <div className="install-step">
            <h3>1. Install Package</h3>
            <div className="code-block">
              <code>npm install simplevoicerecorderreact</code>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText('npm install simplevoicerecorderreact');
                }}
                type="button"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="install-step">
            <h3>2. Import Component</h3>
            <div className="code-block">
              <code>{`import { Recorder } from 'simplevoicerecorderreact';
import 'simplevoicerecorderreact/dist/index.css';`}</code>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(`import { Recorder } from 'simplevoicerecorderreact';\nimport 'simplevoicerecorderreact/dist/index.css';`);
                }}
                type="button"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="install-step">
            <h3>3. Use in Your App</h3>
            <div className="code-block">
              <code>{`function App() {
  return <Recorder />;
}`}</code>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(`function App() {\n  return <Recorder />;\n}`);
                }}
                type="button"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

