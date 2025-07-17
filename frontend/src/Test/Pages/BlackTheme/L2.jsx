import React, { useMemo } from 'react';
import AnimatedTriangle from '../../Components/AnimatedTriangle';

const ActionButton = React.memo(function ActionButton({ children, icon, ...props }) {
    return (
        <button
            type="button"
            className="bg-gray-800 text-gray-300 px-12 pt-3 pb-2 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors duration-150"
            {...props}
        >
            {icon}
            {children}
        </button>
    );
});

const useTriangleConfigs = () => {
    // Use useMemo to avoid recalculating on every render
    return useMemo(() => {
        const { innerWidth, innerHeight } = window;
        return [
            { size: 288, left: innerWidth * 0.8, top: innerHeight * 0.8, color: '#FFF200', duration: 32 },
            { size: 192, left: innerWidth * 0.2, top: innerHeight * 0.2, color: '#FFF200', duration: 28 },
            { size: 144, left: innerWidth * 0.6, top: innerHeight * 0.4, color: '#FFF200', duration: 24 },
            { size: 120, left: innerWidth * 0.4, top: innerHeight * 0.6, color: '#FFF200', duration: 20 },
            { size: 96,  left: innerWidth * 0.2, top: innerHeight * 0.8, color: '#FFF200', duration: 16 },
        ];
    }, []);
};

function LandingWithTriangle() {
    const triangleConfigs = useTriangleConfigs();

    // Use useMemo for triangle elements
    const triangles = useMemo(
        () => triangleConfigs.map((cfg, idx) => <AnimatedTriangle key={idx} {...cfg} />),
        [triangleConfigs]
    );

    return (
        <div
            className="text-white min-h-screen relative"
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

            {triangles}

            <main className="min-h-screen flex flex-col justify-center items-center">
                <section className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
                    <img
                        className="mx-auto"
                        src="/src/assets/depa-logo-white.png"
                        alt="Depa Logo"
                        width={200}
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                    />
                    <div className="flex justify-center items-center gap-4 flex-wrap">
                        <ActionButton>สุ่มที่นั่ง</ActionButton>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default React.memo(LandingWithTriangle);