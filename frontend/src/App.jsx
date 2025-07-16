import React, { useRef, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
<<<<<<< HEAD
import MainPage from './mainPage'
import Random from './random'
=======
import ShuffleSeat from './Test/Utils/ShuffleSeat'
import LandingWithBird from './Test/Pages/BlackTheme/LandingWithBird'
import LandingWithTriangle from './Test/Pages/BlackTheme/LandingWithTriangle'
import BuildTawicha from './Test/Utils/BuildTawicha'
import FlyingBird from './Test/Pages/YellowTheme/FlyingBird'
import LandingWithTriangleYellow from './Test/Pages/YellowTheme/LandingWithTriangle'
import Tawicha from './Test/Utils/Tawicha'
import RoundTableSeatPicker from './Test/Utils/RoundTableSeatPicker'
import OwlYellow from './Test/Utils/OwlYellow'
import Home from './Home'
import HomePetch from './HomePetch'
import LandingWithTriangleWhite from './Test/Pages/WhiteTheme/LandingWithTriangle'
import YellowTheme from './Test/Pages/YellowTheme/yellow'
>>>>>>> main

function App() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7
    }
  }, [])

  return (
<<<<<<< HEAD
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
=======
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shuffle-seat" element={<ShuffleSeat />} />
      <Route path="/landing-bird" element={<LandingWithBird />} />
      <Route path="/landing-triangle" element={<LandingWithTriangle />} />
      <Route path="/build-tawicha" element={<BuildTawicha />} />
      <Route path="/flying-bird" element={<FlyingBird />} />
      <Route path="/landing-triangle-yellow" element={<LandingWithTriangleYellow />} />
      <Route path="/tawicha" element={<Tawicha />} />
      <Route path="/round-table-seat-picker" element={<RoundTableSeatPicker />} />
      <Route path="/owl-yellow" element={<OwlYellow />} />
      <Route path="/homepetch/*" element={<HomePetch />} />
      <Route path="/landing-triangle-white" element={<LandingWithTriangleWhite />} />
      <Route path="/yellow" element={<YellowTheme />} />
    </Routes>
>>>>>>> main
  )
}

export default App