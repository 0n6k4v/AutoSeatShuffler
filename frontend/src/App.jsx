import React, { useRef, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainPage from './mainPage'
import Random from './random'

function App() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* วิดีโอพื้นหลัง */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
      >
        <source src="/src/assets/bgvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/random" element={<Random />} />
      </Routes>
    </div>
  )
}

export default App