import React, { memo, useMemo, useState, useEffect, useRef } from 'react';

// --- Utilities (ไม่มีการเปลี่ยนแปลง) ---
function isCollide(a, b) {
    return (
        a.x < b.x + b.size &&
        a.x + a.size > b.x &&
        a.y < b.y + b.size &&
        a.y + a.size > b.y
    );
}

// 1. เพิ่มโค้ดสำหรับ PERLIN NOISE เข้ามา
const PerlinNoise = {
    // โค้ดส่วนนี้เป็นอัลกอริทึม Perlin Noise แบบคลาสสิก
    // ไม่จำเป็นต้องเข้าใจทั้งหมด แค่รู้ว่ามันสร้างค่าที่ต่อเนื่องและดูเหมือนสุ่มได้
    permutation: [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,254,138,162,222,251,215,241,249,192,210,141,84,106,144,191,195,193,121,78,127,156,184, 72,162,28,145,235,236,205,214,115,114,24,242,157,239,110,49,50,243,67,45,204,179,181,199,66,180,128,176,93,221,238],
    p: new Array(512),
    init: function() { for (let i = 0; i < 512; i++) this.p[i] = this.permutation[i % 256]; },
    fade: function(t) { return t * t * t * (t * (t * 6 - 15) + 10); },
    lerp: function(t, a, b) { return a + t * (b - a); },
    grad: function(hash, x, y, z) { let h = hash & 15; let u = h < 8 ? x : y; let v = h < 4 ? y : h === 12 || h === 14 ? x : z; return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v); },
    noise: function(x, y, z) { let X = Math.floor(x) & 255; let Y = Math.floor(y) & 255; let Z = Math.floor(z) & 255; x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z); let u = this.fade(x); let v = this.fade(y); let w = this.fade(z); let A = this.p[X] + Y; let AA = this.p[A] + Z; let AB = this.p[A + 1] + Z; let B = this.p[X + 1] + Y; let BA = this.p[B] + Z; let BB = this.p[B + 1] + Z; return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)), this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))), this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)), this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1)))); },
};
PerlinNoise.init();

// --- ส่วนอื่นๆ ของโค้ด ---

const StaticTriangle = memo(({ width, color, pos, rotation, flipped, zIndex }) => (
    <div style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
        transformOrigin: 'center center',
        zIndex: zIndex,
        transition: 'transform 400ms ease-in-out, left 400ms ease-in-out, top 400ms ease-in-out',
    }}>
        <svg
            width={width}
            viewBox="0 0 85 60"
            aria-label="Triangle part of a bird"
            style={{ filter: `drop-shadow(0 0 8px rgba(0,0,0,0.3))` }}
        >
            <polygon points="42.5,60 85,0 0,50" fill={color} />
        </svg>
    </div>
));

const wingsUpState = {
    wing: { id: 1, pos: { x: 0, y: 0 }, rotation: 15, flipped: true, zIndex: 2 },
    body: { id: 2, pos: { x: 18, y: 81 }, rotation: 270, flipped: true, zIndex: 1 },
};

const wingsDownState = {
    wing: { id: 3, pos: { x: -41, y: 168 }, rotation: 525, flipped: false, zIndex: 2 },
    body: { id: 4, pos: { x: -24, y: 70 }, rotation: 285, flipped: true, zIndex: 1 },
};

const AnimatedBird = memo(({ startX, startY, size }) => {
    const [isWingsDown, setIsWingsDown] = useState(false);
    const [position, setPosition] = useState({ x: startX, y: startY });
    const [rotation, setRotation] = useState(0);
    const prevPositionRef = useRef(position);
    const animationFrameId = useRef(null);
    
    // ตัวแปรสำหรับควบคุม "เวลา" ของ Perlin Noise
    const timeRef = useRef({ x: Math.random() * 1000, y: Math.random() * 1000 });

    useEffect(() => {
        const flapInterval = setInterval(() => {
            setIsWingsDown(prevState => !prevState);
        }, 500);
        return () => clearInterval(flapInterval);
    }, []);

    useEffect(() => {
        const animate = () => {
            // 2. เปลี่ยน Logic การเคลื่อนที่มาใช้ Perlin Noise
            const speed = 0.2; // ปรับความเร็วในการเคลื่อนที่ของ noise
            timeRef.current.x += speed * 0.01;
            timeRef.current.y += speed * 0.01;

            // ดึงค่า noise ออกมา (ค่าจะอยู่ระหว่าง -1 ถึง 1)
            const noiseX = PerlinNoise.noise(timeRef.current.x, 0, 0);
            const noiseY = PerlinNoise.noise(timeRef.current.y, 0, 0);
            
            // ขอบเขตการบิน (padding 10%)
            const padding = 0.1;
            const flightAreaWidth = window.innerWidth * (1 - padding * 2);
            const flightAreaHeight = window.innerHeight * (1 - padding * 2);

            // แปลงค่า noise (-1 ถึง 1) -> (0 ถึง 1) -> พิกัดบนหน้าจอ
            const newX = ((noiseX + 1) / 2) * flightAreaWidth + (window.innerWidth * padding);
            const newY = ((noiseY + 1) / 2) * flightAreaHeight + (window.innerHeight * padding);
            
            setPosition({ x: newX, y: newY });

            // Logic การหันหน้า (ทำงานเหมือนเดิม)
            const prevPos = prevPositionRef.current;
            const deltaX = newX - prevPos.x;
            const deltaY = newY - prevPos.y;

            if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
                const angleRad = Math.atan2(deltaY, deltaX);
                const angleDeg = angleRad * (180 / Math.PI);
                setRotation(angleDeg);
            }
            
            prevPositionRef.current = { x: newX, y: newY };
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const currentWingProps = isWingsDown ? wingsDownState.wing : wingsUpState.wing;
    const currentBodyProps = isWingsDown ? wingsDownState.body : wingsUpState.body;

    return (
        <div
            className="fixed pointer-events-none z-0"
            style={{
                left: position.x,
                top: position.y,
                width: size,
                height: size,
                transform: `rotate(${rotation}deg) translate(-50%, -50%)`, // ใช้ translate เพื่อให้จุดศูนย์กลางตรง
                transition: 'left 1s linear, top 1s linear', // ทำให้การเคลื่อนที่ของตำแหน่งนุ่มนวลขึ้น
            }}
            aria-label="A freely flying and flapping bird"
        >
            <div className="relative w-full h-full">
                <StaticTriangle key={currentBodyProps.id} width={220} color="#FFDE00" {...currentBodyProps} />
                <StaticTriangle key={currentWingProps.id} width={220} color="#FFDE00" {...currentWingProps} />
            </div>
        </div>
    );
});


// --- Main Page Component (ไม่มีการเปลี่ยนแปลง) ---
const Tawicha = memo(() => {
    const birdConfigs = useMemo(() => {
        const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;
        const initialY = typeof window !== 'undefined' ? window.innerHeight / 2 : 200;
        return [{ startX: initialX, startY: initialY, size: 250 }];
    }, []);

    return (
        <div
            className="min-h-screen w-full"
            style={{ background: 'radial-gradient(circle, #FFC600, #FFF200)' }}
        >
            {birdConfigs.map((config, idx) => (
                <AnimatedBird key={idx} {...config} />
            ))}
        </div>
    );
});

export default Tawicha;