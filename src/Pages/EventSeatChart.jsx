import React, { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, Dices, History } from 'lucide-react';
import { tableData, tableLabels, initialSeats } from "../Storage/EventSeatData";
import { useNavigate } from "react-router-dom";
import EventSeatPlan from "./EventSeatPlan";
import ConfirmationModal from "./ConfirmationModal";
import AnimatedTriangle from '../Components/AnimatedTriangle';
import { saveSeat, getAllSeats, saveHistory, getAllHistory } from "../Storage/db";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function formatDateTime(isoString) {
    const d = new Date(isoString);
    if (isNaN(d)) return '-';
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const useWindowSize = () => {
    const [size, setSize] = React.useState({ width: window.innerWidth, height: window.innerHeight });
    React.useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const useTriangleConfigs = () => {
    const { width, height } = useWindowSize();
    return useMemo(() => [
        { size: 288, left: width * 0.8, top: height * 0.8, color: '#A855F7', duration: 32, opacity: 0.6 },
        { size: 192, left: width * 0.1, top: height * 0.2, color: '#4F46E5', duration: 28, opacity: 0.5 },
        { size: 144, left: width * 0.6, top: height * 0.4, color: '#EC4899', duration: 24, opacity: 0.7 },
        { size: 120, left: width * 0.4, top: height * 0.6, color: '#FFF',    duration: 20, opacity: 0.4 },
        { size: 96,  left: width * 0.2, top: height * 0.8, color: '#6366F1', duration: 16, opacity: 0.8 },
        { size: 60,  left: width * 0.9, top: height * 0.1, color: '#FFF',    duration: 35, opacity: 0.3 },
    ], [width, height]);
};

const triangleDriftNames = ['triangleDriftA', 'triangleDriftB', 'triangleDriftC'];

const EventSeatChart = memo(() => {
    const navigate = useNavigate();
    const triangleConfigs = useTriangleConfigs();
    const historyRef = useRef(null);

    const [isRandomizing, setIsRandomizing] = useState(false);
    const [highlightedTableId, setHighlightedTableId] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [confirmedTableId, setConfirmedTableId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableSeats, setTableSeats] = useState(null); // เปลี่ยนเป็น null
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isLoadingSeats, setIsLoadingSeats] = useState(true);

    const [showHero, setShowHero] = useState(true);
    const [recentTables, setRecentTables] = useState([]); // เก็บโต๊ะที่เพิ่งถูกสุ่ม

    const triangles = useMemo(
        () => triangleConfigs.map((cfg, idx) => {
            const driftName = triangleDriftNames[idx % triangleDriftNames.length];
            return (
                <div
                    key={idx}
                    style={{
                        opacity: cfg.opacity,
                        position: 'absolute',
                        left: cfg.left,
                        top: cfg.top,
                        pointerEvents: 'none',
                    }}
                >
                    <AnimatedTriangle
                        {...cfg}
                        style={{
                            filter: 'drop-shadow(0 2px 8px #FFF200)',
                            animation: `${driftName} ${cfg.duration || 20}s ease-in-out infinite`,
                        }}
                    />
                </div>
            );
        }),
        [triangleConfigs]
    );

    const fisherYatesShuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // --- ส่วนของ Logic (handleRandomize, handleConfirm, ...) เหมือนเดิม ---
    const handleRandomize = useCallback(async () => {
        if (isRandomizing) return;
        setIsRandomizing(true);
        setSelectedTableId(null);

        // เฉพาะโต๊ะที่ยังมีที่ว่าง
        const availableTables = tableData.filter((t, idx) => tableSeats[idx] > 0);

        // กรองโต๊ะที่เพิ่งถูกสุ่ม (เช่น 5 ครั้งล่าสุด)
        const filteredTables = availableTables.filter(t => !recentTables.includes(t.id));
        let candidates = filteredTables.length > 0 ? filteredTables : availableTables;

        // Fisher-Yates Shuffle
        const shuffled = fisherYatesShuffle(candidates);

        // เลือกโต๊ะแรกจาก shuffle
        const winner = shuffled[0];

        // Animation (เหมือนเดิม)
        for (let i = 0; i < shuffled.length; i++) {
            setHighlightedTableId(shuffled[i].id);
            await sleep(90);
        }
        setHighlightedTableId(null);
        setSelectedTableId(winner.id);
        await sleep(600);
        setIsModalOpen(true);
        setIsRandomizing(false);

        // อัปเดตที่นั่ง
        const updatedSeats = tableSeats.map((seat, idx) =>
            tableData[idx].id === winner.id && seat > 0 ? seat - 1 : seat
        );
        for (let i = 0; i < tableData.length; i++) {
            await saveSeat({ id: tableData[i].id, count: updatedSeats[i] });
        }
        setTableSeats(updatedSeats);

        // อัปเดตประวัติสุ่ม
        const newItem = {
            label: tableLabels[tableData.findIndex(t => t.id === winner.id)],
            time: new Date().toISOString(),
        };
        await saveHistory(newItem);
        console.log('History saved, fetching all history...');
        const items = await getAllHistory();
        console.log('All history:', items);
        setHistory(items.sort((a, b) => b.time.localeCompare(a.time)));
        setRecentTables(prev => {
            const updated = [winner.id, ...prev];
            return updated.slice(0, 5);
        });
    }, [isRandomizing, tableSeats, recentTables]);

    const handleConfirm = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (historyRef.current && !historyRef.current.contains(event.target)) {
                setIsHistoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [historyRef]);

    // โหลดข้อมูลที่นั่งจาก IndexedDB
    useEffect(() => {
        getAllSeats().then(seats => {
            if (seats.length > 0) {
                setTableSeats(seats.map(s => s.count));
            } else {
                setTableSeats(initialSeats);
            }
            setIsLoadingSeats(false);
        });
    }, []);

    // โหลดประวัติจาก IndexedDB
    useEffect(() => {
        getAllHistory().then(items => {
            setHistory(items.sort((a, b) => b.time.localeCompare(a.time)));
        });
    }, []);

    const getButtonText = () => {
        if (confirmedTableId) return "ยืนยันโต๊ะแล้ว";
        if (isRandomizing) return "กำลังสุ่ม...";
        return "สุ่มโต๊ะ";
    };

    const maxSeats = tableData.length * 10; // จำนวนสูงสุดของที่นั่งที่ว่าง

    const remainingSeats = tableSeats ? tableSeats.reduce((sum, seat) => sum + seat, 0) : 0;

    return (
        <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#020617' }}>
            {/* --- Background และ Styles เหมือนเดิม --- */}
            <div className="absolute top-0 left-0 w-full h-full animate-gradient-move" style={{ background: `radial-gradient(ellipse at 70% 30%, rgba(2, 1, 37, 0.15), transparent 70%), radial-gradient(ellipse at 30% 30%, rgba(29, 78, 216, 0.15), transparent 70%), #000`, zIndex: -1 }} />
            <style>{`
                @keyframes spin-cw { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes gradient-move { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10%, -10%) scale(1.2); } 100% { transform: translate(0, 0) scale(1); } }
                .prominent-btn { background: radial-gradient(circle at 50% 0%, rgba(255, 235, 150, 0.8), rgba(255, 215, 0, 0) 70.71%), radial-gradient(circle at 6.7% 75%, rgba(255, 230, 140, 0.9), rgba(255, 215, 0, 0) 70.71%), radial-gradient(circle at 93.3% 75%, rgba(255, 200, 50, 0.9), rgba(255, 215, 0, 0) 70.71%) #1a1a1a; border: 1.5px solid rgba(255, 215, 0, 0.4); box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.2), 0 4px 15px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.4); font-weight: 600; position: relative; overflow: hidden; transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s; }
                .prominent-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.05); box-shadow: 0 0 35px 10px rgba(255, 215, 0, 0.3), 0 8px 25px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1); }
                .prominent-btn:active:not(:disabled) { transform: translateY(1px) scale(1.02); box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.2), 0 2px 10px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1); }
                .prominent-btn:disabled { background: #333; border-color: rgba(120, 120, 120, 0.5); color: #888; cursor: not-allowed; box-shadow: none; text-shadow: none; }
                .prominent-btn .dice-icon { transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
                .prominent-btn:hover:not(:disabled) .dice-icon { transform: rotate(20deg) scale(1.1); }
                .prominent-btn.is-randomizing .dice-icon { animation: spin-cw 1s linear infinite; }

                /* Liquid Glass Button Effect */
                .liquid-glass-btn {
                    background: rgba(255,255,255,0.12);
                    backdrop-filter: blur(8px);
                    WebkitBackdropFilter: blur(8px);
                    border: 1.5px solid rgba(255,255,255,0.18);
                    color: #fff;
                    transition: background 0.2s, box-shadow 0.2s, border 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .liquid-glass-btn:hover {
                    background: rgba(255,255,255,0.22);
                    box-shadow: 0 4px 24px 0 rgba(31,38,135,0.18), 0 0 0 4px rgba(255,255,255,0.08);
                    border: 1.5px solid rgba(255,255,255,0.28);
                }
                .liquid-glass-btn:active {
                    background: rgba(255,255,255,0.18);
                    box-shadow: 0 2px 12px 0 rgba(31,38,135,0.12);
                    border: 1.5px solid rgba(255,255,255,0.22);
                }

                /* Animation สำหรับขอบประกายแสง */
                @keyframes rotate-glow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animated-border-box {
                    position: relative;
                    overflow: hidden; /* สำคัญมาก: เพื่อให้ขอบโค้งมน */
                    padding: 2px; /* สร้างระยะห่างให้แสงวิ่ง */
                }
                .animated-border-box::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    z-index: 1;
                    background: conic-gradient(
                        transparent,
                        transparent,
                        transparent,
                        #FFD600,
                        transparent
                    );
                    animation: rotate-glow 4s linear infinite;
                }
                .animated-border-box > * {
                    position: relative;
                    z-index: 2;
                }
            `}</style>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes gradient-move {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(10%, -10%) scale(1.2); }
                    100% { transform: translate(0, 0) scale(1); }
                }

                /* แนะนำ: เพิ่ม style นี้ใน CSS ของ AnimatedTriangle เพื่อสร้าง Glow Effect */
                .glowing-triangle {
                    filter: drop-shadow(0 0 15px currentColor);
                }
            `}</style>

            <div className="z-10">
                {triangles}
            </div>

            <nav className="text-white px-4 py-3 flex flex-col items-center font-bold flex-shrink-0" style={{ height: '110px' }}>
                <div className="flex w-full items-center justify-between relative">
                    {/* ปุ่มย้อนกลับ Style เดียวกับปุ่มประวัติ + Liquid Glass Effect */}
                    <button
                        className="liquid-glass-btn flex items-center justify-center rounded-full p-2 shadow"
                        onClick={() => navigate('/')}
                        aria-label="ย้อนกลับ"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 flex justify-center items-center">
                        <img
                            src="/public/depa-logo-white.png"
                            alt="Depa Logo"
                            style={{
                                height: '48px',
                                maxWidth: '180px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 2px 16px #FFF20088)',
                            }}
                        />
                    </div>
                    {/* ปุ่มประวัติ + Liquid Glass Effect */}
                    <div className="relative" ref={historyRef}>
                        <button
                            className="liquid-glass-btn flex items-center justify-center rounded-full p-2 shadow"
                            onClick={() => setIsHistoryOpen(prev => !prev)}
                            aria-label="ประวัติ"
                        >
                            <History className="w-6 h-6" />
                        </button>

                        {/* Liquid Glass Dropdown */}
                        {isHistoryOpen && (
                             <div
                                className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-lg z-50 overflow-hidden"
                                style={{
                                    background: "rgba(25, 28, 44, 0.6)",
                                    backdropFilter: "blur(12px) saturate(180%)",
                                    WebkitBackdropFilter: "blur(12px) saturate(180%)",
                                    border: "1px solid rgba(255, 255, 255, 0.125)",
                                    color: "#fff",
                                }}
                            >
                                <div className="p-3">
                                    <span className="font-bold text-md px-1">ประวัติการสุ่ม</span>
                                    <ul className="mt-2 space-y-1 max-h-64 overflow-y-auto pr-1">
                                        {history.length === 0 ? (
                                            <li className="text-gray-400 text-center text-sm py-4">ยังไม่มีประวัติ</li>
                                        ) : (
                                            history.map((item, idx) => (
                                                <li key={idx} className="bg-white/5 hover:bg-white/10 rounded px-3 py-2 flex justify-between items-center text-sm transition-colors duration-150">
                                                    <span className="font-semibold">{item.label}</span>
                                                    <span className="text-xs text-gray-300">{formatDateTime(item.time)}</span>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-xl font-bold text-yellow-300 bg-black/30 px-4 py-2 rounded-lg shadow">
                        {`ที่นั่งที่ว่าง ${remainingSeats}/${maxSeats}`}
                    </span>
                </div>
            </nav>

             {/* --- ส่วนของแผนผังและปุ่มสุ่ม (เหมือนเดิม) --- */}
            <div className="relative flex-grow overflow-hidden" style={{ display: 'grid', placeItems: 'center' }}>
                <div className="relative" style={{ transform: 'translateY(-3vh) translateX(0)' }}>
                    {isLoadingSeats ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <span className="text-white text-xl animate-pulse">กำลังโหลดข้อมูลที่นั่ง...</span>
                        </div>
                    ) : (
                        <EventSeatPlan
                            baseWidth={2400}
                            baseHeight={1350}
                            highlightedTableId={highlightedTableId}
                            selectedTableId={selectedTableId}
                            confirmedTableId={confirmedTableId}
                            tableSeats={tableSeats}
                        />
                    )}

                    <div style={{
                        position: 'absolute',
                        bottom: '-45px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                    }}>
                        <button
                            className={`prominent-btn px-5 py-2 rounded-full text-base font-bold flex items-center space-x-2 ${isRandomizing ? 'is-randomizing' : ''}`}
                            style={{
                                background: 'linear-gradient(90deg, #FFD600 0%, #FF9800 100%)',
                                color: '#222',
                                border: '2.5px solid #FFF200',
                                boxShadow: '0 0 40px 10px #FFD60088, 0 2px 8px #FFC60088',
                                textShadow: '0 2px 8px #FFF20088',
                                letterSpacing: '0.05em',
                            }}
                            onClick={handleRandomize}
                            disabled={isRandomizing}
                        >
                            <Dices className="w-5 h-5 dice-icon" />
                            <span className="pt-1">{getButtonText()}</span>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                tableLabel={selectedTableId ? tableLabels[tableData.findIndex(t => t.id === selectedTableId)] : ''}
            />

            {/* แสดง Pop Up สุดท้าย เฉพาะเมื่อไม่มี Modal อื่นเปิดอยู่ */}
            {remainingSeats === 0 && !isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md p-4">
                    <div className="animated-border-box rounded-2xl w-full max-w-lg">
                        <div className="bg-slate-900/95 rounded-[14px] p-10 sm:p-12 text-center text-white shadow-2xl">
                            <img src="/src/assets/depa-logo-white.png" alt="Depa Logo" width={100} className="mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">สุ่มครบทุกโต๊ะแล้ว!</h2>
                            <p className="mb-8 text-lg sm:text-xl text-gray-300">ขอให้มีความสุขกับกิจกรรม 🎉</p>
                            <button
                                className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold text-lg transition-transform transform hover:scale-105 shadow-lg hover:shadow-yellow-400/40"
                                onClick={() => navigate('/')}
                            >
                                กลับหน้าแรก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default EventSeatChart;