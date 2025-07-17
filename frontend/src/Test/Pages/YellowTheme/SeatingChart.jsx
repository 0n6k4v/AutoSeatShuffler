import React, { memo, useEffect, useState, useRef } from 'react';

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

const SeatingChart = () => {
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
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg);}
                        100% { transform: rotate(360deg);}
                    }
                `}
            </style>
            <div 
                className="min-h-screen"
                style={{ background: 'linear-gradient(#FFF200, #FFC600)' }}
            >
                {triangles}
            </div>
        </>
    );
}

export default SeatingChart;