import React, { memo } from 'react';
import AnimatedTriangle from '../../Components/AnimatedTriangle';

const PlaceholderIcon = memo(({ className = 'w-6 h-6' }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
));

const LOGOS = [
    'zapier', 'J.CREW', "HARRY'S", 'serasa experian.', 'FAIRE',
    'vistaprint', 'alo', 'afterpay', 'FABLETICS'
];

const ActionButton = memo(({ children, icon, ...props }) => (
    <button
        type="button"
        className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors duration-150"
        {...props}
    >
        {icon}
        {children}
    </button>
));

// เพิ่ม component สำหรับโต๊ะ
const tables = [
    { id: 1, status: 'available' },
    { id: 2, status: 'occupied' },
    { id: 3, status: 'available' },
    { id: 4, status: 'available' },
    { id: 5, status: 'occupied' },
    { id: 6, status: 'available' },
    { id: 7, status: 'available' },
    { id: 8, status: 'occupied' },
];

const TableIcon = ({ status }) => (
    <div
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4
            ${status === 'available' ? 'border-green-400 bg-green-900/30' : 'border-gray-400 bg-gray-700/30'}
        `}
    >
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" stroke={status === 'available' ? '#22c55e' : '#a3a3a3'} strokeWidth="2" fill="white" />
            <text x="16" y="21" textAnchor="middle" fontSize="14" fill={status === 'available' ? '#22c55e' : '#a3a3a3'}>
                {status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
            </text>
        </svg>
    </div>
);

const triangleConfigs = [
    { size: 288, left: window.innerWidth * 0.8, top: window.innerHeight * 0.8, color: '#FFF200', duration: 32 },
    { size: 192, left: window.innerWidth * 0.2, top: window.innerHeight * 0.2, color: '#FFF200', duration: 28 },
    { size: 144, left: window.innerWidth * 0.6, top: window.innerHeight * 0.4, color: '#FFF200', duration: 24 },
    { size: 120, left: window.innerWidth * 0.4, top: window.innerHeight * 0.6, color: '#FFF200', duration: 20 },
    { size: 96,  left: window.innerWidth * 0.2, top: window.innerHeight * 0.8, color: '#FFF200', duration: 16 },
];

const triangles = triangleConfigs.map((cfg, idx) => (
    <AnimatedTriangle key={idx} {...cfg} />
));

const LandingWithTriangle = memo(() => (
    <div
        className="text-white min-h-screen font-sukhumvit relative"
        style={{
            background: `radial-gradient(ellipse at 70% 30%, rgba(2, 1, 37, 0.15), transparent 70%), 
                                 radial-gradient(ellipse at 30% 30%, rgba(29, 78, 216, 0.15), transparent 70%),
                                 #000`
        }}
    >
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
            }
        `}</style>

        {/* สามเหลี่ยม background */}
        {triangles}

        <header className="bg-opacity-20 backdrop-blur-md">
            <nav className="container mx-auto px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <img
                            src="./src/assets/depa-logo-white.png"
                            alt="Depa Logo"
                            width={80}
                            loading="lazy"
                            decoding="async"
                            fetchpriority="low"
                        />
                    </div>
                </div>
            </nav>
        </header>

        <main className="pt-48 pb-24 container mx-auto px-8 text-center">
            <section className="max-w-4xl mx-auto">
                        <img
                        className='item-center mx-auto mb-4'
                            src="./src/assets/depa-logo-white.png"
                            alt="Depa Logo"
                            width={100}
                            loading="lazy"
                            decoding="async"
                            fetchpriority="low"
                        />
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    หน้าสุดท้าย สู่ก้าวใหม่
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                    ดูแผนผัง
                </p>

                <form
                    className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-left mb-6"
                    autoComplete="off"
                    aria-label="Fusion builder input"
                >
                    <input
                        type="text"
                        placeholder="Ask Fusion to build an onboarding flow"
                        className="bg-transparent w-full text-lg p-4 focus:outline-none"
                        aria-label="Fusion builder prompt"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                    <div className="flex justify-between items-center p-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-150"
                            aria-label="Attach"
                        >
                            <PlaceholderIcon className="w-4 h-4" /> Attach
                        </button>
                        <button
                            type="submit"
                            className="text-gray-500"
                            aria-label="Submit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <button className="bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-colors duration-150">
                        <PlaceholderIcon /> Connect a repo
                    </button>
                    <ActionButton icon={<PlaceholderIcon />}>Figma Import</ActionButton>
                    <ActionButton icon={<PlaceholderIcon />}>MCP Servers</ActionButton>
                    <ActionButton icon={<PlaceholderIcon />}>Get Extension</ActionButton>
                </div>
            </section>

            <section className="mt-32">
                <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60">
                    {LOGOS.map((logo) => (
                        <p key={logo} className="font-bold text-2xl">{logo}</p>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto mt-48">
                <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-500">
                        B
                    </div>
                </div>
                <p className="text-blue-500 font-semibold mb-4">VISUAL DEVELOPMENT PLATFORM</p>
                <h2 className="text-5xl font-bold tracking-tight mb-6">
                    Bring the power of development to your entire team
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Let both developers and non-developers leverage your
                    existing tech investments to iterate and ship faster
                </p>
            </section>

            <section className="max-w-3xl mx-auto mt-24 mb-24">
                <h2 className="text-3xl font-bold mb-6 text-green-400">โต๊ะที่ว่างอยู่</h2>
                <div className="relative w-[400px] h-[400px] mx-auto">
                    {tables.map((table, idx) => {
                        const angle = (2 * Math.PI * idx) / tables.length;
                        const radius = 150;
                        const x = Math.cos(angle) * radius + 170;
                        const y = Math.sin(angle) * radius + 170;
                        return (
                            <div
                                key={table.id}
                                className="absolute"
                                style={{ left: x, top: y }}
                            >
                                <TableIcon status={table.status} />
                                <div className="text-center mt-2 text-lg font-semibold">
                                    โต๊ะ {table.id}
                                </div>
                            </div>
                        );
                    })}
                    <div className="absolute left-[150px] top-[150px] w-24 h-24 rounded-full bg-blue-900/40 flex items-center justify-center border-4 border-blue-400 text-xl font-bold">
                        Round Table
                    </div>
                </div>
            </section>
        </main>
    </div>
));

export default LandingWithTriangle;