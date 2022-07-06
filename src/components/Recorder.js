import React, { useState, useEffect } from "react";
import useRecorder from "./useRecorder";
import styles from '../styles.module.css';

const Recorder = ({
  blobUrl,
  showAudioPlayUI = true,
  title = "",
  className = "",
  hideAudioTitle = false,
  status,
}) => {
  const [audioURL, isRecording, startRecording, stopRecording] = useRecorder();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [start, setStart] = useState(false);
  const [audioBlob, setAudioBlob] = useState("");

  useEffect(() => {
    if (start) {
      if (minutes <= 60) {
        if (seconds >= 0) {
          setTimeout(() => {
            if (seconds + 1 === 60) {
              setSeconds(0);
              setMinutes(minutes + 1);
            } else {
              setSeconds(seconds + 1);
            }
          }, 1000);
        } else {
          setSeconds(0);
          setMinutes(0);
          stopRecording();
        }
      } else if (minutes >= 60) {
        handleRecording();
        console.log("You can record only 60 minutes audio.");
      }
    } else {
      setSeconds(0);
      setMinutes(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, start]);

  const handleRecording = () => {
    if (isRecording) {
      setStart(false);
      stopRecording();
      status && status("Progress");
    } else {
      startRecording();
      setStart(true);
      status && status("Recording");
    }
  };

  console.log("seconds", seconds);

  useEffect(() => {
    if (audioURL) {
      status && status("Completed");
      setAudioBlob(audioURL);
      blobUrl && blobUrl(audioURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioURL]);

  return (
    <div className={`${styles.container} ${className}`}>
      {!hideAudioTitle && <h3>{title ? title : "Audio Recorder"}</h3>}
      <div className={`${styles.counter}`}>
        {" "}
        {`${minutes < 10 ? `0${minutes}` : minutes}:${
          seconds < 10 ? `0${seconds}` : seconds
        }`}
      </div>
      <div className={`${styles.recordingBtn}`}>
        {showAudioPlayUI && (
          <div className={`${styles.audioPlay}`}>
            {audioBlob && (
              <audio controls>
                <source src={audioBlob} />
              </audio>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => handleRecording()}
        >
          {!isRecording ? "Start Recording" : "Stop Recording"}
        </button>
      </div>
    </div>
  );
};

export default Recorder;
