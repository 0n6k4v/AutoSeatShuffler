import React, { useMemo } from 'react';
import AnimatedTriangle from '../../Components/AnimatedTriangle';

const ShootingStarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L15 9L12.5 6.5L10 9L2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 2L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 15.5L10 13L2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const ActionButton = React.memo(function ActionButton({ children, icon, ...props }) {
    return (
        <button
            type="button"
            className="text-white font-bold px-12 py-4 rounded-full flex items-center gap-3 
                       bg-gradient-to-r from-purple-500 to-indigo-600 
                       hover:from-purple-600 hover:to-indigo-700 
                       transition-all duration-300 ease-in-out 
                       transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/50"
            {...props}
        >
            {icon}
            <span className="tracking-wider">{children}</span>
        </button>
    );
});


const useTriangleConfigs = () => {
    return useMemo(() => {
        const { innerWidth, innerHeight } = window;
        return [
            { size: 288, left: innerWidth * 0.8, top: innerHeight * 0.8, color: '#A855F7', duration: 32, opacity: 0.6 },
            { size: 192, left: innerWidth * 0.1, top: innerHeight * 0.2, color: '#4F46E5', duration: 28, opacity: 0.5 },
            { size: 144, left: innerWidth * 0.6, top: innerHeight * 0.4, color: '#EC4899', duration: 24, opacity: 0.7 },
            { size: 120, left: innerWidth * 0.4, top: innerHeight * 0.6, color: '#FFF',    duration: 20, opacity: 0.4 },
            { size: 96,  left: innerWidth * 0.2, top: innerHeight * 0.8, color: '#6366F1', duration: 16, opacity: 0.8 },
            { size: 60,  left: innerWidth * 0.9, top: innerHeight * 0.1, color: '#FFF',    duration: 35, opacity: 0.3 },
        ];
    }, []);
};


// Component หลักที่ปรับปรุงใหม่
function LandingWithTriangle() {
    const triangleConfigs = useTriangleConfigs();

    const triangles = useMemo(
        () => triangleConfigs.map((cfg, idx) => (
            <div key={idx} style={{ opacity: cfg.opacity }}>
                {/* แนะนำให้เพิ่ม filter: drop-shadow ให้กับ AnimatedTriangle เพื่อให้ดูมีมิติมากขึ้น */}
                <AnimatedTriangle {...cfg} />
            </div>
        )),
        [triangleConfigs]
    );

    return (
        <div
            className="text-white min-h-screen relative overflow-hidden"
            style={{ backgroundColor: '#020617' }} // สีพื้นหลังหลัก
        >
            {/* Element สำหรับสร้าง Gradient ที่เคลื่อนไหว */}
            <div className="absolute top-0 left-0 w-full h-full animate-gradient-move"
                 style={{
                    background: `radial-gradient(ellipse at 70% 30%, rgba(79, 70, 229, 0.3), transparent 50%), 
                                 radial-gradient(ellipse at 30% 70%, rgba(168, 85, 247, 0.3), transparent 50%)`,
                    zIndex: 1
                 }}
            />

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

            <div className="relative z-10">
                {triangles}
            </div>

            <main className="min-h-screen flex flex-col justify-center items-center relative z-20 p-4">
                <section className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
                    <img
                        className="mx-auto"
                        src="/src/assets/depa-logo-white.png"
                        alt="Depa Logo"
                        width={180}
                        loading="lazy"
                    />
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
                        Event Seat Randomizer
                    </h1>
                    <p className="max-w-2xl text-lg text-gray-400">
                        ระบบสุ่มที่นั่งสำหรับกิจกรรมและอีเวนต์ยุคใหม่ พร้อมสร้างความประทับใจให้ผู้เข้าร่วมงาน
                    </p>
                    <div className="pt-4">
                        <ActionButton icon={<ShootingStarIcon />}>
                            สุ่มที่นั่ง
                        </ActionButton>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default React.memo(LandingWithTriangle);