import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Demo from './pages/Demo';
import NewDemo from './pages/NewDemo';
import ErrorPage from './pages/ErrorPage';
import Documentation from './pages/Documentation';
import Home from './pages/Home';
import Presentations from './pages/Presentations';

function App() {
  try{
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/demo/:id" element={<Demo />} />
          <Route path="/create" element={<NewDemo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/tutorial" element={<Demo id="IDtutorial" />} />
          <Route path="/presentations" element={<Presentations />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
  }catch(e){
    // write error to the log file in "client/logs" folder
    console.log(e);
    // redirect to error page
    window.location.href = "/error";
  }
}

export default App;