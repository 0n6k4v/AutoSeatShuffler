import React, { memo, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

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
                style={{ background: 'linear-gradient(#FFF200, #FFC600)' }}
            >
                {triangles}

                <main className="relative z-10 min-h-screen flex flex-col items-center justify-center container mx-auto px-8 text-center">
                    <section className="max-w-4xl w-full flex flex-col items-center justify-center">
                        <img
                            className="mx-auto mb-3"
                            src="./src/assets/depa-black-logo.png"
                            alt="Depa Logo"
                            width={200}
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Liquid Glass Start Button */}
                        <Link to="/seating-chart">
                            <button
                                className="px-8 pt-4 pb-3 rounded-2xl font-semibold text-lg text-gray-900 shadow-lg backdrop-blur-md bg-white/30 border border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/60 hover:border-yellow-400 hover:text-yellow-900"
                                style={{
                                    boxShadow: '0 4px 32px 0 rgba(255, 198, 0, 0.15), 0 1.5px 4px 0 rgba(0,0,0,0.08)',
                                    border: '1.5px solid rgba(255,255,255,0.35)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,246,0,0.25) 100%)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    transition: 'all 0.3s cubic-bezier(.4,2,.3,1)'
                                }}
                            >
                                เข้าสู่เว็บไซต์
                            </button>
                        </Link>
                    </section>
                </main> 
            </div>
        </>
    );
});

export default LandingWithTriangle;