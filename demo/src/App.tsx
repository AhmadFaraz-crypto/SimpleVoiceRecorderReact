import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DemosPage from './pages/DemosPage';
import DocsPage from './pages/DocsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demos" element={<DemosPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
