function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var useRecorder = function useRecorder() {
  var _useState = React.useState(null),
    audioURL = _useState[0],
    setAudioURL = _useState[1];
  var _useState2 = React.useState(false),
    isRecording = _useState2[0],
    setIsRecording = _useState2[1];
  var _useState3 = React.useState(false),
    isPaused = _useState3[0],
    setIsPaused = _useState3[1];
  var _useState4 = React.useState(null),
    error = _useState4[0],
    setError = _useState4[1];
  var _useState5 = React.useState(null),
    audioBlob = _useState5[0],
    setAudioBlob = _useState5[1];
  var recorderRef = React.useRef(null);
  var streamRef = React.useRef(null);
  var chunksRef = React.useRef([]);
  var clearRecording = React.useCallback(function () {
    setAudioURL(function (prevURL) {
      if (prevURL) {
        URL.revokeObjectURL(prevURL);
      }
      return null;
    });
    setAudioBlob(null);
    chunksRef.current = [];
  }, []);
  var stopRecording = React.useCallback(function () {
    if (recorderRef.current && isRecording) {
      try {
        if (recorderRef.current.state === 'recording' || recorderRef.current.state === 'paused') {
          recorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
      } catch (err) {
        var errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
        setError(errorMessage);
        console.error('Error stopping recording:', err);
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, [isRecording]);
  var pauseRecording = React.useCallback(function () {
    if (!recorderRef.current) {
      console.warn('No recorder instance available');
      return;
    }
    try {
      var recorderState = recorderRef.current.state;
      if (recorderState === 'recording') {
        recorderRef.current.pause();
        setIsPaused(true);
      } else if (recorderState === 'paused') {
        setIsPaused(true);
      } else {
        console.warn("MediaRecorder is in '" + recorderState + "' state, cannot pause");
        setError("Cannot pause: recorder is " + recorderState);
        if (recorderState === 'inactive') {
          setIsRecording(false);
          setIsPaused(false);
        }
      }
    } catch (err) {
      var _recorderRef$current;
      var errorMessage = err instanceof Error ? err.message : 'Failed to pause recording';
      setError(errorMessage);
      console.error('Error pausing recording:', err);
      if (((_recorderRef$current = recorderRef.current) === null || _recorderRef$current === void 0 ? void 0 : _recorderRef$current.state) === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, []);
  var resumeRecording = React.useCallback(function () {
    if (!recorderRef.current) {
      console.warn('No recorder instance available');
      return;
    }
    try {
      var recorderState = recorderRef.current.state;
      if (recorderState === 'paused') {
        recorderRef.current.resume();
        setIsPaused(false);
      } else if (recorderState === 'recording') {
        setIsPaused(false);
      } else {
        console.warn("MediaRecorder is in '" + recorderState + "' state, cannot resume");
        setError("Cannot resume: recorder is " + recorderState);
        if (recorderState === 'inactive') {
          setIsRecording(false);
          setIsPaused(false);
        }
      }
    } catch (err) {
      var _recorderRef$current2;
      var errorMessage = err instanceof Error ? err.message : 'Failed to resume recording';
      setError(errorMessage);
      console.error('Error resuming recording:', err);
      if (((_recorderRef$current2 = recorderRef.current) === null || _recorderRef$current2 === void 0 ? void 0 : _recorderRef$current2.state) === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, []);
  var startRecording = React.useCallback(function () {
    try {
      if (recorderRef.current) {
        var currentState = recorderRef.current.state;
        if (currentState === 'recording') {
          return Promise.resolve();
        }
      }
      return Promise.resolve(_catch(function () {
        function _temp9() {
          var _exit = false;
          function _temp7(_result) {
            if (_exit) return _result;
            if (!stream || stream.getTracks().length === 0) {
              throw new Error('Failed to get audio stream');
            }
            var initialAudioTrack = stream.getAudioTracks()[0];
            if (!initialAudioTrack || initialAudioTrack.readyState !== 'live') {
              stream.getTracks().forEach(function (track) {
                return track.stop();
              });
              throw new Error('Audio track is not active');
            }
            streamRef.current = stream;
            var mediaRecorder = null;
            var selectedMimeType = undefined;
            var mimeTypes = ['audio/webm', 'audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/wav'];
            for (var _i = 0, _mimeTypes = mimeTypes; _i < _mimeTypes.length; _i++) {
              var mimeType = _mimeTypes[_i];
              if (MediaRecorder.isTypeSupported(mimeType)) {
                selectedMimeType = mimeType;
                break;
              }
            }
            if (selectedMimeType) {
              try {
                mediaRecorder = new MediaRecorder(stream, {
                  mimeType: selectedMimeType
                });
              } catch (createError) {
                console.warn('Failed to create MediaRecorder with mimeType', selectedMimeType, ':', createError);
                mediaRecorder = null;
              }
            }
            if (!mediaRecorder) {
              try {
                mediaRecorder = new MediaRecorder(stream);
              } catch (fallbackError) {
                stream.getTracks().forEach(function (track) {
                  return track.stop();
                });
                throw new Error("Failed to create MediaRecorder: " + (fallbackError instanceof Error ? fallbackError.message : 'Unknown error'));
              }
            }
            if (!mediaRecorder) {
              stream.getTracks().forEach(function (track) {
                return track.stop();
              });
              throw new Error('Failed to create MediaRecorder: unexpected error');
            }
            chunksRef.current = [];
            var handleDataAvailable = function handleDataAvailable(event) {
              if (event.data && event.data.size > 0) {
                chunksRef.current.push(event.data);
              }
            };
            var handleStop = function handleStop() {
              var currentRecorder = recorderRef.current;
              if (!currentRecorder) {
                return;
              }
              if (chunksRef.current.length > 0) {
                var blob = new Blob(chunksRef.current, {
                  type: currentRecorder.mimeType || 'audio/webm'
                });
                setAudioBlob(blob);
                var url = URL.createObjectURL(blob);
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
                streamRef.current.getTracks().forEach(function (track) {
                  return track.stop();
                });
                streamRef.current = null;
              }
              recorderRef.current = null;
            };
            var handleError = function handleError(event) {
              var _errorEvent$error;
              var currentRecorder = recorderRef.current;
              if (!currentRecorder) return;
              var errorEvent = event;
              var errorMessage = ((_errorEvent$error = errorEvent.error) === null || _errorEvent$error === void 0 ? void 0 : _errorEvent$error.message) || 'Recording error occurred';
              console.error('MediaRecorder error:', errorMessage);
              setError(errorMessage);
              if (currentRecorder.state === 'recording' || currentRecorder.state === 'paused') {
                setIsRecording(false);
                setIsPaused(false);
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach(function (track) {
                    return track.stop();
                  });
                  streamRef.current = null;
                }
                recorderRef.current = null;
              }
            };
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop;
            mediaRecorder.onerror = handleError;
            recorderRef.current = mediaRecorder;
            var initialState = mediaRecorder.state;
            if (initialState !== 'inactive') {
              stream.getTracks().forEach(function (track) {
                return track.stop();
              });
              recorderRef.current = null;
              throw new Error("Cannot start: MediaRecorder is in '" + initialState + "' state");
            }
            if (!stream.active || stream.getTracks().length === 0) {
              stream.getTracks().forEach(function (track) {
                return track.stop();
              });
              recorderRef.current = null;
              throw new Error('Stream is not active, cannot start recording');
            }
            var trackBeforeStart = stream.getAudioTracks()[0];
            if (!trackBeforeStart || trackBeforeStart.readyState !== 'live') {
              stream.getTracks().forEach(function (track) {
                return track.stop();
              });
              recorderRef.current = null;
              throw new Error("Audio track is not live. State: " + ((trackBeforeStart === null || trackBeforeStart === void 0 ? void 0 : trackBeforeStart.readyState) || 'missing'));
            }
            var startSuccess = false;
            var startError = null;
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
              var _startError;
              stream.getTracks().forEach(function (track) {
                return track.stop();
              });
              recorderRef.current = null;
              var errorMsg = ((_startError = startError) === null || _startError === void 0 ? void 0 : _startError.message) || 'Unknown error';
              var errorName = startError instanceof DOMException ? startError.name : 'Unknown';
              throw new Error("Failed to start MediaRecorder: " + errorName + " - " + errorMsg);
            }
            setIsRecording(true);
            setIsPaused(false);
            return Promise.resolve(new Promise(function (resolve) {
              return setTimeout(resolve, 150);
            })).then(function () {
              var _exit2 = false;
              var finalState = mediaRecorder.state;
              return function () {
                if (finalState !== 'recording') {
                  return function () {
                    if (finalState === 'inactive') {
                      var _stream$getAudioTrack;
                      var _temp0 = function _temp0(_result3) {
                        return _exit2 ? _result3 : _catch(function () {
                          if (recorderRef.current) {
                            try {
                              if (recorderRef.current.state !== 'inactive') {
                                recorderRef.current.stop();
                              }
                            } catch (e) {}
                            recorderRef.current = null;
                          }
                          if (streamRef.current && streamRef.current !== stream) {
                            streamRef.current.getTracks().forEach(function (track) {
                              return track.stop();
                            });
                          }
                          if (stream && stream.active) {
                            stream.getTracks().forEach(function (track) {
                              return track.stop();
                            });
                          }
                          return Promise.resolve(navigator.mediaDevices.getUserMedia({
                            audio: {
                              echoCancellation: true,
                              noiseSuppression: true,
                              autoGainControl: true
                            }
                          })).then(function (freshStream) {
                            if (!freshStream || !freshStream.active || freshStream.getTracks().length === 0) {
                              throw new Error('Failed to get fresh stream');
                            }
                            var freshAudioTrack = freshStream.getAudioTracks()[0];
                            if (!freshAudioTrack || freshAudioTrack.readyState !== 'live') {
                              freshStream.getTracks().forEach(function (track) {
                                return track.stop();
                              });
                              throw new Error("Fresh stream audio track is not live. State: " + ((freshAudioTrack === null || freshAudioTrack === void 0 ? void 0 : freshAudioTrack.readyState) || 'missing'));
                            }
                            var finalRecorder = new MediaRecorder(freshStream);
                            finalRecorder.ondataavailable = handleDataAvailable;
                            finalRecorder.onstop = handleStop;
                            finalRecorder.onerror = handleError;
                            streamRef.current = freshStream;
                            try {
                              finalRecorder.start();
                            } catch (startError) {
                              finalRecorder.start(1000);
                            }
                            return Promise.resolve(new Promise(function (resolve) {
                              return setTimeout(resolve, 150);
                            })).then(function () {
                              if (finalRecorder.state === 'recording') {
                                recorderRef.current = finalRecorder;
                                chunksRef.current = [];
                              } else {
                                throw new Error("Final recovery failed. State: " + finalRecorder.state);
                              }
                            });
                          });
                        }, function (finalError) {
                          setIsRecording(false);
                          setIsPaused(false);
                          if (streamRef.current) {
                            streamRef.current.getTracks().forEach(function (track) {
                              return track.stop();
                            });
                            streamRef.current = null;
                          }
                          recorderRef.current = null;
                          throw new Error("MediaRecorder failed to start after all recovery attempts. Final error: " + (finalError instanceof Error ? finalError.message : 'Unknown error'));
                        });
                      };
                      var streamStillValid = stream.active && stream.getTracks().length > 0 && ((_stream$getAudioTrack = stream.getAudioTracks()[0]) === null || _stream$getAudioTrack === void 0 ? void 0 : _stream$getAudioTrack.readyState) === 'live';
                      var _temp1 = function () {
                        if (!streamStillValid) {} else {
                          return _catch(function () {
                            if (recorderRef.current) {
                              try {
                                if (recorderRef.current.state !== 'inactive') {
                                  recorderRef.current.stop();
                                }
                              } catch (e) {}
                              recorderRef.current = null;
                            }
                            var freshRecorder = new MediaRecorder(stream);
                            freshRecorder.ondataavailable = handleDataAvailable;
                            freshRecorder.onstop = handleStop;
                            freshRecorder.onerror = handleError;
                            var freshState = freshRecorder.state;
                            if (freshState !== 'inactive') {
                              throw new Error("Fresh MediaRecorder is not in inactive state: " + freshState);
                            }
                            try {
                              freshRecorder.start();
                            } catch (startError) {
                              freshRecorder.start(1000);
                            }
                            return Promise.resolve(new Promise(function (resolve) {
                              return setTimeout(resolve, 150);
                            })).then(function () {
                              if (freshRecorder.state === 'recording') {
                                recorderRef.current = freshRecorder;
                                _exit2 = true;
                              }
                            });
                          }, function () {});
                        }
                      }();
                      return _temp1 && _temp1.then ? _temp1.then(_temp0) : _temp0(_temp1);
                    }
                  }();
                }
              }();
            });
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(function (track) {
              return track.stop();
            });
            streamRef.current = null;
          }
          setAudioURL(function (prevURL) {
            if (prevURL) {
              URL.revokeObjectURL(prevURL);
            }
            return null;
          });
          setAudioBlob(null);
          chunksRef.current = [];
          setIsPaused(false);
          var stream;
          var _temp6 = _catch(function () {
            return Promise.resolve(navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            })).then(function (_navigator$mediaDevic) {
              stream = _navigator$mediaDevic;
            });
          }, function (getUserMediaError) {
            throw new Error("Microphone access denied: " + (getUserMediaError instanceof Error ? getUserMediaError.message : 'Unknown error'));
          });
          return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
        }
        setError(null);
        var _temp8 = function () {
          if (recorderRef.current) {
            var _temp10 = function _temp10() {
              recorderRef.current = null;
            };
            var _currentState = recorderRef.current.state;
            var _temp11 = function () {
              if (_currentState === 'recording' || _currentState === 'paused') {
                var _temp12 = _catch(function () {
                  recorderRef.current.stop();
                  return Promise.resolve(new Promise(function (resolve) {
                    return setTimeout(resolve, 100);
                  })).then(function () {});
                }, function () {});
                if (_temp12 && _temp12.then) return _temp12.then(function () {});
              }
            }();
            return _temp11 && _temp11.then ? _temp11.then(_temp10) : _temp10(_temp11);
          }
        }();
        return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
      }, function (err) {
        var errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
        setError(errorMessage);
        setIsRecording(false);
        setIsPaused(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(function (track) {
            return track.stop();
          });
          streamRef.current = null;
        }
        if (recorderRef.current) {
          recorderRef.current = null;
        }
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }, []);
  React.useEffect(function () {
    return function () {
      if (recorderRef.current) {
        try {
          var state = recorderRef.current.state;
          if (state === 'recording' || state === 'paused') {
            recorderRef.current.stop();
          }
        } catch (e) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(function (track) {
          return track.stop();
        });
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, []);
  return {
    audioURL: audioURL,
    isRecording: isRecording,
    isPaused: isPaused,
    startRecording: startRecording,
    stopRecording: stopRecording,
    pauseRecording: pauseRecording,
    resumeRecording: resumeRecording,
    clearRecording: clearRecording,
    error: error,
    audioBlob: audioBlob
  };
};

var styles = {"container":"_3IMWP","title":"_g-p72","counter":"_1ZFWh","error":"_3PFGE","recordingBtn":"_xFxQ7","audioPlay":"_NIIHD","audioPlayer":"_fIgaF","button":"_3wODo","stopButton":"_YxZNF","pauseButton":"_2Pz9d","downloadButton":"_3FSal","clearButton":"_1xtF4","actions":"_3jlgs"};

var Recorder = function Recorder(_ref) {
  var blobUrl = _ref.blobUrl,
    _ref$showAudioPlayUI = _ref.showAudioPlayUI,
    showAudioPlayUI = _ref$showAudioPlayUI === void 0 ? true : _ref$showAudioPlayUI,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? '' : _ref$title,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    _ref$hideAudioTitle = _ref.hideAudioTitle,
    hideAudioTitle = _ref$hideAudioTitle === void 0 ? false : _ref$hideAudioTitle,
    status = _ref.status,
    onRecordingStart = _ref.onRecordingStart,
    onRecordingStop = _ref.onRecordingStop,
    onRecordingPause = _ref.onRecordingPause,
    onRecordingResume = _ref.onRecordingResume,
    _ref$maxDuration = _ref.maxDuration,
    maxDuration = _ref$maxDuration === void 0 ? 0 : _ref$maxDuration,
    _ref$showDownloadButt = _ref.showDownloadButton,
    showDownloadButton = _ref$showDownloadButt === void 0 ? true : _ref$showDownloadButt,
    _ref$showPauseButton = _ref.showPauseButton,
    showPauseButton = _ref$showPauseButton === void 0 ? true : _ref$showPauseButton,
    _ref$showClearButton = _ref.showClearButton,
    showClearButton = _ref$showClearButton === void 0 ? true : _ref$showClearButton,
    _ref$downloadFileName = _ref.downloadFileName,
    downloadFileName = _ref$downloadFileName === void 0 ? 'recording' : _ref$downloadFileName,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled;
  var _useRecorder = useRecorder(),
    audioURL = _useRecorder.audioURL,
    isRecording = _useRecorder.isRecording,
    isPaused = _useRecorder.isPaused,
    startRecording = _useRecorder.startRecording,
    stopRecording = _useRecorder.stopRecording,
    pauseRecording = _useRecorder.pauseRecording,
    resumeRecording = _useRecorder.resumeRecording,
    clearRecording = _useRecorder.clearRecording,
    error = _useRecorder.error,
    audioBlob = _useRecorder.audioBlob;
  var _useState = React.useState(0),
    seconds = _useState[0],
    setSeconds = _useState[1];
  var _useState2 = React.useState(0),
    minutes = _useState2[0],
    setMinutes = _useState2[1];
  var _useState3 = React.useState(0),
    hours = _useState3[0],
    setHours = _useState3[1];
  var intervalRef = React.useRef(null);
  var totalSecondsRef = React.useRef(0);
  React.useEffect(function () {
    if (isRecording && !isPaused) {
      intervalRef.current = window.setInterval(function () {
        totalSecondsRef.current += 1;
        if (maxDuration > 0 && totalSecondsRef.current >= maxDuration) {
          stopRecording();
          return;
        }
        setSeconds(function (prevSeconds) {
          var newSeconds = prevSeconds + 1;
          if (newSeconds === 60) {
            setMinutes(function (prevMinutes) {
              var newMinutes = prevMinutes + 1;
              if (newMinutes === 60) {
                setHours(function (prevHours) {
                  return prevHours + 1;
                });
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
    return function () {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording, isPaused, maxDuration, stopRecording]);
  React.useEffect(function () {
    if (!isRecording && !audioURL) {
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      totalSecondsRef.current = 0;
    }
  }, [isRecording, audioURL]);
  React.useEffect(function () {
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
  React.useEffect(function () {
    if (blobUrl && audioURL) {
      blobUrl(audioURL);
    }
  }, [audioURL]);
  var handleStartRecording = function handleStartRecording() {
    try {
      if (disabled) return Promise.resolve();
      return Promise.resolve(startRecording()).then(function () {
        onRecordingStart === null || onRecordingStart === void 0 ? void 0 : onRecordingStart();
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var handleStopRecording = function handleStopRecording() {
    if (disabled) return;
    stopRecording();
    onRecordingStop === null || onRecordingStop === void 0 ? void 0 : onRecordingStop();
  };
  var handlePauseRecording = function handlePauseRecording() {
    if (disabled) return;
    pauseRecording();
    onRecordingPause === null || onRecordingPause === void 0 ? void 0 : onRecordingPause();
  };
  var handleResumeRecording = function handleResumeRecording() {
    if (disabled) return;
    resumeRecording();
    onRecordingResume === null || onRecordingResume === void 0 ? void 0 : onRecordingResume();
  };
  var handleClearRecording = function handleClearRecording() {
    if (disabled) return;
    clearRecording();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    totalSecondsRef.current = 0;
  };
  var handleDownload = function handleDownload() {
    if (!audioBlob || disabled) return;
    var url = URL.createObjectURL(audioBlob);
    var link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName + "." + (audioBlob.type.includes('webm') ? 'webm' : 'mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  var formatTime = function formatTime(h, m, s) {
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  };
  var safeStyles = styles && typeof styles === 'object' && !Array.isArray(styles) ? {
    container: styles.container || '',
    title: styles.title || '',
    counter: styles.counter || '',
    error: styles.error || '',
    recordingBtn: styles.recordingBtn || '',
    audioPlay: styles.audioPlay || '',
    audioPlayer: styles.audioPlayer || '',
    button: styles.button || '',
    stopButton: styles.stopButton || '',
    pauseButton: styles.pauseButton || '',
    downloadButton: styles.downloadButton || '',
    clearButton: styles.clearButton || '',
    actions: styles.actions || ''
  } : {
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
    actions: ''
  };
  var containerClasses = ((safeStyles.container || '') + " " + (className || '')).trim();
  return React__default.createElement("div", {
    className: containerClasses,
    role: "region",
    "aria-label": "Audio Recorder"
  }, !hideAudioTitle && React__default.createElement("h3", {
    className: safeStyles.title
  }, title || 'Audio Recorder'), error && React__default.createElement("div", {
    className: safeStyles.error,
    role: "alert",
    "aria-live": "polite"
  }, error), React__default.createElement("div", {
    className: safeStyles.counter,
    "aria-live": "polite",
    "aria-atomic": "true"
  }, formatTime(hours, minutes, seconds)), React__default.createElement("div", {
    className: safeStyles.recordingBtn
  }, !isRecording && !audioURL && React__default.createElement("button", {
    type: "button",
    onClick: handleStartRecording,
    className: safeStyles.button,
    disabled: disabled,
    "aria-label": "Start recording",
    tabIndex: 0
  }, "Start Recording"), isRecording && React__default.createElement(React__default.Fragment, null, React__default.createElement("button", {
    type: "button",
    onClick: handleStopRecording,
    className: safeStyles.button + " " + safeStyles.stopButton,
    disabled: disabled,
    "aria-label": "Stop recording",
    tabIndex: 0
  }, "Stop Recording"), showPauseButton && React__default.createElement("button", {
    type: "button",
    onClick: isPaused ? handleResumeRecording : handlePauseRecording,
    className: safeStyles.button + " " + safeStyles.pauseButton,
    disabled: disabled,
    "aria-label": isPaused ? 'Resume recording' : 'Pause recording',
    tabIndex: 0
  }, isPaused ? 'Resume Recording' : 'Pause Recording')), audioURL && React__default.createElement(React__default.Fragment, null, showAudioPlayUI && React__default.createElement("div", {
    className: safeStyles.audioPlay
  }, React__default.createElement("audio", {
    controls: true,
    src: audioURL,
    className: safeStyles.audioPlayer,
    "aria-label": "Recorded audio playback"
  }, "Your browser does not support the audio element.")), React__default.createElement("div", {
    className: safeStyles.actions
  }, showDownloadButton && React__default.createElement("button", {
    type: "button",
    onClick: handleDownload,
    className: safeStyles.button + " " + safeStyles.downloadButton,
    disabled: disabled,
    "aria-label": "Download recording",
    tabIndex: 0
  }, "Download"), showClearButton && React__default.createElement("button", {
    type: "button",
    onClick: handleClearRecording,
    className: safeStyles.button + " " + safeStyles.clearButton,
    disabled: disabled,
    "aria-label": "Clear recording",
    tabIndex: 0
  }, "Clear"), React__default.createElement("button", {
    type: "button",
    onClick: handleStartRecording,
    className: safeStyles.button,
    disabled: disabled,
    "aria-label": "Start new recording",
    tabIndex: 0
  }, "Record Again")))));
};

exports.Recorder = Recorder;
exports.default = Recorder;
exports.useRecorder = useRecorder;
//# sourceMappingURL=index.js.map
