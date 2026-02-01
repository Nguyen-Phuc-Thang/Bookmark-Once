import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home';
import UserGuide from './pages/UserGuide';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-guide" element={<UserGuide />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
