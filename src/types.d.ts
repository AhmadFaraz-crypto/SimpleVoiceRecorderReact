declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Ensure MediaRecorder and related DOM types are available
interface MediaRecorderConstructor {
  new(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
  prototype: MediaRecorder;
  isTypeSupported(type: string): boolean;
}

declare var MediaRecorder: MediaRecorderConstructor;

interface BlobEvent extends Event {
  readonly data: Blob;
  readonly timecode: number;
}

interface MediaRecorderErrorEvent extends Event {
  error?: DOMException;
}
