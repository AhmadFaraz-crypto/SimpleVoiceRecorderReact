import React from 'react';
import { Recorder } from 'simplevoicerecorderreact';
import './Example.scss';

const BasicExample: React.FC = () => {
  const handleAudioUrl = (url: string | null) => {
    if (url) {
      console.log('Audio URL:', url);
      alert('Recording completed! Check console for URL.');
    }
  };

  const handleStatus = (status: string) => {
    console.log('Recording status:', status);
  };

  return (
    <div className="example">
      <div className="recorder-container">
        <Recorder
          blobUrl={handleAudioUrl}
          status={handleStatus}
          title="Basic Voice Recorder"
        />
      </div>
      <div className="code-block">
        <h3>Code:</h3>
        <pre>
          <code>{`import { Recorder } from 'simplevoicerecorderreact';

function App() {
  const handleAudioUrl = (url) => {
    console.log('Audio URL:', url);
  };

  return (
    <Recorder
      blobUrl={handleAudioUrl}
      title="Basic Voice Recorder"
    />
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
};

export default BasicExample;

