function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var requestRecorder = function requestRecorder() {
  try {
    return Promise.resolve(navigator.mediaDevices.getUserMedia({
      audio: true
    })).then(function (stream) {
      return new MediaRecorder(stream);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var useRecorder = function useRecorder() {
  var _useState = React.useState(""),
      audioURL = _useState[0],
      setAudioURL = _useState[1];

  var _useState2 = React.useState(false),
      isRecording = _useState2[0],
      setIsRecording = _useState2[1];

  var _useState3 = React.useState(null),
      recorder = _useState3[0],
      setRecorder = _useState3[1];

  React.useEffect(function () {
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }

      return;
    }

    if (recorder) {
      if (isRecording) {
        recorder.start();
      } else {
        recorder.stop();
      }
    }

    var handleData = function handleData(e) {
      setAudioURL(URL.createObjectURL(e.data));
    };

    recorder.addEventListener("dataavailable", handleData);
    return function () {
      return recorder.removeEventListener("dataavailable", handleData);
    };
  }, [recorder, isRecording]);

  var startRecording = function startRecording() {
    setIsRecording(true);
  };

  var stopRecording = function stopRecording() {
    setIsRecording(false);
  };

  return [audioURL, isRecording, startRecording, stopRecording];
};

var styles = {"container":"_1Lxpd","counter":"_1MOur","audioPlay":"_1ZY0O","recordingBtn":"_3mmd9"};

var Recorder = function Recorder(_ref) {
  var blobUrl = _ref.blobUrl,
      _ref$showAudioPlayUI = _ref.showAudioPlayUI,
      showAudioPlayUI = _ref$showAudioPlayUI === void 0 ? true : _ref$showAudioPlayUI,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? "" : _ref$title,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? "" : _ref$className,
      _ref$hideAudioTitle = _ref.hideAudioTitle,
      hideAudioTitle = _ref$hideAudioTitle === void 0 ? false : _ref$hideAudioTitle,
      status = _ref.status;

  var _useRecorder = useRecorder(),
      audioURL = _useRecorder[0],
      isRecording = _useRecorder[1],
      startRecording = _useRecorder[2],
      stopRecording = _useRecorder[3];

  var _useState = React.useState(0),
      seconds = _useState[0],
      setSeconds = _useState[1];

  var _useState2 = React.useState(0),
      minutes = _useState2[0],
      setMinutes = _useState2[1];

  var _useState3 = React.useState(false),
      start = _useState3[0],
      setStart = _useState3[1];

  var _useState4 = React.useState(""),
      audioBlob = _useState4[0],
      setAudioBlob = _useState4[1];

  React.useEffect(function () {
    if (start) {
      if (seconds <= 60) {
        if (seconds >= 0 && seconds <= 29) {
          setTimeout(function () {
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
      } else if (seconds >= 60) {
        handleRecording();
        console.log("You can record only 60 minutes audio.");
      }
    } else {
      setSeconds(0);
      setMinutes(0);
    }
  }, [seconds, start]);

  var handleRecording = function handleRecording() {
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
  React.useEffect(function () {
    if (audioURL) {
      status && status("Completed");
      setAudioBlob(audioURL);
      blobUrl && blobUrl(audioURL);
    }
  }, [audioURL]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: styles.container + " " + className
  }, !hideAudioTitle && /*#__PURE__*/React__default.createElement("h3", null, title ? title : "Audio Recorder"), /*#__PURE__*/React__default.createElement("div", {
    className: "" + styles.counter
  }, " ", (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)), /*#__PURE__*/React__default.createElement("div", {
    className: "" + styles.recordingBtn
  }, showAudioPlayUI && /*#__PURE__*/React__default.createElement("div", {
    className: "" + styles.audioPlay
  }, audioBlob && /*#__PURE__*/React__default.createElement("audio", {
    controls: true
  }, /*#__PURE__*/React__default.createElement("source", {
    src: audioBlob
  }))), /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return handleRecording();
    }
  }, !isRecording ? "Start Recording" : "Stop Recording")));
};

exports.Recorder = Recorder;
//# sourceMappingURL=index.js.map
