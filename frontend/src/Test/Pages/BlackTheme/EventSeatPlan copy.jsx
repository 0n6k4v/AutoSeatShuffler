import React, { memo, useMemo } from "react";
import { Rnd } from "react-rnd";

// --- Base Glass Style ---
const liquidGlassBaseStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1.5px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1), 0 0 20px rgba(29, 78, 216, 0.2)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    userSelect: "none",
};

// --- Stage ---
const FixedStage = memo(() => {
    const stageState = { width: 181, height: 353, x: 112, y: 313 };
    const style = {
        ...liquidGlassBaseStyle,
        borderRadius: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "sans-serif",
        fontSize: "1.2rem",
        fontWeight: "bold",
        letterSpacing: "0.1em",
    };
    return (
        <Rnd
            style={style}
            size={{ width: stageState.width, height: stageState.height }}
            position={{ x: stageState.x, y: stageState.y }}
            disableDragging
            enableResizing={false}
            dragHandleClassName=""
        >
            STAGE
        </Rnd>
    );
});

// --- Podium ---
const FixedPodium = memo(() => {
    const podiumState = { width: 276, height: 44, x: 131, y: 889 };
    const style = {
        ...liquidGlassBaseStyle,
        borderRadius: "16px",
    };
    return (
        <Rnd
            style={style}
            size={{ width: podiumState.width, height: podiumState.height }}
            position={{ x: podiumState.x, y: podiumState.y }}
            disableDragging
            enableResizing={false}
            dragHandleClassName=""
        />
    );
});

// --- Pill ---
const FixedPill = memo(({ x, y, width, height, rotation }) => {
    const pillWrapperStyle = {
        width: "100%",
        height: "100%",
        transform: `rotate(${rotation}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
    };
    const pillBodyStyle = {
        ...liquidGlassBaseStyle,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: `${height / 2}px`,
        paddingLeft: "5px",
        boxSizing: "border-box",
    };
    const endCapStyle = {
        width: height - 10,
        height: height - 10,
        backgroundColor: "rgba(219, 234, 254, 0.8)",
        borderRadius: "50%",
        flexShrink: 0,
        border: "1px solid rgba(255, 255, 255, 0.5)",
    };
    return (
        <Rnd
            size={{ width, height }}
            position={{ x, y }}
            disableDragging
            enableResizing={false}
            dragHandleClassName=""
        >
            <div style={pillWrapperStyle}>
                <div style={pillBodyStyle}>
                    <div style={endCapStyle} />
                </div>
            </div>
        </Rnd>
    );
});

// --- Chair for Table (Simplified) ---
const ChairDisplayForTable = memo(({ rotation }) => {
    const chairWidth = 40,
        chairHeight = 42;
    const wrapperStyle = {
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        position: "relative",
        width: chairWidth,
        height: chairHeight,
        userSelect: "none",
    };
    const chairBodyStyle = { position: "relative", width: "100%", height: "100%" };
    const backrestStyle = {
        position: "absolute",
        top: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        height: "40%",
        backgroundColor: "rgba(100, 116, 139, 0.5)",
        borderRadius: "6px 6px 3px 3px",
        zIndex: 2,
        border: "1px solid rgba(255, 255, 255, 0.2)",
    };
    const seatStyle = {
        position: "absolute",
        bottom: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        height: "75%",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "8px",
        border: "1.5px solid rgba(255, 255, 255, 0.4)",
        zIndex: 1,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
    };
    const armrestStyle = {
        position: "absolute",
        bottom: "8%",
        width: "18%",
        height: "65%",
        backgroundColor: "rgba(100, 116, 139, 0.7)",
        borderRadius: "4px",
        zIndex: 2,
        border: "1px solid rgba(255, 255, 255, 0.15)",
    };
    const armrestLeftStyle = { ...armrestStyle, left: "0px" };
    const armrestRightStyle = { ...armrestStyle, right: "0px" };
    return (
        <div style={wrapperStyle}>
            <div style={chairBodyStyle}>
                <div style={seatStyle} />
                <div style={backrestStyle} />
                <div style={armrestLeftStyle} />
                <div style={armrestRightStyle} />
            </div>
        </div>
    );
});


// --- Table Group (With Enhanced Highlight) ---
const FixedTableGroup = memo(({ x, y, radius, numberOfChairs, label, isHighlighted, isSelected }) => {
    const chairSize = { width: 40, height: 42 };
    const placementRadius = radius + 28;
    const containerSize = (placementRadius + chairSize.height) * 2;
    const containerStyle = {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        userSelect: "none",
    };
    const tableGuideStyle = {
        ...liquidGlassBaseStyle,
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "sans-serif",
        textShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
        transition: 'all 0.15s ease-out',
        boxShadow: isSelected 
            ? '0 0 45px 12px rgba(29, 78, 216, 0.7)'
            : isHighlighted 
            ? '0 0 40px 15px rgba(255, 255, 255, 0.85)'
            : liquidGlassBaseStyle.boxShadow,
        transform: isHighlighted 
            ? 'translate(-50%, -50%) scale(1.15)'
            : 'translate(-50%, -50%) scale(1)',
    };

    const labelStyle = {
        fontSize: "2rem",
        fontWeight: "bold",
        lineHeight: 1,
    };

    const capacityStyle = {
        fontSize: "0.9rem",
        fontWeight: "normal",
        marginTop: "4px",
    };

    const chairs = Array.from({ length: numberOfChairs }, (_, i) => {
        const angleRad = (i / numberOfChairs) * 2 * Math.PI;
        const angleDeg = angleRad * (180 / Math.PI);
        const chairX = placementRadius * Math.cos(angleRad);
        const chairY = placementRadius * Math.sin(angleRad);
        const rotation = angleDeg + 90;
        const chairStyle = {
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${chairX}px, ${chairY}px)`,
        };
        return (
            <div key={i} style={chairStyle}>
                <ChairDisplayForTable rotation={rotation} />
            </div>
        );
    });

    return (
        <div style={containerStyle}>
            <div style={tableGuideStyle}>
                <div style={labelStyle}>{label}</div>
                <div style={capacityStyle}>({numberOfChairs}/{numberOfChairs})</div>
            </div>
            {chairs}
        </div>
    );
});


// --- Fixed Chair ---
const FixedChair = memo(({ x, y, width, height, rotation }) => {
    const containerStyle = {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        userSelect: "none",
    };
    return (
        <div style={containerStyle}>
            {/* isSelected is not needed here */}
            <ChairDisplayForTable rotation={0} /> 
        </div>
    );
});

// --- Data Exports ---
export const tableData = [
    { id: 1, x: 575, y: 176, radius: 50, chairs: 10 },    // A
    { id: 2, x: 825, y: 175, radius: 50, chairs: 10 },    // H
    { id: 3, x: 1077, y: 174, radius: 50, chairs: 10 },   // I
    { id: 4, x: 1328, y: 172, radius: 50, chairs: 10 },   // P
    { id: 5, x: 1583, y: 172, radius: 50, chairs: 10 },   // Q
    { id: 6, x: 455, y: 378, radius: 50, chairs: 10 },    // B
    { id: 7, x: 705, y: 377, radius: 50, chairs: 10 },    // G
    { id: 8, x: 955, y: 376, radius: 50, chairs: 10 },    // J
    { id: 9, x: 1208, y: 376, radius: 50, chairs: 10 },   // O
    { id: 10, x: 1462, y: 374, radius: 50, chairs: 10 },  // R
    { id: 11, x: 1717, y: 374, radius: 50, chairs: 10 },  // U
    { id: 12, x: 574, y: 579, radius: 50, chairs: 10 },   // C
    { id: 13, x: 824, y: 577, radius: 50, chairs: 10 },   // F
    { id: 14, x: 1078, y: 577, radius: 50, chairs: 10 },  // K
    { id: 15, x: 1329, y: 578, radius: 50, chairs: 10 },  // N
    { id: 16, x: 1584, y: 577, radius: 50, chairs: 10 },  // S
    { id: 17, x: 455, y: 786, radius: 50, chairs: 10 },   // D
    { id: 18, x: 705, y: 798, radius: 50, chairs: 10 },   // E
    { id: 19, x: 1005, y: 800, radius: 50, chairs: 10 },  // L
    { id: 20, x: 1256, y: 802, radius: 50, chairs: 10 },  // M
    { id: 21, x: 1510, y: 800, radius: 50, chairs: 10 },  // T
];

export const tableLabels = [
    'A', 'H', 'I', 'P', 'Q',
    'B', 'G', 'J', 'O', 'R', 'U',
    'C', 'F', 'K', 'N', 'S',
    'D', 'E', 'L', 'M', 'T'
];

export const newChairsData = Array.from({ length: 5 }, (_, i) => ({
    id: `c${i + 1}`,
    x: 138 + i * 55,
    y: 937,
    w: 45,
    h: 47,
    r: 180,
}));

export const pillData = [
    { id: 1, x: 47, y: 191, w: 144, h: 57, r: 13 },
    { id: 2, x: 32, y: 809, w: 144, h: 57, r: -16 },
    { id: 3, x: 1742, y: 178, w: 102, h: 57, r: 149 },
    { id: 4, x: 1722, y: 810, w: 102, h: 57, r: -141 },
    { id: 5, x: 800, y: 804, w: 102, h: 68, r: -38 },
];


// --- Main Component ---
const EventSeatPlan = memo(({ highlightedTable, selectedTable }) => {
    
    const selectedTableInfo = useMemo(() => {
        if (!selectedTable) return null;
        const index = tableLabels.indexOf(selectedTable);
        if (index === -1) return null;
        return tableData[index];
    }, [selectedTable]);

    const viewStyle = useMemo(() => {
        const PLAN_WIDTH = 1920;
        const PLAN_HEIGHT = 1080; 

        const baseStyle = {
            width: `${PLAN_WIDTH}px`,
            height: `${PLAN_HEIGHT}px`,
            backgroundColor: "transparent",
            position: "relative",
            transformOrigin: 'center center',
            transition: 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)',
        };

        if (selectedTableInfo) {
            const scale = 2.0;
            const x = -(selectedTableInfo.x - (PLAN_WIDTH / 2));
            const y = -(selectedTableInfo.y - (PLAN_HEIGHT / 2));
            return {
                ...baseStyle,
                transform: `scale(${scale}) translate(${x}px, ${y}px)`
            };
        }
        
        const initialScale = Math.min(window.innerWidth / PLAN_WIDTH, window.innerHeight / PLAN_HEIGHT) * 0.9;
        return { ...baseStyle, transform: `scale(${initialScale})` };

    }, [selectedTableInfo]);


    return (
        <div style={viewStyle}>
            <FixedStage />
            <FixedPodium />
            {tableData.map((table, index) => (
                <FixedTableGroup
                    key={table.id}
                    x={table.x}
                    y={table.y}
                    radius={table.radius}
                    numberOfChairs={table.chairs}
                    label={tableLabels[index]}
                    isHighlighted={highlightedTable === tableLabels[index]}
                    isSelected={selectedTable === tableLabels[index]}
                />
            ))}
            {newChairsData.map((chair) => (
                <FixedChair
                    key={chair.id}
                    x={chair.x}
                    y={chair.y}
                    width={chair.w}
                    height={chair.h}
                    rotation={chair.r}
                />
            ))}
            {pillData.map((p) => (
                <FixedPill
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    rotation={p.r}
                />
            ))}
        </div>
    );
});

export default EventSeatPlan;