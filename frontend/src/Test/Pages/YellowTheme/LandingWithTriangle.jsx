import React, { memo, useEffect, useState, useRef } from 'react';

// --- Animation Hook ---
const useBounce = (startX, startY, size = 200, speed = 2, others = []) => {
    const [pos, setPos] = useState({ x: startX, y: startY });
    const direction = useRef({ dx: speed, dy: speed });

    useEffect(() => {
        let raf;
        const animate = () => {
            setPos(prev => {
                let { x, y } = prev;
                let { dx, dy } = direction.current;
                const w = window.innerWidth - size;
                const h = window.innerHeight - size;

                // ขอบจอ
                if (x + dx > w || x + dx < 0) direction.current.dx *= -1;
                if (y + dy > h || y + dy < 0) direction.current.dy *= -1;

                return {
                    x: Math.max(0, Math.min(w, x + direction.current.dx)),
                    y: Math.max(0, Math.min(h, y + direction.current.dy))
                };
            });
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [size, speed, others]);

    return pos;
};

// --- Animated Triangle Component ---
const AnimatedTriangle = memo(({ size, startX, startY, duration }) => {
    const pos = useBounce(startX, startY, size, 0.5, []);
    return (
        <div className="fixed pointer-events-none z-0" style={{
            left: pos.x,
            top: pos.y,
            width: size,
            height: size,
            transition: 'none',
            opacity: 0.25,
            filter: 'blur(2px)',
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                animation: `spin ${duration}s linear infinite`
            }}>
                <svg
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    style={{
                        filter: `drop-shadow(0 0 32px #fff)`
                    }}
                >
                    <polygon
                        points="50,0 0,100 100,100"
                        style={{
                            fill: 'transparent',
                            stroke: '#fff',
                            strokeWidth: 8,
                            vectorEffect: 'non-scaling-stroke'
                        }}
                    />
                </svg>
            </div>
        </div>
    );
});

// --- Main Component ---
const LandingWithTriangle = memo(() => {
    const triangleConfigs = [
        { size: 288, startX: window.innerWidth * 0.8, startY: window.innerHeight * 0.8, duration: 32 },
        { size: 192, startX: window.innerWidth * 0.2, startY: window.innerHeight * 0.2, duration: 28 },
        { size: 144, startX: window.innerWidth * 0.6, startY: window.innerHeight * 0.4, duration: 24 },
        { size: 120, startX: window.innerWidth * 0.4, startY: window.innerHeight * 0.6, duration: 20 },
        { size: 96,  startX: window.innerWidth * 0.2, startY: window.innerHeight * 0.8, duration: 16 },
    ];

    const triangles = triangleConfigs.map((cfg, idx) => (
        <AnimatedTriangle key={idx} {...cfg} />
    ));

    return (
        <>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
            `}</style>
            
            <div
                className="text-black min-h-screen font-sukhumvit relative"
                style={{ background: 'radial-gradient(circle, #FFC600, #FFF200)' }}
            >
                {triangles}

                <main className="relative z-10 min-h-screen flex flex-col items-center justify-center container mx-auto px-8 text-center">
                    <section className="max-w-4xl w-full flex flex-col items-center justify-center">
                        <img
                            className="mx-auto mb-4"
                            src="./src/assets/depa-black-logo.png"
                            alt="Depa Logo"
                            width={300}
                            height={150}
                            loading="lazy"
                            decoding="async"
                        />
                        <h1 className="text-5xl font-bold tracking-tight mb-8 text-gray-900">
                            วงล้อมหาสนุก
                        </h1>
                        <div className="flex gap-12 mb-12">
                            <button
                                className="px-8 py-4 rounded-full flex items-center gap-4 font-bold text-2xl shadow-2xl transition-all duration-150
                                bg-white/30 backdrop-blur-md border border-white/30
                                hover:scale-110 hover:bg-white/50 hover:backdrop-blur-xl hover:border-yellow-300
                                hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
                                style={{
                                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.20)",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    background: "linear-gradient(135deg, #FFF20055 0%, #FFC60055 100%)",
                                }}
                                onClick={() => window.location.href = '/homepetch'}
                            >
                                <span className="font-playpen drop-shadow-lg">ไปยังหน้าสุ่ม</span>
                            </button>
                            <button
                                className="px-8 py-4 rounded-full flex items-center gap-4 font-bold text-2xl shadow-2xl transition-all duration-150
                                bg-white/30 backdrop-blur-md border border-white/30
                                hover:scale-110 hover:bg-white/50 hover:backdrop-blur-xl hover:border-yellow-300
                                hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
                                style={{
                                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.20)",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    background: "linear-gradient(135deg, #FFC60055 0%, #FFF20055 100%)",
                                }}
                                onClick={() => window.location.href = '/'}
                            >
                                <span className="font-playpen drop-shadow-lg">ดูที่นั่ง</span>
                            </button>
                        </div>
                    </section>
                </main> 
            </div>
        </>
    );
});

export default LandingWithTriangle;