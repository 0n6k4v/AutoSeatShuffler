// /src/Storage/EventSeatData.js

// Use named exports for better tree-shaking and maintainability
export const eventSeatData = Object.freeze([
    { id: 1, x: 47, y: 191, w: 144, h: 57, r: 13 },
    { id: 2, x: 32, y: 809, w: 144, h: 57, r: -16 },
    { id: 3, x: 1742, y: 178, w: 102, h: 57, r: 149 },
    { id: 4, x: 1722, y: 810, w: 102, h: 57, r: -141 },
    { id: 5, x: 800, y: 804, w: 102, h: 68, r: -38 },
]);

export const tableData = Object.freeze([
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
    { id: 12, x: 574, y: 579, radius: 50, chairs: 10 },   // C
    { id: 13, x: 824, y: 577, radius: 50, chairs: 10 },   // F
    { id: 14, x: 1078, y: 577, radius: 50, chairs: 10 },  // K
    { id: 15, x: 1329, y: 578, radius: 50, chairs: 10 },  // N
    { id: 16, x: 1584, y: 577, radius: 50, chairs: 10 },  // S
    { id: 17, x: 455, y: 786, radius: 50, chairs: 10 },   // D
    { id: 18, x: 705, y: 798, radius: 50, chairs: 10 },   // E
    { id: 19, x: 1005, y: 800, radius: 50, chairs: 10 },  // L
    { id: 20, x: 1256, y: 802, radius: 50, chairs: 10 },  // M
]);

export const tableLabels = Object.freeze([
    'A', 'H', 'I', 'P', 'Q',
    'B', 'G', 'J', 'O', 'R',
    'C', 'F', 'K', 'N', 'S',
    'D', 'E', 'L', 'M'
]);

export const newChairsData = Object.freeze(
    Array.from({ length: 5 }, (_, i) => ({
        id: `c${i + 1}`,
        x: 138 + i * 55,
        y: 937,
        w: 45,
        h: 47,
        r: 180,
    }))
);

export const initialSeats = Object.freeze([
    9,  // A
    9,  // H
    9,  // I
    10, // P
    10, // Q
    9,  // B
    9,  // G
    9,  // J
    9,  // O
    10, // R
    9,  // C
    9,  // F
    9,  // K
    10, // N
    10, // S
    10, // D
    10, // E
    10, // L
    10  // M
]);