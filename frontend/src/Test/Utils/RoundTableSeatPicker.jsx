import React, { useState, useMemo } from 'react';

// === ส่วนประกอบย่อยสำหรับ "ที่นั่ง" (Seat) ===
// ถูกกำหนดไว้ในไฟล์เดียวกันเพื่อความสะดวก
const Seat = ({ seatNumber, isSelected, onClick, style }) => {
  // กำหนดสไตล์ของที่นั่งตามสถานะ (ว่าง, ถูกเลือก)
  const baseClasses = "absolute w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110";
  const selectedClasses = "bg-blue-500 text-white border-4 border-blue-300";
  const availableClasses = "bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-100";

  return (
    <div
      style={style}
      className={`${baseClasses} ${isSelected ? selectedClasses : availableClasses}`}
      onClick={onClick}
    >
      {seatNumber}
    </div>
  );
};


// === Component หลัก: RoundTableSeatPicker ===
const RoundTableSeatPicker = ({ numSeats = 8 }) => {
  // State สำหรับเก็บที่นั่งที่ถูกเลือก
  const [selectedSeat, setSelectedSeat] = useState(null);

  // ฟังก์ชันสำหรับจัดการเมื่อมีการคลิกเลือกที่นั่ง
  const handleSeatClick = (seatNumber) => {
    // หากคลิกที่นั่งเดิมซ้ำ จะยกเลิกการเลือก
    setSelectedSeat(prevSelected => prevSelected === seatNumber ? null : seatNumber);
  };

  // คำนวณตำแหน่งของที่นั่งแต่ละอันให้อยู่ในวงกลม
  // ใช้ useMemo เพื่อให้คำนวณใหม่เฉพาะเมื่อ numSeats เปลี่ยนแปลง
  const seatPositions = useMemo(() => {
    const positions = [];
    const radius = 140; // รัศมีของวงกลม (หน่วยเป็น px)
    const tableSize = 320; // ขนาดของโต๊ะ (container)
    const centerX = tableSize / 2;
    const centerY = tableSize / 2;

    for (let i = 0; i < numSeats; i++) {
      // คำนวณมุมของแต่ละที่นั่ง (ในหน่วยเรเดียน)
      const angle = (i / numSeats) * 2 * Math.PI;
      
      // คำนวณพิกัด x และ y
      // ใช้ Math.sin สำหรับ x และ -Math.cos สำหรับ y เพื่อให้ที่นั่งที่ 1 อยู่ด้านบนสุด
      const x = centerX + radius * Math.sin(angle);
      const y = centerY - radius * Math.cos(angle);

      positions.push({
        // ใช้ transform เพื่อให้จุดกึ่งกลางของที่นั่งอยู่ที่พิกัด x, y
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      });
    }
    return positions;
  }, [numSeats]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-xl border border-gray-200">
      
      {/* ส่วนแสดงผลที่นั่งที่เลือก */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">สถานะการเลือก</h2>
        <p className="text-lg text-gray-600 mt-1">
          {selectedSeat !== null ? `คุณเลือกที่นั่งหมายเลข: ${selectedSeat}` : "กรุณาเลือกที่นั่ง"}
        </p>
      </div>

      {/* Container ของโต๊ะและที่นั่ง */}
      <div 
        className="relative w-80 h-80 mx-auto" // ขนาด 320x320px
      >
        {/* ตัวโต๊ะกลมที่อยู่ตรงกลาง */}
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-yellow-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner flex items-center justify-center">
           <span className="text-2xl font-bold text-white opacity-70">โต๊ะ</span>
        </div>
        
        {/* แสดงผลที่นั่งแต่ละอัน */}
        {seatPositions.map((pos, index) => {
          const seatNumber = index + 1;
          return (
            <Seat
              key={seatNumber}
              seatNumber={seatNumber}
              isSelected={selectedSeat === seatNumber}
              onClick={() => handleSeatClick(seatNumber)}
              style={pos}
            />
          );
        })}
      </div>

       {/* ปุ่มยืนยัน */}
       <div className="mt-8 text-center">
        <button
          className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
          disabled={selectedSeat === null}
          onClick={() => alert(`คุณยืนยันการเลือกที่นั่งหมายเลข ${selectedSeat}`)}
        >
          ยืนยันการเลือก
        </button>
      </div>
    </div>
  );
};

export default RoundTableSeatPicker;