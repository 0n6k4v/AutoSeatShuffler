import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
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
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h2 style={{ marginBottom: 32, color: '#1e293b', fontWeight: 700, fontSize: 28 }}>
          เลือกธีมหรือฟีเจอร์ที่ต้องการ
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            width: '100%',
            maxWidth: 700
          }}
        >
          <Link to="/shuffle-seat">
            <button style={buttonStyle}>สุ่มที่นั่ง (Shuffle Seat)</button>
          </Link>
          <Link to="/landing-bird">
            <button style={buttonStyle}>ธีมดำ - นกบิน (Landing With Bird)</button>
          </Link>
          <Link to="/landing-triangle">
            <button style={buttonStyle}>ธีมดำ - สามเหลี่ยม (Landing With Triangle)</button>
          </Link>
          <Link to="/landing-triangle-white">
            <button style={buttonStyle}>ธีมขาว - สามเหลี่ยม (Landing With Triangle White)</button>
          </Link>
          <Link to="/build-tawicha">
            <button style={buttonStyle}>สร้างตาวิชา (Build Tawicha)</button>
          </Link>
          <Link to="/flying-bird">
            <button style={buttonStyle}>ธีมเหลือง - นกบิน (Flying Bird)</button>
          </Link>
          <Link to="/landing-triangle-yellow">
            <button style={buttonStyle}>ธีมเหลือง - สามเหลี่ยม (Landing With Triangle Yellow)</button>
          </Link>
          <Link to="/yellow">
            <button style={buttonStyle}>ธีมเหลือง - วงล้อมหาสนุก (Yellow Theme)</button>
          </Link>
          <Link to="/tawicha">
            <button style={buttonStyle}>ตาวิชา (Tawicha)</button>
          </Link>
          <Link to="/round-table-seat-picker">
            <button style={buttonStyle}>เลือกที่นั่งโต๊ะกลม (Round Table Seat Picker)</button>
          </Link>
          <Link to="/owl-yellow">
            <button style={buttonStyle}>ธีมเหลือง - นกฮูก (Owl Yellow)</button>
          </Link>
          <Link to="/homepetch">
            <button style={buttonStyle}>ไปหน้า HomePetch (Demo)</button>
          </Link>
          <Link to="/seating-chart">
            <button style={buttonStyle}>ไปหน้า Seating Chart (Demo)</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  width: '100%',
  padding: '18px 10px',
  fontSize: 16,
  fontWeight: 600,
  borderRadius: 12,
  border: 'none',
  background: '#6366f1',
  color: '#fff',
  boxShadow: '0 2px 12px rgba(99,102,241,0.08)',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.2s',
  marginBottom: 0
}

export default Home