import React, { memo, useState, useEffect } from 'react';

const wingsUpState = { wing: { id: 1, pos: { x: 0, y: 0 }, rotation: 15, flipped: true, zIndex: 2 }, body: { id: 2, pos: { x: 18, y: 81 }, rotation: 270, flipped: true, zIndex: 1 }};
const wingsDownState = { wing: { id: 3, pos: { x: -41, y: 168 }, rotation: 525, flipped: false, zIndex: 2 }, body: { id: 4, pos: { x: -24, y: 70 }, rotation: 285, flipped: true, zIndex: 1 }};

const StaticTriangle = memo(({ width, pos, rotation, flipped, zIndex }) => (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`, transformOrigin: 'center center', zIndex: zIndex, transition: 'transform 400ms ease-in-out, left 400ms ease-in-out, top 400ms ease-in-out' }}>
        <svg width={width} viewBox="0 0 85 60" aria-label="Triangle part of a bird" style={{ filter: `drop-shadow(0 0 32px #fff) blur(1px)` }}>
            <polygon points="42.5,60 85,0 0,50" fill="rgba(255,255,255,0.08)" stroke="#fff" strokeWidth={8} vectorEffect="non-scaling-stroke" />
        </svg>
    </div>
));

const AnimatedBird = memo(({ startX, startY, size }) => {
    const [isWingsDown, setIsWingsDown] = useState(false);

    useEffect(() => {
        const flapInterval = setInterval(() => {
            setIsWingsDown(prevState => !prevState);
        }, 500);
        return () => clearInterval(flapInterval);
    }, []);

    const currentWingProps = isWingsDown ? wingsDownState.wing : wingsUpState.wing;
    const currentBodyProps = isWingsDown ? wingsDownState.body : wingsUpState.body;

    return (
        <div
            className="fixed pointer-events-none"
            style={{
                left: startX,
                top: startY,
                width: size,
                height: size,
                transform: `translate(-50%, -50%)`,
                opacity: 0.18,
                zIndex: 0,
            }}
            aria-label="A stationary flapping bird"
        >
            <div className="relative w-full h-full">
                <StaticTriangle key={currentBodyProps.id} width={220} {...currentBodyProps} />
                <StaticTriangle key={currentWingProps.id} width={220} {...currentWingProps} />
            </div>
        </div>
    );
});

export default AnimatedBird;