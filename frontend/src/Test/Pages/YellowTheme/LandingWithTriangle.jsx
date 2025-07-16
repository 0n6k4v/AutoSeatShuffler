import React, { memo, useCallback, useMemo, useRef, useTransition, useEffect, useState } from 'react';
import Triangle from '../../Components/Triangle';

// --- Constants ---
const LOGOS = [
    'zapier', 'J.CREW', "HARRY'S", 'serasa experian.', 'FAIRE',
    'vistaprint', 'alo', 'afterpay', 'FABLETICS'
];

const TABLES = [
    { id: 1, status: 'available' }, { id: 2, status: 'occupied' },
    { id: 3, status: 'available' }, { id: 4, status: 'available' },
    { id: 5, status: 'occupied' }, { id: 6, status: 'available' },
    { id: 7, status: 'available' }, { id: 8, status: 'occupied' },
];

const TABLE_LAYOUT = {
    centerX: 170,
    centerY: 170,
    radius: 150,
    containerSize: 400
};

// --- Optimized Icons ---
const PlaceholderIcon = memo(({ className = 'w-6 h-6' }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        role="img"
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
));

const ArrowIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-label="Submit">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
));

// --- Optimized Components ---
const ActionButton = memo(({ children, icon, onClick, ...props }) => (
    <button
        type="button"
        className="bg-black/10 text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black/20 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        onClick={onClick}
        {...props}
    >
        {icon}
        {children}
    </button>
));

const TableIcon = memo(({ status, tableId }) => {
    const isAvailable = status === 'available';
    const borderColor = isAvailable ? 'border-green-500' : 'border-gray-400';
    const bgColor = isAvailable ? 'bg-green-100' : 'bg-gray-200';
    const strokeColor = isAvailable ? '#22c55e' : '#a3a3a3';
    const textColor = isAvailable ? '#15803d' : '#4b5563';
    const statusText = isAvailable ? 'ว่าง' : 'ไม่ว่าง';

    return (
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 ${borderColor} ${bgColor}`}>
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32" role="img" aria-label={`Table ${tableId} - ${statusText}`}>
                <circle cx="16" cy="16" r="14" stroke={strokeColor} strokeWidth="2" fill="white" />
                <text x="16" y="21" textAnchor="middle" fontSize="14" fill={textColor}>
                    {statusText}
                </text>
            </svg>
        </div>
    );
});

function isCollide(a, b) {
    return (
        a.x < b.x + b.size &&
        a.x + a.size > b.x &&
        a.y < b.y + b.size &&
        a.y + a.size > b.y
    );
}

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

                // ชนสามเหลี่ยมอื่น
                for (const o of others) {
                    if (isCollide({ x: x + dx, y: y + dy, size }, o)) {
                        direction.current.dx *= -1;
                        direction.current.dy *= -1;
                        break;
                    }
                }

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

const AnimatedTriangle = memo(({ size, startX, startY, color, duration, others = [] }) => {
    const pos = useBounce(startX, startY, size, 0.5, others);
    return (
        <div className="fixed pointer-events-none z-0" style={{
            left: pos.x,
            top: pos.y,
            width: size,
            height: size,
            transition: 'none',
            opacity: 0.25, // จางลง
            filter: 'blur(2px)', // เบลอ
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

const LogoSection = memo(() => (
    <section className="mt-32" aria-label="Partner logos">
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-80">
            {LOGOS.map((logo) => (
                <p key={logo} className="font-bold text-2xl text-black/60" aria-label={`Partner: ${logo}`}>
                    {logo}
                </p>
            ))}
        </div>
    </section>
));

const TableLayout = memo(() => {
    const tablePositions = useMemo(() => 
        TABLES.map((table, idx) => {
            const angle = (2 * Math.PI * idx) / TABLES.length;
            const x = Math.cos(angle) * TABLE_LAYOUT.radius + TABLE_LAYOUT.centerX;
            const y = Math.sin(angle) * TABLE_LAYOUT.radius + TABLE_LAYOUT.centerY;
            return { ...table, x, y };
        }),
        []
    );

    return (
        <section className="max-w-3xl mx-auto mt-24 mb-24" aria-label="Table availability">
            <h2 className="text-3xl font-bold mb-6 text-green-800">โต๊ะที่ว่างอยู่</h2>
            <div className={`relative w-[${TABLE_LAYOUT.containerSize}px] h-[${TABLE_LAYOUT.containerSize}px] mx-auto`}>
                {tablePositions.map((table) => (
                    <div
                        key={table.id}
                        className="absolute"
                        style={{ left: table.x, top: table.y }}
                    >
                        <TableIcon status={table.status} tableId={table.id} />
                        <div className="text-center mt-2 text-lg font-semibold text-gray-800">
                            โต๊ะ {table.id}
                        </div>
                    </div>
                ))}
                <div className="absolute left-[150px] top-[150px] w-24 h-24 rounded-full bg-blue-200/80 flex items-center justify-center border-4 border-blue-500 text-xl font-bold text-blue-800">
                    Round Table
                </div>
            </div>
        </section>
    );
});

const SearchForm = memo(() => {
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef(null);

    const handleSubmit = useCallback(() => {
        startTransition(() => {
            // Handle search logic here
            console.log('Search submitted:', inputRef.current?.value);
        });
    }, []);

    const handleAttach = useCallback(() => {
        // Handle file attachment
        console.log('Attach file clicked');
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }, [handleSubmit]);

    return (
        <div
            className="bg-white/50 border border-yellow-400 rounded-lg p-2 text-left mb-6 shadow-md"
            role="search"
            aria-label="Search form"
        >
            <input
                ref={inputRef}
                type="text"
                placeholder="ค้นหาข้อมูลหรือสอบถาม..."
                className="bg-transparent w-full text-lg p-4 focus:outline-none placeholder-gray-600"
                aria-label="Search input"
                autoCorrect="off"
                spellCheck="false"
                onKeyDown={handleKeyDown}
            />
            <div className="flex justify-between items-center p-2">
                <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={handleAttach}
                    aria-label="Attach file"
                >
                    <PlaceholderIcon className="w-4 h-4" /> แนบไฟล์
                </button>
                <button
                    type="button"
                    className="text-gray-800 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                    aria-label="Submit search"
                    disabled={isPending}
                    onClick={handleSubmit}
                >
                    <ArrowIcon />
                </button>
            </div>
        </div>
    );
});

const LandingWithTriangle = memo(() => {
    const handleAction = useCallback((action) => {
        console.log(`Action clicked: ${action}`);
    }, []);

    const actionButtons = useMemo(() => [
        { key: 'repo', label: 'เชื่อมต่อ Repo', variant: 'primary' },
        { key: 'figma', label: 'นำเข้า Figma', variant: 'secondary' },
        { key: 'mcp', label: 'เซิร์ฟเวอร์ MCP', variant: 'secondary' },
        { key: 'extension', label: 'ส่วนขยาย', variant: 'secondary' },
    ], []);

    const triangleConfigs = [
        { size: 288, startX: window.innerWidth * 0.8, startY: window.innerHeight * 0.8, color: 'rgba(255,255,255,0.4)', duration: 32 },
        { size: 192, startX: window.innerWidth * 0.2, startY: window.innerHeight * 0.2, color: 'rgba(255,255,255,0.3)', duration: 28 },
        { size: 144, startX: window.innerWidth * 0.6, startY: window.innerHeight * 0.4, color: 'rgba(255,255,255,0.2)', duration: 24 },
        { size: 120, startX: window.innerWidth * 0.4, startY: window.innerHeight * 0.6, color: 'rgba(255,255,255,0.15)', duration: 20 },
        { size: 96,  startX: window.innerWidth * 0.2, startY: window.innerHeight * 0.8, color: 'rgba(255,255,255,0.1)', duration: 16 },
    ];

    // others logic (optional: update for collision)
    const triangles = triangleConfigs.map((cfg, idx) => {
        const others = triangleConfigs.filter((_, i) => i !== idx);
        return <AnimatedTriangle key={idx} {...cfg} others={others} />;
    });

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

                <main className="relative z-10 pt-48 pb-24 container mx-auto px-8 text-center">
                    <section className="max-w-4xl mx-auto">
                        <img
                            className="mx-auto mb-4"
                            src="./src/assets/depa-black-logo.png"
                            alt="Depa Logo"
                            width={100}
                            height={50}
                            loading="lazy"
                            decoding="async"
                        />
                        <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
                            หน้าสุดท้าย สู่ก้าวใหม่
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                            ดูแผนผัง
                        </p>

                        <SearchForm />

                        <div className="flex justify-center items-center gap-4 flex-wrap">
                            {actionButtons.map((button) => (
                                button.variant === 'primary' ? (
                                    <button
                                        key={button.key}
                                        className="bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-colors duration-150 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        onClick={() => handleAction(button.key)}
                                    >
                                        <PlaceholderIcon /> {button.label}
                                    </button>
                                ) : (
                                    <ActionButton
                                        key={button.key}
                                        icon={<PlaceholderIcon />}
                                        onClick={() => handleAction(button.key)}
                                    >
                                        {button.label}
                                    </ActionButton>
                                )
                            ))}
                        </div>
                    </section>

                    <LogoSection />

                    <section className="max-w-4xl mx-auto mt-48">
                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-500">
                                B
                            </div>
                        </div>
                        <p className="text-blue-600 font-semibold mb-4">VISUAL DEVELOPMENT PLATFORM</p>
                        <h2 className="text-5xl font-bold tracking-tight mb-6 text-gray-900">
                            Bring the power of development to your entire team
                        </h2>
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            Let both developers and non-developers leverage your
                            existing tech investments to iterate and ship faster
                        </p>
                    </section>

                    <TableLayout />
                </main>
            </div>
        </>
    );
});

export default LandingWithTriangle;