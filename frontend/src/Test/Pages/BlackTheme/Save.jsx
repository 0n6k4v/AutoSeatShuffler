import React, { memo, useMemo } from "react";
import AnimatedTriangle from "../../Components/AnimatedTriangle";
import { ArrowLeft, Dices } from 'lucide-react';


const useTriangleConfigs = () => {
    return useMemo(() => {
        const { innerWidth, innerHeight } = window;
        return [
            { size: 288, left: innerWidth * 0.8, top: innerHeight * 0.8, color: '#fff', duration: 32, opacity: 0.6 },
            { size: 192, left: innerWidth * 0.1, top: innerHeight * 0.2, color: '#fff', duration: 28, opacity: 0.5 },
            { size: 144, left: innerWidth * 0.6, top: innerHeight * 0.4, color: '#fff', duration: 24, opacity: 0.7 },
            { size: 120, left: innerWidth * 0.4, top: innerHeight * 0.6, color: '#fff',    duration: 20, opacity: 0.4 },
            { size: 96,  left: innerWidth * 0.2, top: innerHeight * 0.8, color: '#fff', duration: 16, opacity: 0.8 },
            { size: 60,  left: innerWidth * 0.9, top: innerHeight * 0.1, color: '#fff',    duration: 35, opacity: 0.3 },
        ];
    }, []);
};

const EventSeatChart = memo(() => {
    const triangleConfigs = useTriangleConfigs();
    const [isUnhover, setIsUnhover] = React.useState(false);

    const triangles = useMemo(
        () => triangleConfigs.map((cfg, idx) => (
            <div key={idx} style={{ opacity: cfg.opacity }}>
                <AnimatedTriangle {...cfg} />
            </div>
        )),
        [triangleConfigs]
    );
    
    return (
        <div
            className="min-h-screen overflow-hidden" // Add overflow-hidden to prevent scrollbars from decorative elements
            style={{ backgroundColor: '#020617' }}
        >
            <div className="absolute top-0 left-0 w-full h-full animate-gradient-move"
                 style={{
                    background: `radial-gradient(ellipse at 70% 30%, rgba(2, 1, 37, 0.15), transparent 70%), 
                                 radial-gradient(ellipse at 30% 30%, rgba(29, 78, 216, 0.15), transparent 70%),
                                 #000`,
                    zIndex: 1
                 }}
            />
            <style>
                {`
                    @keyframes spin-cw {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes spin-ccw {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(-360deg); }
                    }
                    
                    @keyframes gradient-move {
                        0% { transform: translate(0, 0) scale(1); }
                        50% { transform: translate(10%, -10%) scale(1.2); }
                        100% { transform: translate(0, 0) scale(1); }
                    }

                    .glowing-triangle {
                        filter: drop-shadow(0 0 15px currentColor);
                    }

                    .liquid-glass-btn {
                        background: linear-gradient(135deg, rgba(255,242,0,0.6) 0%, rgba(255,255,255,0.2) 100%);
                        border: 1.5px solid rgba(255,255,255,0.25);
                        box-shadow: 0 4px 32px 0 rgba(255, 242, 0, 0.15), 0 1.5px 8px 0 rgba(0,0,0,0.08);
                        backdrop-filter: blur(8px);
                        color: #222;
                        font-weight: 500;
                        position: relative;
                        overflow: hidden;
                    }
                    .liquid-glass-btn:hover {
                        background: linear-gradient(135deg, rgba(255,242,0,0.8) 0%, rgba(255,255,255,0.3) 100%);
                        box-shadow: 0 6px 40px 0 rgba(255, 242, 0, 0.25), 0 2px 12px 0 rgba(0,0,0,0.12);
                    }
                    .liquid-glass-btn .dice-icon {
                        transition: transform 0.2s;
                    }
                    .liquid-glass-btn:hover .dice-icon {
                        animation: spin-cw 0.6s cubic-bezier(.4,2,.6,.8) 1;
                    }
                    .liquid-glass-btn .dice-icon.unhover {
                        animation: spin-ccw 0.6s cubic-bezier(.4,2,.6,.8) 1;
                    }
                `}
            </style>

            {/* <div className="relative z-10">
                {triangles}
            </div> */}

            <nav className="text-white px-4 py-3 flex item-center justify-between font-bold relative z-20">
                <div className="flex items-center space-x-4">
                    <ArrowLeft />
                    <h1 className="text-2xl font-bold">แผนผังที่นั่ง</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300">ที่นั่งที่เหลือ: 0/190</span>
                    <button
                        className="liquid-glass-btn px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center space-x-2"
                        onMouseEnter={() => setIsUnhover(false)}
                        onMouseLeave={() => {
                            setIsUnhover(true);
                            setTimeout(() => setIsUnhover(false), 600); // ลบคลาสหลัง animation จบ
                        }}
                    >
                        <Dices className={`w-5 h-5 dice-icon${isUnhover ? " unhover" : ""}`} />
                        <span>สุ่มที่นั่ง</span>
                    </button>
                </div>
            </nav>

            {/* แผนผังที่นั่ง (ไม่มีกรอบ) */}
            <div
                className="relative z-10 flex justify-center items-center"
                style={{
                    minHeight: "60vh",
                    height: "calc(100vh - 95px)",
                }}
            >
                <div className="relative w-full h-full flex items-center justify-center scale-[0.65] sm:scale-[0.8] lg:scale-100 transform-gpu"
                     style={{
                        backgroundImage: `url()`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                     }}
                >
                    
                    {/* --- Elements on the Left --- */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                        {/* Main Stage */}
                        <div className="w-40 h-80 bg-slate-900/60 border border-white/20 rounded-lg shadow-xl backdrop-blur-sm"></div>
                        {/* Small Squares */}
                        <div className="w-10 h-10 bg-slate-900/60 border border-white/20 rounded-md shadow-lg"></div>
                        <div className="w-10 h-10 bg-slate-900/60 border border-white/20 rounded-md shadow-lg -mt-2"></div>
                    </div>

                    {/* --- Check-in Desk --- */}
                    <div className="absolute left-0 -bottom-8 flex flex-col items-start">
                         <div className="w-48 h-12 bg-slate-800/60 border border-white/20 rounded-md shadow-lg flex justify-around items-end p-1 backdrop-blur-sm">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-6 h-6 bg-slate-700/70 border-t border-l border-r border-white/10 rounded-t-md"></div>
                            ))}
                        </div>
                    </div>

                    {/* --- Lights / Speakers (Decorative) --- */}
                    {[
                        { top: '2rem', left: '3rem', rotate: -45 },
                        { bottom: '2rem', left: '3rem', rotate: 45 },
                        { top: '2rem', right: '2rem', rotate: 45 },
                        { bottom: '2rem', right: '2rem', rotate: -45 },
                        { top: '50%', right: '0rem', rotate: 90, transform: 'translateY(-50%) scale(0.8)'},
                    ].map((pos, i) => (
                         <div key={i} className="absolute w-24 h-10 bg-slate-900/70 border border-white/20 rounded-full flex items-center justify-end p-1 backdrop-blur-sm"
                              style={{ ...pos, transform: `${pos.transform || ''} rotate(${pos.rotate}deg)`}}>
                             <div className="w-8 h-8 rounded-full bg-white/20"></div>
                         </div>
                    ))}

                    {/* --- Main Seating Area (Tables and Chairs) --- */}
                    <div className="grid grid-cols-5 gap-x-8 gap-y-4 ml-48">
                        {Array.from({ length: 19 }).map((_, tableIndex) => (
                            <div key={tableIndex} className="relative w-28 h-28 flex items-center justify-center">
                                {/* The Table */}
                                <div
                                    className="absolute w-20 h-20 rounded-full border border-amber-300/30 shadow-lg"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(255, 230, 150, 0.4) 0%, rgba(255, 242, 0, 0.2) 100%)',
                                        backdropFilter: "blur(2px)"
                                    }}
                                ></div>
                                
                                {/* Ten Chairs positioned in a circle around the table */}
                                {Array.from({ length: 10 }).map((_, chairIndex) => {
                                    const angle = (chairIndex / 10) * 2 * Math.PI; // Calculate angle for each chair
                                    const radius = 46; // Distance from table center
                                    const x = radius * Math.cos(angle);
                                    const y = radius * Math.sin(angle);
                                    const rotation = (angle * 180) / Math.PI + 90; // Rotate chair to face the table

                                    return (
                                        <div
                                            key={chairIndex}
                                            className="absolute w-5 h-6 bg-amber-200/30 border border-amber-200/40 rounded-t-md rounded-b-sm shadow-md backdrop-blur-sm"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                                            }}
                                        ></div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
})


export default React.memo(EventSeatChart);