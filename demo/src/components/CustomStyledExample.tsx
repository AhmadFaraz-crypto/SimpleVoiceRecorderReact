import React from 'react';
import { Recorder } from 'simplevoicerecorderreact';
import './Example.scss';
import './CustomStyledExample.scss';

const CustomStyledExample: React.FC = () => {
  return (
    <div className="example">
      <div className="recorder-container">
        <Recorder
          className="custom-recorder-style"
          title="Custom Styled Recorder"
          blobUrl={(url) => console.log('Audio URL:', url)}
        />
      </div>

      <div className="code-block">
        <h3>Code:</h3>
        <pre>
          <code>{`import { Recorder } from 'simplevoicerecorderreact';
import './CustomStyles.scss';

function App() {
  return (
    <Recorder
      className="custom-recorder-style"
      title="Custom Styled Recorder"
    />
  );
}

// CustomStyles.scss
.custom-recorder-style {
  border: 2px solid #667eea;
  border-radius: 16px;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}`}</code>
        </pre>
      </div>
    </div>
  );
};

export default CustomStyledExample;

