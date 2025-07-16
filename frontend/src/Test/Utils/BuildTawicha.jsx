import React, { useState } from 'react';

// === Controlled DraggableTriangle Component ===
const DraggableTriangle = ({
    id,
    width,
    color,
    pos,
    rotation,
    flipped,
    onStateChange
}) => {
    const dragging = React.useRef(false);
    const offset = React.useRef({ x: 0, y: 0 });

    const onMouseDown = (e) => {
        dragging.current = true;
        offset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;
        const newPos = {
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y,
        };
        onStateChange(id, { pos: newPos });
    };

    const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    const rotateLeft = () => onStateChange(id, { rotation: rotation - 15 });
    const rotateRight = () => onStateChange(id, { rotation: rotation + 15 });
    const flip = () => onStateChange(id, { flipped: !flipped });

    return (
        // ใช้ transform: translate เพื่อให้การคำนวณตำแหน่งง่ายขึ้น
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${pos.x}px, ${pos.y}px)` }}>
            <div
                style={{
                    cursor: 'grab',
                    userSelect: 'none',
                    transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
                    transformOrigin: 'center center' // กำหนดจุดหมุนกึ่งกลาง
                }}
                onMouseDown={onMouseDown}
                aria-label={`Draggable Triangle ${id}`}
            >
                {/* --- จุดที่ปรับคืนตามโค้ดดั้งเดิม --- */}
                <svg
                    width={width}
                    viewBox="0 0 85 60" // คืนค่า viewBox เดิม
                    aria-label="Yellow Triangle"
                >
                    <polygon
                        points="42.5,60 85,0 0,50" // คืนค่า points เดิม
                        fill={color}
                    />
                </svg>
                {/* ------------------------------------- */}
            </div>
            <div style={{ position: 'absolute', top: 0, left: width + 10, width: 150, whiteSpace: 'nowrap' }}>
                <button onClick={rotateLeft}>⟲ หมุนซ้าย</button>
                <button onClick={rotateRight}>⟳ หมุนขวา</button>
                <button onClick={flip}>⇋ พลิก</button>
            </div>
        </div>
    );
};

// === Page to Build and Log Triangle Data ===
const BuildTawicha = () => {
    const initialTriangles = [
        {
            id: 1,
            pos: { x: 200, y: 200 },
            rotation: 0,
            flipped: false,
        },
        {
            id: 2,
            pos: { x: 500, y: 200 },
            rotation: 0,
            flipped: false,
        },
    ];

    const [triangles, setTriangles] = useState(initialTriangles);

    const handleTriangleChange = (id, newValues) => {
        setTriangles(currentTriangles =>
            currentTriangles.map(t =>
                t.id === id ? { ...t, ...newValues } : t
            )
        );
    };

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '60vh', // เพิ่มความสูงเพื่อให้มีพื้นที่
                    border: '1px solid #ccc',
                    overflow: 'hidden'
                }}
                aria-label="Builder Area"
            >
                {triangles.map(t => (
                    <DraggableTriangle
                        key={t.id}
                        id={t.id}
                        width={220} // --- กำหนดขนาด 220 ตามโค้ดดั้งเดิม ---
                        color="#FFDE00"
                        pos={t.pos}
                        rotation={t.rotation}
                        flipped={t.flipped}
                        onStateChange={handleTriangleChange}
                    />
                ))}
            </div>

            <hr style={{ margin: '20px 0' }}/>

            <div style={{ padding: '10px' }}>
                <h2>ข้อมูลสำหรับนำไปใช้ (คัดลอกค่าเหล่านี้ไปใส่ใน `initialTriangles`)</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {triangles.map(t => (
                        <div key={t.id} style={{ border: '1px solid black', padding: '10px', backgroundColor: '#f5f5f5' }}>
                            <h3>ข้อมูลสามเหลี่ยม {t.id}</h3>
                            <pre><code>
                                {`{\n`}
                                {`    id: ${t.id},\n`}
                                {`    pos: { x: ${Math.round(t.pos.x)}, y: ${Math.round(t.pos.y)} },\n`}
                                {`    rotation: ${t.rotation},\n`}
                                {`    flipped: ${t.flipped}\n`}
                                {`}`}
                            </code></pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuildTawicha;