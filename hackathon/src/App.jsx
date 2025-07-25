import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authorization from './pages/Auth'
import { Home } from './pages/Home'
function App() {


  return (
        <Router>
      <Routes>
        <Route path="/" element={<Authorization/>} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
