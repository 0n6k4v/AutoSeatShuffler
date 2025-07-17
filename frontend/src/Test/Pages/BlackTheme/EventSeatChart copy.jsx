import React, { memo, useMemo, useState, useCallback } from "react";
import AnimatedTriangle from "../../Components/AnimatedTriangle";
import { ArrowLeft, Dices } from 'lucide-react';
import EventSeatPlan from "./EventSeatPlan";
import ResultModal from "./ResultModal";
import { tableData, tableLabels } from "./EventSeatPlan";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    const [isUnhover, setIsUnhover] = useState(false);

    const [isRandomizing, setIsRandomizing] = useState(false);
    const [highlightedTable, setHighlightedTable] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const handleRandomize = useCallback(async () => {
        if (isRandomizing) return;

        setSelectedTable(null);
        setShowResultModal(false);
        setIsRandomizing(true);

        const totalDuration = 3000;
        const interval = 100;
        let elapsed = 0;

        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * tableLabels.length);
            setHighlightedTable(tableLabels[randomIndex]);
            elapsed += interval;
            if (elapsed >= totalDuration) {
                clearInterval(intervalId);
            }
        }, interval);
        
        await sleep(totalDuration);

        const finalTableIndex = Math.floor(Math.random() * tableData.length);
        const finalTableLabel = tableLabels[finalTableIndex];

        setHighlightedTable(null);
        setSelectedTable(finalTableLabel);
        
        await sleep(1200);
        setShowResultModal(true);
        setIsRandomizing(false);

    }, [isRandomizing]);

    const handleCloseModal = () => {
         setShowResultModal(false);
         setSelectedTable(null);
    }

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
            className="min-h-screen overflow-hidden"
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
                     .liquid-glass-btn:disabled {
                        background: linear-gradient(135deg, rgba(150,150,150,0.4) 0%, rgba(255,255,255,0.1) 100%);
                        color: #888;
                        cursor: not-allowed;
                        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
                    }
                    .liquid-glass-btn:hover:not(:disabled) {
                        background: linear-gradient(135deg, rgba(255,242,0,0.8) 0%, rgba(255,255,255,0.3) 100%);
                        box-shadow: 0 6px 40px 0 rgba(255, 242, 0, 0.25), 0 2px 12px 0 rgba(0,0,0,0.12);
                    }
                    .liquid-glass-btn .dice-icon {
                        transition: transform 0.2s;
                    }
                    .liquid-glass-btn:hover:not(:disabled) .dice-icon {
                        animation: spin-cw 0.6s cubic-bezier(.4,2,.6,.8) 1;
                    }
                    .liquid-glass-btn .dice-icon.unhover {
                        animation: spin-ccw 0.6s cubic-bezier(.4,2,.6,.8) 1;
                    }
                `}
            </style>

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
                            setTimeout(() => setIsUnhover(false), 600);
                        }}
                        onClick={handleRandomize}
                        disabled={isRandomizing}
                    >
                        <Dices className={`w-5 h-5 dice-icon${isUnhover ? " unhover" : ""}`} />
                        <span>{isRandomizing ? "กำลังสุ่ม..." : "สุ่มโต๊ะ"}</span>
                    </button>
                </div>
            </nav>

            <div
                className="relative z-10 flex justify-center items-center"
                style={{
                    minHeight: "60vh",
                    height: "calc(100vh - 95px)",
                    width: "100vw",
                }}
            >
                <EventSeatPlan 
                    highlightedTable={highlightedTable}
                    selectedTable={selectedTable}
                />
            </div>
            
            {showResultModal && (
                <ResultModal 
                    table={selectedTable}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
})

export default React.memo(EventSeatChart);