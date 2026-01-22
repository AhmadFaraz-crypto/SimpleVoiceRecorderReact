import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app">
      <header className="app-header">
        <nav className="main-nav">
          <NavLink to="/" className="nav-brand">
            <h1>🎤 Simple Voice Recorder</h1>
          </NavLink>
          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/demos"
              className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Demos
            </NavLink>
            <NavLink
              to="/docs"
              className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Documentation
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Simple Voice Recorder React</h3>
            <p>A modern React component for voice recording</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <a
              href="https://www.npmjs.com/package/simplevoicerecorderreact"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm Package
            </a>
            <a
              href="https://github.com/AhmadFaraz-crypto/SimpleVoiceRecorderReact"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </div>
          <div className="footer-section">
            <h4>Author</h4>
            <p>Ahmad Faraz</p>
            <p className="license">License: ISC</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Simple Voice Recorder React. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

