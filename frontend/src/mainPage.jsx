import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper: parse CSV string to array
function parseCSV(csv) {
  return csv
    .trim()
    .split("\n")
    .map(line => {
      const [row, col, available] = line.split(",");
      return { row, col, available: available.trim() === "True" };
    });
}

// Helper: convert array to CSV string
function arrayToCSV(arr) {
  return arr
    .map(
      ({ row, col, available }) =>
        `${row},${col},${available ? "True" : "False"}`
    )
    .join("\n");
}

function MainPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [seats, setSeats] = useState([]);
  const [randomSeat, setRandomSeat] = useState(null);

  // โหลดข้อมูลที่นั่งจาก CSV
  useEffect(() => {
    fetch("http://localhost:4000/api/seats")
      .then((res) => res.text())
      .then((csv) => setSeats(parseCSV(csv)));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // ปรับค่าต่ำกว่า 1 เพื่อให้ช้าลง (เช่น 0.5 = ครึ่งหนึ่งของความเร็วปกติ)
    }
  }, []);

  const handleClick = () => {
    const availableSeats = seats.filter((s) => s.available);
    if (availableSeats.length === 0) {
      alert("ไม่มีเก้าอี้ว่างแล้ว");
      return;
    }
    const seat = availableSeats[Math.floor(Math.random() * availableSeats.length)];

    // อัปเดตที่ backend
    fetch('http://localhost:4000/api/update-seat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row: seat.row, col: seat.col })
    }).then(() => {
      // อัปเดต state ใน frontend
      setSeats((prev) =>
        prev.map((s) =>
          s.row === seat.row && s.col === seat.col ? { ...s, available: false } : s
        )
      );
      navigate("homepetch/random", { state: { seat } });
    });
  };

  // ใน dev: อัปเดต CSV (mock)
  useEffect(() => {
    if (randomSeat) {
      // ส่งข้อมูลไป backend หรืออัปเดตไฟล์จริง (dev เท่านั้น)
      // fetch('/api/update-seat', {method: 'POST', body: ...})
      // หรือแค่ log
      console.log("อัปเดต CSV:", arrayToCSV(seats));
    }
  }, [randomSeat, seats]);

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
      {/* แสดงสถานะเก้าอี้ */}
      <div className="absolute left-0 top-0 p-4 bg-white/80 rounded-xl shadow-lg max-h-[60vh] overflow-auto z-40">
        <div className="font-bold mb-2">สถานะเก้าอี้ (ทดสอบ)</div>
        <table className="text-xs">
          <thead>
            <tr>
              <th>แถว</th>
              <th>หมายเลข</th>
              <th>ว่าง</th>
            </tr>
          </thead>
          <tbody>
            {seats.map((s, i) => (
              <tr key={i}>
                <td>{s.row}</td>
                <td>{s.col}</td>
                <td>
                  {s.available ? (
                    <span className="text-green-600 font-bold">ว่าง</span>
                  ) : (
                    <span className="text-red-600 font-bold">ไม่ว่าง</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            {randomSeat && (
              <div className="mt-4 text-lg text-black">
                สุ่มได้: {randomSeat.row}-{randomSeat.col}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;