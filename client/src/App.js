import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Demo from './pages/Demo';
import NewDemo from './pages/NewDemo';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/demo/:id" element={<Demo />} />
          <Route path="/create" element={<NewDemo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;