import React, { useState, useCallback, useRef } from 'react';
import { Recorder } from 'simplevoicerecorderreact';
import './Example.scss';

const AdvancedExample: React.FC = () => {
  const [status, setStatus] = useState<string>('idle');
  const [recordings, setRecordings] = useState<string[]>([]);
  const previousUrlRef = useRef<string | null>(null);

  const handleAudioUrl = useCallback((url: string | null) => {
    if (url && url !== previousUrlRef.current) {
      previousUrlRef.current = url;
      setRecordings(prev => [...prev, url]);
    } else if (!url) {
      previousUrlRef.current = null;
    }
  }, []);

  const handleStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleRecordingStart = () => {
    console.log('Recording started!');
  };

  const handleRecordingStop = () => {
    console.log('Recording stopped!');
  };

  const handleRecordingPause = () => {
    console.log('Recording paused!');
  };

  const handleRecordingResume = () => {
    console.log('Recording resumed!');
  };

  return (
    <div className="example">
      <div className="status-display">
        <strong>Current Status:</strong> <span className={`status-${status}`}>{status}</span>
      </div>

      <div className="recorder-container">
        <Recorder
          blobUrl={handleAudioUrl}
          status={handleStatus}
          title="Advanced Voice Recorder"
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
          onRecordingPause={handleRecordingPause}
          onRecordingResume={handleRecordingResume}
          maxDuration={120} // 2 minutes
          showDownloadButton={true}
          showPauseButton={true}
          showClearButton={true}
          downloadFileName="my-recording"
        />
      </div>

      {recordings.length > 0 && (
        <div className="recordings-list">
          <h3>Recordings History ({recordings.length})</h3>
          <ul>
            {recordings.map((url, index) => (
              <li key={index}>
                <audio controls src={url} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="code-block">
        <h3>Code:</h3>
        <pre>
          <code>{`import { Recorder } from 'simplevoicerecorderreact';

function App() {
  const [status, setStatus] = useState('idle');

  return (
    <Recorder
      blobUrl={(url) => console.log('Audio:', url)}
      status={(status) => setStatus(status)}
      onRecordingStart={() => console.log('Started')}
      onRecordingStop={() => console.log('Stopped')}
      onRecordingPause={() => console.log('Paused')}
      onRecordingResume={() => console.log('Resumed')}
      maxDuration={120}
      downloadFileName="my-recording"
    />
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
};

export default AdvancedExample;

