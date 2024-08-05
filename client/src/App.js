import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Demo from './pages/Demo';
import NewDemo from './pages/NewDemo';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/demo/:id" element={<Demo />} />
          <Route path="/newDemo" element={<NewDemo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NewDemo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;