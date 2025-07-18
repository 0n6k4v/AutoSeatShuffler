import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTriangle from '../Components/AnimatedTriangle';

const ActionButton = React.memo(
    React.forwardRef(function ActionButton({ children, icon, className = '', ...props }, ref) {
        return (
            <button
                type="button"
                className="
                    text-black font-extrabold px-8 py-3 rounded-full flex items-center gap-3
                    bg-gradient-to-r from-[#FFF200] to-[#FFC600]
                    transition-all duration-300 ease-in-out
                    shadow-lg
                    hover:scale-105
                    animate-pulse
                "
                {...props}
                style={{
                    boxShadow: '0 0 8px 2px #FFF20088, 0 2px 8px #FFC60088',
                    textShadow: '0 2px 8px #FFF20088',
                }}
            >
                {icon}
                <span className="tracking-wider pt-1">{children}</span>
            </button>
        );
    })
);

// Responsive triangle configs using window size from a hook
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

// Triangle animation keyframes (move to CSS for best practice)
const triangleDriftNames = ['triangleDriftA', 'triangleDriftB', 'triangleDriftC'];

function LandingPage() {
    const triangleConfigs = useTriangleConfigs();
    const navigate = useNavigate();

    // Memoize triangles for performance
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

    return (
        <div className="text-white min-h-screen relative overflow-hidden" style={{ backgroundColor: '#020617' }}>
            {/* Move keyframes to CSS file for maintainability */}
            <div
                className="absolute top-0 left-0 w-full h-full animate-gradient-move"
                style={{
                    background:
                        `radial-gradient(ellipse at 70% 30%, rgba(2, 1, 37, 0.15), transparent 70%), 
                        radial-gradient(ellipse at 30% 30%, rgba(29, 78, 216, 0.15), transparent 70%),
                        #000`,
                    zIndex: 1,
                }}
            />

            <div className="relative z-10 w-full h-full absolute top-0 left-0">
                {triangles}
            </div>
            <main className="min-h-screen flex flex-col justify-center items-center relative z-20 p-2 sm:p-4">
                <section className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-4">
                    <img
                        src="/depa-logo-white.png"
                        alt="Depa Logo"
                        width={100}
                        style={{ maxWidth: '60vw', height: 'auto' }}
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                    />
                    <h1 className="text-3xl sm:text-6xl font-extrabold py-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 text-center">
                        หน้าสุดท้าย สู่ก้าวใหม่
                    </h1>
                    <p className="max-w-xs sm:max-w-xl text-base sm:text-lg text-gray-400 text-center">
                        ระบบสุ่มที่นั่งสำหรับกิจกรรมภายในวันนี้
                    </p>
                    <div className="pt-2 flex justify-center">
                        <ActionButton
                            className={`
                                min-w-[110px]
                                text-[0.85rem]
                                py-[0.38rem] px-[0.8rem]
                                ${window.innerWidth < 640 ? 'text-[0.75rem] py-[0.32rem] px-[0.65rem]' : ''}
                            `}
                            onClick={() => navigate('/eventSeatChart')}
                        >
                            กดเพื่อสุ่มโต๊ะ
                        </ActionButton>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default React.memo(LandingPage);
