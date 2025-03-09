import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login/login'
import Home from './components/home/home.jsx'
import Signup from './components/signup/signup.jsx'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
