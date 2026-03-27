import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// Approximate relative coordinates for UK cities (0-100%)
const offices = [
  { id: 'edinburgh', name: 'Edinburgh', x: 44, y: 24, retention: 78 },
  { id: 'newcastle', name: 'Newcastle', x: 52, y: 34, retention: 82 },
  { id: 'leeds', name: 'Leeds', x: 54, y: 48, retention: 75 },
  { id: 'manchester', name: 'Manchester', x: 46, y: 52, retention: 79 },
  { id: 'birmingham', name: 'Birmingham', x: 52, y: 65, retention: 72 },
  { id: 'london', name: 'London', x: 66, y: 78, retention: 65 },
];

const flows = [
  { source: 'newcastle', target: 'london', count: 15, reason: 'Higher salary offered in London office', type: 'loss' },
  { source: 'newcastle', target: 'manchester', count: 8, reason: 'Relocation closer to family', type: 'loss' },
  { source: 'newcastle', target: 'edinburgh', count: 5, reason: 'Better project alignment', type: 'loss' },
  { source: 'newcastle', target: 'birmingham', count: 4, reason: 'Promotion opportunity', type: 'loss' },
  { source: 'newcastle', target: 'leeds', count: 3, reason: 'Change in technology stack', type: 'loss' },
  { source: 'newcastle', target: 'newcastle', count: 120, reason: 'Strong local culture and career progression', type: 'retained' },
  { source: 'london', target: 'newcastle', count: 4, reason: 'Lower cost of living', type: 'gain' },
  { source: 'manchester', target: 'leeds', count: 2, reason: 'Shorter commute', type: 'transfer' },
  { source: 'london', target: 'london', count: 300, reason: 'Established network and opportunities', type: 'retained' },
  { source: 'manchester', target: 'manchester', count: 150, reason: 'Growing tech hub', type: 'retained' },
  { source: 'edinburgh', target: 'edinburgh', count: 80, reason: 'Quality of life', type: 'retained' },
  { source: 'leeds', target: 'leeds', count: 60, reason: 'Local community', type: 'retained' },
  { source: 'birmingham', target: 'birmingham', count: 90, reason: 'Central location', type: 'retained' },
];

export function GeographicFlowMap() {
  const [hoveredFlow, setHoveredFlow] = useState<typeof flows[0] | null>(null);
  const [hoveredOffice, setHoveredOffice] = useState<typeof offices[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!containerRef.current) return { left: mousePos.x, top: mousePos.y };
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Determine if we are in the right half or bottom half of the container
    const isRightHalf = mousePos.x > rect.width / 2;
    const isBottomHalf = mousePos.y > rect.height / 2;
    
    return { 
      left: mousePos.x, 
      top: mousePos.y,
      transform: `translate(${isRightHalf ? 'calc(-100% - 15px)' : '15px'}, ${isBottomHalf ? 'calc(-100% - 15px)' : '15px'})`
    };
  };

  return (
    <Card className="w-full h-[800px] flex flex-col bg-[#050505] border-white/10 overflow-hidden relative">
      <CardHeader className="z-10 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pb-4 absolute top-0 left-0 right-0">
        <CardTitle>UK Office Mobility & Retention</CardTitle>
        <CardDescription>
          Geographic flow of employees between Accenture UK offices. 
          Hover over lines to see transfer reasons, and nodes for retention rates.
        </CardDescription>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Loss</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Retained</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Gain</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Transfer</div>
        </div>
      </CardHeader>
      <CardContent ref={containerRef} className="flex-1 relative p-0 mt-24" onMouseMove={handleMouseMove}>
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="uk-3d-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* 3D Base/Extrusion */}
          <g filter="url(#uk-3d-shadow)">
            <path 
              d="M 35 5 L 45 5 L 52 15 L 48 22 L 50 25 L 55 32 L 65 48 L 78 62 L 75 78 L 68 85 L 55 85 L 35 92 L 22 96 L 20 88 L 35 82 L 38 78 L 25 72 L 28 60 L 40 55 L 38 40 L 32 32 L 35 25 L 28 18 L 25 10 Z" 
              fill="#1a1a1a" 
              transform="translate(1, 1.5)"
            />
            <path 
              d="M 15 35 L 22 35 L 25 42 L 20 48 L 12 45 Z" 
              fill="#1a1a1a" 
              transform="translate(1, 1.5)"
            />
          </g>

          {/* Abstract UK Map Outline (Top Surface) */}
          <path 
            d="M 35 5 L 45 5 L 52 15 L 48 22 L 50 25 L 55 32 L 65 48 L 78 62 L 75 78 L 68 85 L 55 85 L 35 92 L 22 96 L 20 88 L 35 82 L 38 78 L 25 72 L 28 60 L 40 55 L 38 40 L 32 32 L 35 25 L 28 18 L 25 10 Z" 
            fill="#0a0a0a" 
            stroke="rgba(255, 255, 255, 0.8)" 
            strokeWidth="0.6" 
          />
          {/* Northern Ireland (Top Surface) */}
          <path 
            d="M 15 35 L 22 35 L 25 42 L 20 48 L 12 45 Z" 
            fill="#0a0a0a" 
            stroke="rgba(255, 255, 255, 0.8)" 
            strokeWidth="0.6" 
          />

          {/* Draw flows */}
          {flows.map((flow, idx) => {
            const source = offices.find(o => o.id === flow.source);
            const target = offices.find(o => o.id === flow.target);
            if (!source || !target) return null;

            const isSelf = source.id === target.id;
            const isHovered = hoveredFlow === flow;
            const isFaded = hoveredFlow && hoveredFlow !== flow;

            if (isSelf) {
              // Calculate loop size and speed based on volume
              const loopRadius = Math.max(1.5, Math.min(4, Math.sqrt(flow.count) * 0.25));
              const loopDuration = Math.max(2, 20 / Math.sqrt(flow.count));

              // Draw a loop for retained employees
              return (
                <g key={`flow-${idx}`} 
                   onMouseEnter={() => setHoveredFlow(flow)}
                   onMouseLeave={() => setHoveredFlow(null)}
                   className="cursor-pointer transition-opacity duration-300"
                   style={{ opacity: isFaded ? 0.1 : 1 }}>
                  <circle
                    cx={source.x}
                    cy={source.y}
                    r={isHovered ? loopRadius * 1.3 : loopRadius}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={isHovered ? 0.6 : 0.3}
                    strokeDasharray={isHovered ? "none" : "0.5,0.5"}
                    style={{ 
                      transformOrigin: `${source.x}px ${source.y}px`,
                      animation: `spin ${isHovered ? loopDuration * 0.4 : loopDuration}s linear infinite`
                    }}
                  />
                  {/* Invisible wider circle for easier hovering */}
                  <circle
                    cx={source.x}
                    cy={source.y}
                    r={loopRadius * 1.5}
                    fill="transparent"
                    stroke="transparent"
                    strokeWidth={1.5}
                  />
                </g>
              );
            }

            // Calculate curve for the line
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.2; // Curve radius

            // Determine color based on flow type
            let strokeColor = '#888';
            if (flow.type === 'loss') strokeColor = '#ef4444';
            if (flow.type === 'gain') strokeColor = '#3b82f6';
            if (flow.type === 'transfer') strokeColor = '#a855f7';

            // Calculate dot size and speed based on volume
            const dotRadius = Math.max(0.3, Math.min(1.5, Math.sqrt(flow.count) * 0.15));
            const dotDuration = Math.max(1.5, 12 / Math.sqrt(flow.count));

            return (
              <g key={`flow-${idx}`}
                 onMouseEnter={() => setHoveredFlow(flow)}
                 onMouseLeave={() => setHoveredFlow(null)}
                 className="cursor-pointer transition-opacity duration-300"
                 style={{ opacity: isFaded ? 0.1 : 1 }}>
                <path
                  id={`path-${idx}`}
                  d={`M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 0.8 : Math.max(0.2, Math.min(0.8, flow.count * 0.02))}
                  strokeOpacity={isHovered ? 1 : 0.4}
                />
                {/* Invisible wider path for easier hovering */}
                <path
                  d={`M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={1.5}
                />
                {/* Moving dot along the path */}
                {(isHovered || !hoveredFlow) && (
                  <circle r={isHovered ? dotRadius * 1.5 : dotRadius} fill={strokeColor} opacity={isHovered ? 1 : 0.6}>
                    <animateMotion 
                      dur={`${isHovered ? dotDuration * 0.5 : dotDuration}s`} 
                      repeatCount="indefinite" 
                      path={`M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`} 
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Draw offices */}
          {offices.map((office) => {
            const isHovered = hoveredOffice?.id === office.id || hoveredFlow?.source === office.id || hoveredFlow?.target === office.id;
            
            return (
              <g key={office.id} 
                 transform={`translate(${office.x}, ${office.y})`}
                 onMouseEnter={() => {
                   setHoveredOffice(office);
                   const retainedFlow = flows.find(f => f.source === office.id && f.target === office.id);
                   if (retainedFlow) setHoveredFlow(retainedFlow);
                 }}
                 onMouseLeave={() => {
                   setHoveredOffice(null);
                   setHoveredFlow(null);
                 }}
                 className="cursor-pointer">
                <circle
                  r={isHovered ? 1 : 0.6}
                  fill={office.id === 'newcastle' ? '#A100FF' : '#1a1a1a'}
                  stroke={office.id === 'newcastle' ? '#fff' : '#888'}
                  strokeWidth={0.2}
                  className="transition-all duration-300"
                />
                <text
                  y={isHovered ? -3.5 : -2.8}
                  textAnchor="middle"
                  fill={isHovered ? "#fff" : "#aaa"}
                  fontSize={isHovered ? "2.2px" : "1.6px"}
                  fontWeight={office.id === 'newcastle' || isHovered ? "bold" : "normal"}
                  className="transition-all duration-300 drop-shadow-md pointer-events-none"
                >
                  {office.name}
                </text>
                {(isHovered || hoveredOffice?.id === office.id) && (
                  <text
                    y={isHovered ? 4 : 3.2}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="1.4px"
                    fontWeight="bold"
                    className="pointer-events-none transition-all duration-300"
                  >
                    {office.retention}% Retained
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip Overlay (Speech Bubble) */}
        {(hoveredFlow || hoveredOffice) && (
          <div 
            className="absolute z-50 pointer-events-none"
            style={getTooltipStyle()}
          >
            <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-lg shadow-2xl min-w-[320px] max-w-[450px] w-max animate-in fade-in zoom-in-95">
              {hoveredFlow ? (
              <>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold capitalize text-white">{hoveredFlow.source}</span>
                    {hoveredFlow.source !== hoveredFlow.target && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-bold capitalize text-white">{hoveredFlow.target}</span>
                      </>
                    )}
                  </div>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold ${
                    hoveredFlow.type === 'retained' ? 'bg-green-500/20 text-green-400' :
                    hoveredFlow.type === 'loss' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {hoveredFlow.count} Employees
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">
                    {hoveredFlow.type === 'retained' ? 'Retention Driver' : 'Primary Reason for Leaving'}
                  </span>
                  {hoveredFlow.reason}
                </div>
              </>
            ) : hoveredOffice ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold capitalize text-white">{hoveredOffice.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">
                    {hoveredOffice.retention}% Retained
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">
                    Office Status
                  </span>
                  General office metrics and retention.
                </div>
              </>
            ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
