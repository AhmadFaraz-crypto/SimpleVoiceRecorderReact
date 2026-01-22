import React from 'react';
import Documentation from '../components/Documentation';
import './DocsPage.scss';

const DocsPage: React.FC = () => {
  return (
    <div className="docs-page">
      <div className="section-header">
        <h1 className="page-title">Documentation</h1>
        <p className="page-description">
          Complete API reference, usage examples, and guides
        </p>
      </div>
      <Documentation />
    </div>
  );
};

export default DocsPage;

