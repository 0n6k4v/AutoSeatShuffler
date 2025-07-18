import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingWithTriangle'
import EventSeatChart from './Pages/EventSeatChart'
import AdminPage from './Pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/eventSeatChart' element={<EventSeatChart />} />
      <Route path='/Admin' element={<AdminPage />} />
    </Routes>
  )
}

export default App