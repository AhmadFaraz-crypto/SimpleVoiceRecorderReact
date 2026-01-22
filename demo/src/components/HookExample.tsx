import React from 'react';
import { useRecorder } from 'simplevoicerecorderreact';
import './Example.scss';

const HookExample: React.FC = () => {
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

  const handleDownload = () => {
    if (!audioBlob) return;
    
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recording-${Date.now()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="example">
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="custom-recorder">
        <div className="recorder-controls">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="control-btn start"
            type="button"
          >
            Start Recording
          </button>

          {isRecording && (
            <>
              <button
                onClick={stopRecording}
                className="control-btn stop"
                type="button"
              >
                Stop
              </button>
              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="control-btn pause"
                type="button"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </>
          )}

          {audioURL && (
            <>
              <button
                onClick={handleDownload}
                className="control-btn download"
                type="button"
              >
                Download
              </button>
              <button
                onClick={clearRecording}
                className="control-btn clear"
                type="button"
              >
                Clear
              </button>
            </>
          )}
        </div>

        <div className="recorder-status">
          <div>
            <strong>Status:</strong>{' '}
            <span className={`status-${isRecording ? (isPaused ? 'paused' : 'recording') : 'idle'}`}>
              {isRecording ? (isPaused ? 'Paused' : 'Recording...') : audioURL ? 'Completed' : 'Idle'}
            </span>
          </div>
          {audioBlob && (
            <div>
              <strong>File Size:</strong> {(audioBlob.size / 1024).toFixed(2)} KB
            </div>
          )}
        </div>

        {audioURL && (
          <div className="audio-preview">
            <audio controls src={audioURL} />
          </div>
        )}
      </div>

      <div className="code-block">
        <h3>Code:</h3>
        <pre>
          <code>{`import { useRecorder } from 'simplevoicerecorderreact';

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
      {isRecording && (
        <>
          <button onClick={stopRecording}>Stop</button>
          <button onClick={isPaused ? resumeRecording : pauseRecording}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </>
      )}
      {audioURL && <audio controls src={audioURL} />}
    </div>
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
};

export default HookExample;

