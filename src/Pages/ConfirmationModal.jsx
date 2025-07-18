import React, { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import confetti from 'canvas-confetti'; // เพิ่มบรรทัดนี้

const TRANSITION_DURATION = 300;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, tableLabel }) => {
    const modalRef = useRef(null);

    // Trap focus inside modal for accessibility
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleTab);
        first?.focus();

        return () => document.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Handle ESC key to close modal
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Animation state
    const [show, setShow] = React.useState(isOpen);
    useEffect(() => {
        if (isOpen) setShow(true);
        else {
            const timer = setTimeout(() => setShow(false), TRANSITION_DURATION);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Trigger confetti when modal opens
    useEffect(() => {
        if (isOpen) {
            // พลุจากซ้ายเต็มจอ
            confetti({
                particleCount: 300,
                angle: 60,
                spread: 360,
                scalar: 1.5,
                origin: { x: 0, y: 1 },
                gravity: 3, // เพิ่มความเร็วตก
                ticks: 120,   // ลดจำนวน frame ให้อนิเมชั่นจบเร็วขึ้น
            });
            // พลุจากขวาเต็มจอ
            confetti({
                particleCount: 300,
                angle: 120,
                spread: 360,
                scalar: 1.5,
                origin: { x: 1, y: 1 },
                gravity: 3, // เพิ่มความเร็วตก
                ticks: 120,   // ลดจำนวน frame ให้อนิเมชั่นจบเร็วขึ้น
            });
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                background: "rgba(20, 20, 30, 0.25)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'auto' : 'none',
            }}
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative text-white p-8 rounded-2xl border border-white/20 w-full max-w-md mx-4"
                style={{
                    background: "rgba(2, 6, 23, 0.85)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    transition: `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "scale(1)" : "scale(0.97)",
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    tabIndex={0}
                >
                    <X size={24} />
                </button>
                <div className="text-center">
                    <p className="text-lg font-light text-gray-300">ยินดีด้วย!</p>
                    <h2 className="text-4xl font-bold my-2">คุณได้โต๊ะ</h2>
                    <div className="my-6 inline-block">
                        <div className="w-28 h-28 rounded-full flex items-center justify-center bg-yellow-400/20 border-2 border-yellow-300">
                            <span className="text-6xl font-bold text-white pr-1 pt-1" style={{ textShadow: "0 0 15px #fff" }}>{tableLabel}</span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={onConfirm}
                            className="flex items-center justify-center gap-2 px-6 pt-4 pb-3 bg-yellow-400 text-white font-semibold rounded-full hover:bg-yellow-500 transition-all transform hover:scale-105"
                        >
                            <Check size={20} />
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;