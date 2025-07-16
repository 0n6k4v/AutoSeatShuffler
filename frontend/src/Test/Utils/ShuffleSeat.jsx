import React, { useState } from 'react';

const alphabets = Array.from({ length: 24 }, (_, i) => String.fromCharCode(65 + i)); // A-X
const options = alphabets.flatMap(letter => Array.from({ length: 10 }, (_, i) => `${letter}${i + 1}`));

function ShuffleSeat() {
  const [picked, setPicked] = useState([]);
  const [lastPick, setLastPick] = useState(null);

  const handleShuffle = () => {
    const remaining = options.filter(opt => !picked.includes(opt));
    if (remaining.length === 0) return;
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setPicked([...picked, random]);
    setLastPick(random);
  };

  return (
    <div class="bg-gradient-to-r from-[#0C2F53] via-[#2E5A88] to-[#4E54C8]" style={{ padding: 20 }}>
      <h2>สุ่มที่นั่ง (A1-X10)</h2>
      <button onClick={handleShuffle} disabled={picked.length === options.length}>
        สุ่มที่นั่ง
      </button>
      {lastPick && <div style={{ margin: '10px 0', fontWeight: 'bold' }}>ผลการสุ่ม: {lastPick}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {options.map(opt => (
          <label key={opt} style={{ minWidth: 60 }}>
            <input type="checkbox" checked={picked.includes(opt)} readOnly /> {opt}
          </label>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <span>สุ่มแล้ว: {picked.length} / {options.length}</span>
      </div>
    </div>
  );
}

export default ShuffleSeat;
