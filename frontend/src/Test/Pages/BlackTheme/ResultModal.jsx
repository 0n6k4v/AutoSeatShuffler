import React from 'react';
import { X } from 'lucide-react';

const ResultModal = ({ table, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .liquid-glass-btn-modal {
                        background: linear-gradient(135deg, rgba(255,242,0,0.6) 0%, rgba(255,255,255,0.2) 100%);
                        border: 1.5px solid rgba(255,255,255,0.25);
                        box-shadow: 0 4px 32px 0 rgba(255, 242, 0, 0.15), 0 1.5px 8px 0 rgba(0,0,0,0.08);
                        backdrop-filter: blur(8px);
                        color: #222;
                        font-weight: 500;
                        position: relative;
                        overflow: hidden;
                    }
                     .liquid-glass-btn-modal:hover {
                        background: linear-gradient(135deg, rgba(255,242,0,0.8) 0%, rgba(255,255,255,0.3) 100%);
                        box-shadow: 0 6px 40px 0 rgba(255, 242, 0, 0.25), 0 2px 12px 0 rgba(0,0,0,0.12);
                    }
                `}
            </style>
            <div style={{
                background: 'linear-gradient(145deg, rgba(2, 1, 37, 0.85), rgba(29, 78, 216, 0.4))',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(29, 78, 216, 0.37), 0 0 50px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '24px',
                color: 'white',
                padding: '40px',
                textAlign: 'center',
                position: 'relative',
                width: 'clamp(300px, 90vw, 450px)',
                fontFamily: 'sans-serif',
            }}>
                <button 
                    onClick={onClose} 
                    style={{ 
                        position: 'absolute', 
                        top: '15px', 
                        right: '15px', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                    <X size={24} />
                </button>
                
                <h2 style={{
                    fontSize: '1.2rem',
                    fontWeight: '300',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                    marginBottom: '10px'
                }}>
                    ยินดีด้วย!
                </h2>
                
                <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    marginBottom: '5px'
                }}>
                    คุณได้รับโต๊ะ
                </p>

                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '16px'
                }}>
                    <span style={{ 
                        fontSize: '4.5rem',
                        fontWeight: 'bold', 
                        textShadow: '0 0 20px rgba(255, 242, 0, 0.9)' 
                    }}>
                        {table}
                    </span>
                </div>

                <button 
                    onClick={onClose}
                    className="liquid-glass-btn-modal"
                    style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        marginTop: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    ยืนยัน
                </button>
            </div>
        </div>
    );
};

export default ResultModal;