import React, { memo } from 'react';

const AnimatedTriangle = memo(({ size = 100, color = '#FFF200', duration = 20, left = 0, top = 0 }) => (
    <div
        className="fixed pointer-events-none z-0"
        style={{
            left,
            top,
            width: size,
            height: size,
            opacity: 0.18,
            filter: 'blur(2px)',
            transition: 'none'
        }}
    >
        <div
            style={{
                width: '100%',
                height: '100%',
                animation: `spin ${duration}s linear infinite`
            }}
        >
            <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                style={{
                    filter: `drop-shadow(0 0 32px ${color})`
                }}
            >
                <polygon
                    points="50,0 0,100 100,100"
                    style={{
                        fill: 'transparent',
                        stroke: color,
                        strokeWidth: 8,
                        vectorEffect: 'non-scaling-stroke'
                    }}
                />
            </svg>
        </div>
    </div>
));

export default AnimatedTriangle;