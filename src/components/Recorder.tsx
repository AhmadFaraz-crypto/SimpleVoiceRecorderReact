import React, { useState, useEffect, useRef } from 'react';
import useRecorder, { UseRecorderReturn } from './useRecorder';
import styles from '../styles.module.scss';

export interface RecorderProps {
  blobUrl?: (url: string | null) => void;
  showAudioPlayUI?: boolean;
  title?: string;
  className?: string;
  hideAudioTitle?: boolean;
  status?: (status: 'idle' | 'recording' | 'paused' | 'completed' | 'error') => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onRecordingPause?: () => void;
  onRecordingResume?: () => void;
  maxDuration?: number; // in seconds, 0 = unlimited
  showDownloadButton?: boolean;
  showPauseButton?: boolean;
  showClearButton?: boolean;
  downloadFileName?: string;
  disabled?: boolean;
}

const Recorder: React.FC<RecorderProps> = ({
  blobUrl,
  showAudioPlayUI = true,
  title = '',
  className = '',
  hideAudioTitle = false,
  status,
  onRecordingStart,
  onRecordingStop,
  onRecordingPause,
  onRecordingResume,
  maxDuration = 0,
  showDownloadButton = true,
  showPauseButton = true,
  showClearButton = true,
  downloadFileName = 'recording',
  disabled = false,
}) => {
  // Hooks must be called unconditionally at the top level
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

  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const totalSecondsRef = useRef<number>(0);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        totalSecondsRef.current += 1;
        
        // Check max duration
        if (maxDuration > 0 && totalSecondsRef.current >= maxDuration) {
          stopRecording();
          return;
        }

        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          if (newSeconds === 60) {
            setMinutes(prevMinutes => {
              const newMinutes = prevMinutes + 1;
              if (newMinutes === 60) {
                setHours(prevHours => prevHours + 1);
                return 0;
              }
              return newMinutes;
            });
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording, isPaused, maxDuration, stopRecording]);

  // Reset timer when recording stops
  useEffect(() => {
    if (!isRecording && !audioURL) {
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      totalSecondsRef.current = 0;
    }
  }, [isRecording, audioURL]);

  // Handle status callbacks
  useEffect(() => {
    if (status) {
      if (error) {
        status('error');
      } else if (isRecording && isPaused) {
        status('paused');
      } else if (isRecording) {
        status('recording');
      } else if (audioURL) {
        status('completed');
      } else {
        status('idle');
      }
    }
  }, [status, isRecording, isPaused, audioURL, error]);

  // Notify parent of audio URL
  useEffect(() => {
    if (blobUrl && audioURL) {
      blobUrl(audioURL);
    }
  }, [audioURL]); // Only depend on audioURL, not blobUrl to prevent infinite loops

  const handleStartRecording = async () => {
    if (disabled) return;
    await startRecording();
    onRecordingStart?.();
  };

  const handleStopRecording = () => {
    if (disabled) return;
    stopRecording();
    onRecordingStop?.();
  };

  const handlePauseRecording = () => {
    if (disabled) return;
    pauseRecording();
    onRecordingPause?.();
  };

  const handleResumeRecording = () => {
    if (disabled) return;
    resumeRecording();
    onRecordingResume?.();
  };

  const handleClearRecording = () => {
    if (disabled) return;
    clearRecording();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    totalSecondsRef.current = 0;
  };

  const handleDownload = () => {
    if (!audioBlob || disabled) return;
    
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${downloadFileName}.${audioBlob.type.includes('webm') ? 'webm' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTime = (h: number, m: number, s: number): string => {
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  // Create a safe styles object with fallbacks
  // Ensure styles is always a valid object with all required properties
  const safeStyles: Record<string, string> = (styles && typeof styles === 'object' && !Array.isArray(styles)) 
    ? {
        container: (styles as any).container || '',
        title: (styles as any).title || '',
        counter: (styles as any).counter || '',
        error: (styles as any).error || '',
        recordingBtn: (styles as any).recordingBtn || '',
        audioPlay: (styles as any).audioPlay || '',
        audioPlayer: (styles as any).audioPlayer || '',
        button: (styles as any).button || '',
        stopButton: (styles as any).stopButton || '',
        pauseButton: (styles as any).pauseButton || '',
        downloadButton: (styles as any).downloadButton || '',
        clearButton: (styles as any).clearButton || '',
        actions: (styles as any).actions || '',
      }
    : {
        container: '',
        title: '',
        counter: '',
        error: '',
        recordingBtn: '',
        audioPlay: '',
        audioPlayer: '',
        button: '',
        stopButton: '',
        pauseButton: '',
        downloadButton: '',
        clearButton: '',
        actions: '',
      };

  const containerClasses = `${safeStyles.container || ''} ${className || ''}`.trim();

  return (
    <div className={containerClasses} role="region" aria-label="Audio Recorder">
      {!hideAudioTitle && (
        <h3 className={safeStyles.title}>
          {title || 'Audio Recorder'}
        </h3>
      )}

      {error && (
        <div className={safeStyles.error} role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <div className={safeStyles.counter} aria-live="polite" aria-atomic="true">
        {formatTime(hours, minutes, seconds)}
      </div>

      <div className={safeStyles.recordingBtn}>
        {!isRecording && !audioURL && (
          <button
            type="button"
            onClick={handleStartRecording}
            className={safeStyles.button}
            disabled={disabled}
            aria-label="Start recording"
            tabIndex={0}
          >
            Start Recording
          </button>
        )}

        {isRecording && (
          <React.Fragment>
            <button
              type="button"
              onClick={handleStopRecording}
              className={`${safeStyles.button} ${safeStyles.stopButton}`}
              disabled={disabled}
              aria-label="Stop recording"
              tabIndex={0}
            >
              Stop Recording
            </button>
            {showPauseButton && (
              <button
                type="button"
                onClick={isPaused ? handleResumeRecording : handlePauseRecording}
                className={`${safeStyles.button} ${safeStyles.pauseButton}`}
                disabled={disabled}
                aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
                tabIndex={0}
              >
                {isPaused ? 'Resume Recording' : 'Pause Recording'}
              </button>
            )}
          </React.Fragment>
        )}

        {audioURL && (
          <React.Fragment>
            {showAudioPlayUI && (
              <div className={safeStyles.audioPlay}>
                <audio
                  controls
                  src={audioURL}
                  className={safeStyles.audioPlayer}
                  aria-label="Recorded audio playback"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className={safeStyles.actions}>
              {showDownloadButton && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className={`${safeStyles.button} ${safeStyles.downloadButton}`}
                  disabled={disabled}
                  aria-label="Download recording"
                  tabIndex={0}
                >
                  Download
                </button>
              )}

              {showClearButton && (
                <button
                  type="button"
                  onClick={handleClearRecording}
                  className={`${safeStyles.button} ${safeStyles.clearButton}`}
                  disabled={disabled}
                  aria-label="Clear recording"
                  tabIndex={0}
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={handleStartRecording}
                className={safeStyles.button}
                disabled={disabled}
                aria-label="Start new recording"
                tabIndex={0}
              >
                Record Again
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Recorder;

