import React, { useState } from 'react';

interface SimpleChartProps {
    data: number[];
    height?: number;
    color?: string;
    label?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
    data,
    height = 60,
    color = '#10b981',
    label,
}) => {
    const width = 100;
    const max = Math.max(...data, 10);
    const min = 0;

    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Generate path with smooth curves using quadratic curve
    const smoothPoints = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / (max - min)) * height;
            return `${x},${y}`;
        });

    const linePath = `M${smoothPoints[0]} ` +
        smoothPoints
            .map((p, i) => {
                if (i === 0) return '';
                const [x, y] = p.split(',').map(Number);
                const [prevX, prevY] = smoothPoints[i - 1].split(',').map(Number);
                return `Q ${prevX},${prevY} ${x},${y}`;
            })
            .join(' ');

    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return (
        <div className="flex flex-col h-full justify-end relative">
            {label && (
                <div className="text-[10px] text-gray-500 mb-1 font-mono uppercase tracking-wider">
                    {label}
                </div>
            )}

            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                {/* Background Grid */}
                <defs>
                    <pattern
                        id="smallGrid"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 10 0 L 0 0 0 10"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="0.3"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />

                {/* Area + Line */}
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#grad-${color})`} />
                <path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.8"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Data Dots */}
                {smoothPoints.map((p, i) => {
                    const [x, y] = p.split(',').map(Number);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r={1.5}
                            fill={color}
                            className="cursor-pointer hover:opacity-80"
                            onMouseEnter={() => setHoverValue(data[i])}
                            onMouseLeave={() => setHoverValue(null)}
                        />
                    );
                })}
            </svg>

            {/* Tooltip */}
            {hoverValue !== null && (
                <div className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded-md -top-5 right-2 shadow-lg border border-white/10">
                    {hoverValue} ms
                </div>
            )}
        </div>
    );
};

export default SimpleChart;
