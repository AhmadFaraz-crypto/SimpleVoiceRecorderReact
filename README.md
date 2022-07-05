# simplevoicerecorderreact

# Installation

```npm i simplevoicerecorderreact```

# Import in your project file

```
import {Recorder} from 'simplevoicerecorderreact'
```

# Declare inside the render menthod


```

handleRecordingStatus(status) {
    console.log(status);
}

handleCountDown(data) {
    console.log(data);
}

handleAudioUrl = (url) => {
    console.log(url)
}

<Recorder
    blobUrl={handleAudioUrl}
    showAudioPlayUI={true}
    className={""}
    title={""}
    hideAudioTitle={false}
    status={handleRecordingStatus}
/>

```


## Props

Common props you may want to specify include:
 
- `title` - Title for the Model
- `hideAudioTitle` - To hide the header which showing title
- `blobUrl` - To hear what has been recorded.
- `showAudioPlayUI` - Either need to show HTML5 audio tag after stopped or not.
- `className` - UI style