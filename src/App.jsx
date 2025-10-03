import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login/login'
import Home from './components/home/home.jsx'
import Signup from './components/signup/signup.jsx'
import Dashboard from './components/dashboard/dashboard.jsx'
import './App.css'

function App() {

  return (
    <div ClassName="h-screen w-screen bg-[#FEF9E1]">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h1>Route not found</h1>} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
