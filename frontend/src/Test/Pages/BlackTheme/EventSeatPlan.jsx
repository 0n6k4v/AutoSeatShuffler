import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { Rnd } from "react-rnd";
import { pillData, newChairsData, tableData, tableLabels } from './EventSeatData';

// --- Custom Hook for Responsive Scaling ---
const useResponsiveScaling = (baseWidth, baseHeight) => {
    const NAV_HEIGHT = 95;
    const getScale = () => {
        if (typeof window === 'undefined') return 0.5;
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight - NAV_HEIGHT; // Approximate available height
        const scaleX = availableWidth / baseWidth;
        const scaleY = availableHeight / baseHeight;
        return Math.min(scaleX, scaleY);
    };
    const [scale, setScale] = useState(getScale());
    useEffect(() => {
        const handleResize = () => setScale(getScale());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [baseWidth, baseHeight]);
    return scale;
};

// --- Base Glass Style ---
const liquidGlassBaseStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1.5px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1), 0 0 20px rgba(29, 78, 216, 0.2)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    userSelect: "none",
};


// ... Other memoized components (FixedStage, FixedPodium, etc.) remain unchanged ...
const FixedStage = memo(({ scale, offset }) => {
    const stageState = { width: 181, height: 353, x: 112, y: 313 };
    const style = {
        ...liquidGlassBaseStyle,
        borderRadius: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#4A5568", // เปลี่ยนสีพื้นหลัง Stage
        color: "#CBD5E0",      // เปลี่ยนสีตัวอักษร Stage
        fontFamily: "sans-serif",
        fontSize: `${1.2 * scale}rem`,
        fontWeight: "bold",
        letterSpacing: "0.1em",
        textShadow: "0 0 10px rgba(255,255,255,0.2)",
    };
    return (
        <Rnd 
            style={style} 
            size={{ width: stageState.width * scale, height: stageState.height * scale }} 
            position={{ x: (stageState.x + offset.x) * scale, y: (stageState.y + offset.y) * scale }}
            disableDragging 
            enableResizing={false} 
            dragHandleClassName=""
        >
            STAGE
        </Rnd>
    );
});

const FixedPodium = memo(({ scale, offset }) => {
    const podiumState = { width: 276, height: 44, x: 131, y: 889 };
    const style = { ...liquidGlassBaseStyle, borderRadius: "16px" };
    return (
        <Rnd 
            style={style} 
            size={{ width: podiumState.width * scale, height: podiumState.height * scale }} 
            position={{ x: (podiumState.x + offset.x) * scale, y: (podiumState.y + offset.y) * scale }}
            disableDragging 
            enableResizing={false} 
            dragHandleClassName="" 
        />
    );
});

const FixedPill = memo(({ x, y, width, height, rotation, scale }) => {
    const pillWrapperStyle = {
        width: "100%", height: "100%", transform: `rotate(${rotation}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none",
    };
    const pillBodyStyle = {
        ...liquidGlassBaseStyle, width: "100%", height: "100%",
        display: "flex", alignItems: "center", borderRadius: `${(height * scale) / 2}px`,
        paddingLeft: "5px", boxSizing: "border-box",
    };
    const endCapStyle = {
        width: height * scale - 10, height: height * scale - 10,
        backgroundColor: "rgba(219, 234, 254, 0.8)", borderRadius: "50%",
        flexShrink: 0, border: "1px solid rgba(255, 255, 255, 0.5)",
    };
    return (
        <Rnd size={{ width: width * scale, height: height * scale }} position={{ x: x * scale, y: y * scale }} disableDragging enableResizing={false} dragHandleClassName="">
            <div style={pillWrapperStyle}><div style={pillBodyStyle}><div style={endCapStyle} /></div></div>
        </Rnd>
    );
});

const ChairDisplayForTable = memo(({ rotation, scale, isHighlighted, isSelected, isConfirmed, isDimmed, isHovered }) => {
    const chairWidth = 40 * scale, chairHeight = 42 * scale;
    let chairScale = 1;
    if (isHovered && !isSelected && !isConfirmed && !isDimmed) chairScale = 1.05;

    const wrapperStyle = { 
        transform: `rotate(${rotation}deg) scale(${chairScale})`,
        transformOrigin: "center center", 
        position: "relative", width: chairWidth, height: chairHeight, userSelect: "none",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        ...(isHovered && !isSelected && !isConfirmed && !isDimmed && { boxShadow: "0 0 12px 4px rgba(190, 230, 255, 0.5)" }),
        ...(isHighlighted && { boxShadow: "0 0 18px 6px rgba(255, 242, 0, 0.7)" }),
        ...(isSelected && { boxShadow: "0 0 18px 6px rgba(255, 242, 0, 0.7)", borderColor: "#FFD600" }),
        ...(isConfirmed && { boxShadow: "0 0 18px 6px rgba(255, 242, 0, 0.7)", borderColor: "#FFD600" }),
        ...(isDimmed && { opacity: 0.3, filter: "grayscale(80%)" }),
    };
    const chairBodyStyle = { position: "relative", width: "100%", height: "100%" };
    const backrestStyle = { position: "absolute", top: "0px", left: "50%", transform: "translateX(-50%)", width: "80%", height: "40%", backgroundColor: "rgba(100, 116, 139, 0.5)", borderRadius: "6px 6px 3px 3px", zIndex: 2, border: "1px solid rgba(255, 255, 255, 0.2)" };
    const seatStyle = { position: "absolute", bottom: "0px", left: "50%", transform: "translateX(-50%)", width: "90%", height: "75%", backgroundColor: "rgba(255, 255, 255, 0.6)", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.4)", zIndex: 1, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" };
    const armrestStyle = { position: "absolute", bottom: "8%", width: "18%", height: "65%", backgroundColor: "rgba(100, 116, 139, 0.7)", borderRadius: "4px", zIndex: 2, border: "1px solid rgba(255, 255, 255, 0.15)" };
    return (
        <div style={wrapperStyle}>
            <div style={chairBodyStyle}><div style={seatStyle} /><div style={backrestStyle} /><div style={{...armrestStyle, left: "0px"}} /><div style={{...armrestStyle, right: "0px"}} /></div>
        </div>
    );
});

const FixedTableGroup = memo(({ id, x, y, radius, numberOfChairs, label, scale, isHighlighted, isSelected, isConfirmed, isDimmed, isHovered, setHoveredTableId, className }) => {
    const scaledRadius = radius * scale;
    const chairSize = { width: 40 * scale, height: 42 * scale };
    const placementRadius = scaledRadius + 28 * scale;
    const containerSize = (placementRadius + chairSize.height) * 2;
    
    const containerStyle = { 
        position: "absolute", 
        left: `${x * scale}px`, top: `${y * scale}px`, 
        width: `${containerSize}px`, height: `${containerSize}px`, 
        transform: "translate(-50%, -50%)", 
        userSelect: "none",
        pointerEvents: 'auto',
        cursor: !isDimmed && !isConfirmed ? 'pointer' : 'default',
    };
    
    let scaleValue = 1;
    if (isSelected) scaleValue = 1.15;
    else if (isConfirmed || isHighlighted) scaleValue = 1.1;
    else if (isHovered && !isDimmed) scaleValue = 1.05; 
    
    const transformValue = `translate(-50%, -50%) scale(${scaleValue})`;

    const tableGuideStyle = {
        ...liquidGlassBaseStyle,
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${scaledRadius * 2}px`,
        height: `${scaledRadius * 2}px`,
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#CBD5E0",
        background: isHighlighted ? "rgba(255, 242, 0, 0.25)" : "#4A5568",
        fontFamily: "sans-serif",
        textShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: transformValue,
        pointerEvents: 'none',
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderColor: isHighlighted || isSelected || isConfirmed
            ? "#FFD600"
            : "rgba(255, 255, 255, 0.25)",
        ...(isHovered && !isSelected && !isConfirmed && !isDimmed && { boxShadow: "0 0 25px 8px rgba(190, 230, 255, 0.6)" }),
        ...(isHighlighted && { boxShadow: "0 0 30px 10px rgba(255, 242, 0, 0.8), 0 0 50px 20px rgba(255, 200, 0, 0.6)" }),
        ...(isSelected && { boxShadow: "0 0 45px 20px rgba(255, 242, 0, 0.9), 0 0 70px 30px rgba(255, 200, 0, 0.6)", animation: "pulseYellow 1.5s infinite" }),
        ...(isConfirmed && { backgroundColor: "rgba(255, 242, 0, 0.25)" }),
        ...(isDimmed && { opacity: 0.3, filter: "grayscale(80%)" }),
    };

    const textContainerStyle = { position: 'relative', top: `${3 * scale}px`, display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const labelStyle = { fontSize: `${2 * scale}rem`, fontWeight: "bold", lineHeight: 1, color: "#CBD5E0" };
    const capacityStyle = { fontSize: `${0.9 * scale}rem`, fontWeight: "normal", color: "#CBD5E0" };

    const chairs = Array.from({ length: numberOfChairs }, (_, i) => {
        const angleRad = (i / numberOfChairs) * 2 * Math.PI; const angleDeg = angleRad * (180 / Math.PI);
        const chairX = placementRadius * Math.cos(angleRad); const chairY = placementRadius * Math.sin(angleRad);
        const rotation = angleDeg + 90;
        const chairStyle = { position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${chairX}px, ${chairY}px)`, pointerEvents: 'none' };
        return (
            <div key={i} style={chairStyle}>
                <ChairDisplayForTable rotation={rotation} scale={scale} isHighlighted={isHighlighted} isSelected={isSelected} isConfirmed={isConfirmed} isDimmed={isDimmed} isHovered={isHovered} />
            </div>
        );
    });

    return (
        <div style={containerStyle} onMouseEnter={() => !isDimmed && !isConfirmed && setHoveredTableId(id)} onMouseLeave={() => setHoveredTableId(null)}>
            <div style={tableGuideStyle} className={isHighlighted ? "highlight-animate" : ""}>
                <div style={textContainerStyle}>
                    <div style={labelStyle}>{label}</div>
                    <div style={capacityStyle}>({numberOfChairs}/10)</div>
                </div>
            </div>
            {chairs}
        </div>
    );
});

const FixedChair = memo(({ x, y, width, height, rotation, scale }) => {
    const containerStyle = { position: "absolute", left: `${x * scale}px`, top: `${y * scale}px`, width: `${width * scale}px`, height: `${height * scale}px`, transform: `rotate(${rotation}deg)`, userSelect: "none" };
    return <div style={containerStyle}><ChairDisplayForTable rotation={0} scale={scale} /></div>;
});


// --- Main Component (FINAL VERSION) ---
const EventSeatPlan = memo(({ baseWidth, baseHeight, highlightedTableId, selectedTableId, confirmedTableId, tableSeats }) => {
    const scale = useResponsiveScaling(baseWidth, baseHeight);
    const [hoveredTableId, setHoveredTableId] = useState(null);

    // ใช้ useCallback เพื่อป้องกัน re-render
    const handleSetHoveredTableId = useCallback((id) => setHoveredTableId(id), []);

    // เพิ่ม state สำหรับ highlight animation
    const [animatedHighlightId, setAnimatedHighlightId] = useState(null);
    useEffect(() => {
        if (highlightedTableId) {
            setAnimatedHighlightId(highlightedTableId);
            // เพิ่ม fade-in effect
            const timer = setTimeout(() => setAnimatedHighlightId(null), 600); // 600ms
            return () => clearTimeout(timer);
        }
    }, [highlightedTableId]);

    const verticalPadding = 250; // Padding บน-ล่าง ในหน่วยของ base coordinate

    const layout = useMemo(() => {
        const stageElement = { x: 112, y: 313, width: 181, height: 353 };
        const podiumElement = { x: 131, y: 889, width: 276, height: 44 };

        const allElements = [
            ...tableData.map(t => ({ x: t.x - t.radius, y: t.y - t.radius })),
            ...tableData.map(t => ({ x: t.x + t.radius, y: t.y + t.radius })),
            ...newChairsData.map(c => ({ x: c.x, y: c.y })),
            ...newChairsData.map(c => ({ x: c.x + c.w, y: c.y + c.h })),
            ...pillData.map(p => ({ x: p.x, y: p.y })),
            ...pillData.map(p => ({ x: p.x + p.w, y: p.y + p.h })),
            { x: stageElement.x, y: stageElement.y },
            { x: stageElement.x + stageElement.width, y: stageElement.y + stageElement.height },
            { x: podiumElement.x, y: podiumElement.y },
            { x: podiumElement.x + podiumElement.width, y: podiumElement.y + podiumElement.height },
        ];

        if (allElements.length === 0) return { offset: { x: 0, y: 0 }, contentHeight: baseHeight };

        const minX = Math.min(...allElements.map(e => e.x));
        const maxX = Math.max(...allElements.map(e => e.x));
        const minY = Math.min(...allElements.map(e => e.y));
        const maxY = Math.max(...allElements.map(e => e.y));

        const contentCenterX = minX + (maxX - minX) / 2;
        const contentHeight = maxY - minY;

        const offsetX = (baseWidth / 2) - contentCenterX;
        
        // --- CHANGED: นี่คือหัวใจของการแก้ไข ---
        // เราจะจัดกลางเนื้อหาในแนวตั้ง ภายใน Padding ที่เรากำหนดไว้
        // โดยการเลื่อนเนื้อหาทั้งหมดลงมาครึ่งหนึ่งของ Padding
        const offsetY = (verticalPadding / 2) - minY;

        return {
            offset: { x: offsetX, y: offsetY },
            contentHeight: contentHeight,
        };
    }, [baseWidth, baseHeight]);

    const containerHeight = (layout.contentHeight + verticalPadding) * scale;

    return (
        <div style={{
            width: `${baseWidth * scale}px`,
            height: `${containerHeight}px`,
            backgroundColor: "transparent",
            position: "relative",
            overflow: "hidden",
            touchAction: "none",
            userSelect: "none"
        }}>
            <style>{`
                @keyframes pulseYellow {
                    0% { box-shadow: 0 0 35px 15px rgba(255, 242, 0, 0.7), 0 0 60px 25px rgba(255, 200, 0, 0.4); }
                    50% { box-shadow: 0 0 45px 20px rgba(255, 242, 0, 0.9), 0 0 70px 30px rgba(255, 200, 0, 0.6); }
                    100% { box-shadow: 0 0 35px 15px rgba(255, 242, 0, 0.7), 0 0 60px 25px rgba(255, 200, 0, 0.4); }
                }
                .highlight-animate {
                    animation: pulseYellow 0.6s cubic-bezier(0.4,0,0.2,1);
                    transition: box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
            <FixedStage scale={scale} offset={layout.offset} />
            <FixedPodium scale={scale} offset={layout.offset} />

            {tableData.map((table, index) => {
                // ถ้าอยู่ในช่วง animation ให้ใช้ highlightedTableId
                const isHighlight = highlightedTableId
                    ? highlightedTableId === table.id
                    : selectedTableId === table.id;
                return (
                    <FixedTableGroup
                        key={table.id}
                        id={table.id}
                        x={table.x + layout.offset.x}
                        y={table.y + layout.offset.y}
                        radius={table.radius}
                        numberOfChairs={tableSeats ? tableSeats[index] : table.chairs}
                        label={tableLabels[index]}
                        scale={scale}
                        isHighlighted={isHighlight}
                        isSelected={selectedTableId === table.id}
                        isConfirmed={confirmedTableId === table.id}
                        isDimmed={
                            (selectedTableId || confirmedTableId)
                                ? (table.id !== selectedTableId && table.id !== confirmedTableId)
                                : (tableSeats && tableSeats[index] === 0)
                        }
                        isHovered={table.id === hoveredTableId}
                        setHoveredTableId={handleSetHoveredTableId}
                        className={isHighlight ? "highlight-animate" : ""}
                    />
                );
            })}
            {newChairsData.map((chair) => (
                <FixedChair 
                    key={chair.id} 
                    x={chair.x + layout.offset.x} 
                    y={chair.y + layout.offset.y} 
                    width={chair.w} 
                    height={chair.h} 
                    rotation={chair.r} 
                    scale={scale} 
                />
            ))}
            {pillData.map((p) => (
                <FixedPill 
                    key={p.id} 
                    x={p.x + layout.offset.x} 
                    y={p.y + layout.offset.y} 
                    width={p.w} 
                    height={p.h} 
                    rotation={p.r} 
                    scale={scale} 
                />
            ))}
        </div>
    );
});

export default EventSeatPlan;