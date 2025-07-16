import React, { memo } from 'react';

/**
 * สามเหลี่ยมที่กำหนดขนาดและสี stroke ได้
 * @param {number} size - ขนาด (px)
 * @param {string} color - สี stroke
 * @param {string} fill - สี fill (default: transparent)
 * @param {number} strokeWidth - ความหนาเส้น (default: 8)
 * @param {object} style - style เพิ่มเติม
 */
const Triangle = memo(({ size = 100, color = '#FFF200', fill = 'transparent', strokeWidth = 8, style = {} }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={style}
        aria-label="Triangle"
    >
        <polygon
            points="50,0 0,100 100,100"
            fill={fill}
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
        />
    </svg>
));

export default Triangle;