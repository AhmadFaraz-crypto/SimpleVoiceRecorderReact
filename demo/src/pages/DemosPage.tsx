import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import BasicExample from '../components/BasicExample';
import AdvancedExample from '../components/AdvancedExample';
import HookExample from '../components/HookExample';
import CustomStyledExample from '../components/CustomStyledExample';
import './DemosPage.scss';

const DemosPage: React.FC = () => {
  return (
    <div className="demos-page">
      <div className="section-header">
        <h1 className="page-title">Live Demos</h1>
        <p className="page-description">
          Explore different examples and use cases of the Simple Voice Recorder component
        </p>
      </div>

      <div className="demos-grid">
        <ErrorBoundary>
          <div className="demo-card">
            <div className="demo-card-header">
              <h3>Basic Example</h3>
              <p>Simplest usage with default settings</p>
            </div>
            <div className="demo-card-content">
              <BasicExample />
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-card-header">
              <h3>Advanced Example</h3>
              <p>All features including callbacks and max duration</p>
            </div>
            <div className="demo-card-content">
              <AdvancedExample />
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-card-header">
              <h3>Hook Usage</h3>
              <p>Using the useRecorder hook directly</p>
            </div>
            <div className="demo-card-content">
              <HookExample />
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-card-header">
              <h3>Custom Styled</h3>
              <p>Custom styling and layout example</p>
            </div>
            <div className="demo-card-content">
              <CustomStyledExample />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default DemosPage;

