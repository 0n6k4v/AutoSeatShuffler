import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // ปรับค่าต่ำกว่า 1 เพื่อให้ช้าลง (เช่น 0.5 = ครึ่งหนึ่งของความเร็วปกติ)
    }
  }, []);

  const handleClick = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("homepetch/random");
    }, 1500); // แสดงป๊อปอัพ 1.5 วินาที
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="rounded-full bg-gradient-to-br from-[#FFF200] to-[#FFC600] shadow-2xl flex items-center justify-center w-[28rem] h-[28rem] cursor-pointer transition hover:scale-110 animate-[tiltLeftRight_1s_ease-in-out_infinite]"
            onClick={handleClick}
          >
            <span className="text-white font-extrabold text-6xl font-playpen drop-shadow-lg text-center tracking-wide">
              สุ่มที่นั่ง
            </span>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-2xl px-8 py-6 text-center font-playpen text-2xl text-yellow-600 flex flex-col items-center">
            กำลังสุ่มที่นั่ง...
            <span className="mt-4 flex gap-2 justify-center">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></span>
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:.2s]"></span>
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:.4s]"></span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;