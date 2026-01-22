import { useEffect, useState, useRef, useCallback } from 'react';

export interface UseRecorderReturn {
  audioURL: string | null;
  isRecording: boolean;
  isPaused: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
  error: string | null;
  audioBlob: Blob | null;
}

const useRecorder = (): UseRecorderReturn => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<InstanceType<typeof MediaRecorder> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const clearRecording = useCallback(() => {
    setAudioURL(prevURL => {
      if (prevURL) {
        URL.revokeObjectURL(prevURL);
      }
      return null;
    });
    setAudioBlob(null);
    chunksRef.current = [];
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      try {
        if (recorderRef.current.state === 'recording' || recorderRef.current.state === 'paused') {
          recorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
        setError(errorMessage);
        console.error('Error stopping recording:', err);
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (!recorderRef.current) {
      console.warn('No recorder instance available');
      return;
    }
    
    try {
      const recorderState = recorderRef.current.state;
      
      if (recorderState === 'recording') {
        recorderRef.current.pause();
        setIsPaused(true);
      } else if (recorderState === 'paused') {
        setIsPaused(true);
      } else {
        console.warn(`MediaRecorder is in '${recorderState}' state, cannot pause`);
        setError(`Cannot pause: recorder is ${recorderState}`);
        if (recorderState === 'inactive') {
          setIsRecording(false);
          setIsPaused(false);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause recording';
      setError(errorMessage);
      console.error('Error pausing recording:', err);
      if (recorderRef.current?.state === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (!recorderRef.current) {
      console.warn('No recorder instance available');
      return;
    }
    
    try {
      const recorderState = recorderRef.current.state;
      
      if (recorderState === 'paused') {
        recorderRef.current.resume();
        setIsPaused(false);
      } else if (recorderState === 'recording') {
        setIsPaused(false);
      } else {
        console.warn(`MediaRecorder is in '${recorderState}' state, cannot resume`);
        setError(`Cannot resume: recorder is ${recorderState}`);
        if (recorderState === 'inactive') {
          setIsRecording(false);
          setIsPaused(false);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume recording';
      setError(errorMessage);
      console.error('Error resuming recording:', err);
      if (recorderRef.current?.state === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (recorderRef.current) {
      const currentState = recorderRef.current.state;
      if (currentState === 'recording') {
        return;
      }
    }

    try {
      setError(null);
      
      if (recorderRef.current) {
        const currentState = recorderRef.current.state;
        if (currentState === 'recording' || currentState === 'paused') {
          try {
            recorderRef.current.stop();
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
        recorderRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setAudioURL(prevURL => {
        if (prevURL) {
          URL.revokeObjectURL(prevURL);
        }
        return null;
      });
      setAudioBlob(null);
      chunksRef.current = [];
      setIsPaused(false);
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } 
        });
      } catch (getUserMediaError) {
        throw new Error(`Microphone access denied: ${getUserMediaError instanceof Error ? getUserMediaError.message : 'Unknown error'}`);
      }
      
      if (!stream || stream.getTracks().length === 0) {
        throw new Error('Failed to get audio stream');
      }

      const initialAudioTrack = stream.getAudioTracks()[0];
      if (!initialAudioTrack || initialAudioTrack.readyState !== 'live') {
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Audio track is not active');
      }

      streamRef.current = stream;

      let mediaRecorder: InstanceType<typeof MediaRecorder> | null = null;
      let selectedMimeType: string | undefined = undefined;
      
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav',
      ];
      
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (selectedMimeType) {
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
        } catch (createError) {
          console.warn('Failed to create MediaRecorder with mimeType', selectedMimeType, ':', createError);
          mediaRecorder = null;
        }
      }
      
      if (!mediaRecorder) {
        try {
          mediaRecorder = new MediaRecorder(stream);
        } catch (fallbackError) {
          stream.getTracks().forEach(track => track.stop());
          throw new Error(`Failed to create MediaRecorder: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
        }
      }
      
      if (!mediaRecorder) {
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Failed to create MediaRecorder: unexpected error');
      }

      chunksRef.current = [];
      const handleDataAvailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      const handleStop = () => {
        const currentRecorder = recorderRef.current;
        if (!currentRecorder) {
          return;
        }
        
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { 
            type: currentRecorder.mimeType || 'audio/webm' 
          });
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
        } else {
          if (currentRecorder.state === 'inactive') {
            setIsRecording(false);
            setIsPaused(false);
          }
          return;
        }
        
        setIsRecording(false);
        setIsPaused(false);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        recorderRef.current = null;
      };

      const handleError = (event: Event) => {
        const currentRecorder = recorderRef.current;
        if (!currentRecorder) return;
        
        const errorEvent = event as MediaRecorderErrorEvent;
        const errorMessage = errorEvent.error?.message || 'Recording error occurred';
        console.error('MediaRecorder error:', errorMessage);
        
        setError(errorMessage);
        
        if (currentRecorder.state === 'recording' || currentRecorder.state === 'paused') {
          setIsRecording(false);
          setIsPaused(false);
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          recorderRef.current = null;
        }
      };

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;
      mediaRecorder.onerror = handleError;

      recorderRef.current = mediaRecorder;
      
      const initialState = mediaRecorder.state;
      if (initialState !== 'inactive') {
        stream.getTracks().forEach(track => track.stop());
        recorderRef.current = null;
        throw new Error(`Cannot start: MediaRecorder is in '${initialState}' state`);
      }

      if (!stream.active || stream.getTracks().length === 0) {
        stream.getTracks().forEach(track => track.stop());
        recorderRef.current = null;
        throw new Error('Stream is not active, cannot start recording');
      }

      const trackBeforeStart = stream.getAudioTracks()[0];
      if (!trackBeforeStart || trackBeforeStart.readyState !== 'live') {
        stream.getTracks().forEach(track => track.stop());
        recorderRef.current = null;
        throw new Error(`Audio track is not live. State: ${trackBeforeStart?.readyState || 'missing'}`);
      }

      let startSuccess = false;
      let startError: Error | null = null;
      
      try {
        mediaRecorder.start();
        startSuccess = true;
      } catch (noTimesliceError) {
        startError = noTimesliceError instanceof Error ? noTimesliceError : new Error('Unknown error');
        
        try {
          mediaRecorder.start(1000);
          startSuccess = true;
          startError = null;
        } catch (timesliceError) {
          console.error('Failed to start MediaRecorder:', timesliceError);
          startError = timesliceError instanceof Error ? timesliceError : new Error('Unknown error');
        }
      }
      
      if (!startSuccess) {
        stream.getTracks().forEach(track => track.stop());
        recorderRef.current = null;
        const errorMsg = startError?.message || 'Unknown error';
        const errorName = startError instanceof DOMException ? startError.name : 'Unknown';
        throw new Error(`Failed to start MediaRecorder: ${errorName} - ${errorMsg}`);
      }
      
      setIsRecording(true);
      setIsPaused(false);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      const finalState = mediaRecorder.state;
      
      if (finalState !== 'recording') {
        if (finalState === 'inactive') {
          const streamStillValid = stream.active && 
                                   stream.getTracks().length > 0 && 
                                   stream.getAudioTracks()[0]?.readyState === 'live';
          
          if (!streamStillValid) {
            // Stream invalid, go straight to fresh stream recovery
          } else {
            try {
              if (recorderRef.current) {
                try {
                  if (recorderRef.current.state !== 'inactive') {
                    recorderRef.current.stop();
                  }
                } catch (e) {
                  // Ignore cleanup errors
                }
                recorderRef.current = null;
              }
              
              const freshRecorder = new MediaRecorder(stream);
              freshRecorder.ondataavailable = handleDataAvailable;
              freshRecorder.onstop = handleStop;
              freshRecorder.onerror = handleError;
              
              const freshState = freshRecorder.state as string;
              if (freshState !== 'inactive') {
                throw new Error(`Fresh MediaRecorder is not in inactive state: ${freshState}`);
              }
              
              try {
                freshRecorder.start();
              } catch (startError) {
                freshRecorder.start(1000);
              }
              
              await new Promise(resolve => setTimeout(resolve, 150));
              
              if (freshRecorder.state === 'recording') {
                recorderRef.current = freshRecorder;
                return;
              }
            } catch (recoveryError) {
              // Continue to fresh stream recovery
            }
          }
          
          try {
            if (recorderRef.current) {
              try {
                if (recorderRef.current.state !== 'inactive') {
                  recorderRef.current.stop();
                }
              } catch (e) {
                // Ignore cleanup errors
              }
              recorderRef.current = null;
            }
            
            if (streamRef.current && streamRef.current !== stream) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (stream && stream.active) {
              stream.getTracks().forEach(track => track.stop());
            }
            
            const freshStream = await navigator.mediaDevices.getUserMedia({ 
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              } 
            });
            
            if (!freshStream || !freshStream.active || freshStream.getTracks().length === 0) {
              throw new Error('Failed to get fresh stream');
            }
            
            const freshAudioTrack = freshStream.getAudioTracks()[0];
            if (!freshAudioTrack || freshAudioTrack.readyState !== 'live') {
              freshStream.getTracks().forEach(track => track.stop());
              throw new Error(`Fresh stream audio track is not live. State: ${freshAudioTrack?.readyState || 'missing'}`);
            }
            
            const finalRecorder = new MediaRecorder(freshStream);
            finalRecorder.ondataavailable = handleDataAvailable;
            finalRecorder.onstop = handleStop;
            finalRecorder.onerror = handleError;
            
            streamRef.current = freshStream;
            
            try {
              finalRecorder.start();
            } catch (startError) {
              finalRecorder.start(1000);
            }
            
            await new Promise(resolve => setTimeout(resolve, 150));
            
            if (finalRecorder.state === 'recording') {
              recorderRef.current = finalRecorder;
              chunksRef.current = [];
              return;
            } else {
              throw new Error(`Final recovery failed. State: ${finalRecorder.state}`);
            }
          } catch (finalError) {
            setIsRecording(false);
            setIsPaused(false);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              streamRef.current = null;
            }
            recorderRef.current = null;
            throw new Error(`MediaRecorder failed to start after all recovery attempts. Final error: ${finalError instanceof Error ? finalError.message : 'Unknown error'}`);
          }
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to start recording';
      setError(errorMessage);
      setIsRecording(false);
      setIsPaused(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (recorderRef.current) {
        recorderRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        try {
          const state = recorderRef.current.state;
          if (state === 'recording' || state === 'paused') {
            recorderRef.current.stop();
          }
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, []);

  return {
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
  };
};

export default useRecorder;

