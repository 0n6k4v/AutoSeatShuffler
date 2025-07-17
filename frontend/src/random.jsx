import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useLocation } from "react-router-dom";

function Random() {
  const location = useLocation();
  const seat = location.state?.seat;

  useEffect(() => {
    // พลุจากซ้ายเต็มจอ
    confetti({
      particleCount: 250,
      angle: 60,
      spread: 360,
      scalar: 1.5,
      origin: { x: 0, y: 1 },
    });
    // พลุจากขวาเต็มจอ
    confetti({
      particleCount: 250,
      angle: 120,
      spread: 360,
      scalar: 1.5,
      origin: { x: 1, y: 1 },
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div className="flex items-center justify-center w-full h-full">
        <div
          className="rounded-full bg-gradient-to-br from-[#FFF200] to-[#FFC600] shadow-2xl flex items-center justify-center w-[28rem] h-[28rem] cursor-pointer transition hover:scale-110 animate-[tiltLeftRight_1s_ease-in-out_infinite]"
        >
          <span className="text-white font-extrabold text-6xl font-playpen drop-shadow-lg text-center tracking-wide leading-relaxed">
            ผลสุ่มที่นั่ง
            <br />
            {seat ? `${seat.row}-${seat.col}` : "ไม่มีข้อมูล"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Random;
