import React, { useState, useMemo } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const FunnelVisualizer = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredFlow, setHoveredFlow] = useState(null);

  // Sample data structure: tactics, budget, conversions over time
  const data = useMemo(() => ({
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    stages: ['Awareness + Interest', 'Consideration + Conversion'],
    tactics: [
      { name: 'Paid Search', color: '#3b82f6', budget: [15000, 18000, 20000, 22000, 25000, 28000] },
      { name: 'Social Media', color: '#8b5cf6', budget: [12000, 13000, 15000, 16000, 18000, 20000] },
      { name: 'Content Marketing', color: '#10b981', budget: [8000, 9000, 10000, 11000, 12000, 13000] },
      { name: 'Email', color: '#f59e0b', budget: [5000, 5500, 6000, 6500, 7000, 7500] },
      { name: 'Display Ads', color: '#ef4444', budget: [10000, 11000, 12000, 13000, 14000, 15000] }
    ],
    flows: {
      0: { // January
        'Paid Search': [14000, 1500],
        'Social Media': [11000, 1100],
        'Content Marketing': [8500, 980],
        'Email': [4500, 750],
        'Display Ads': [9000, 600]
      },
      1: { // February
        'Paid Search': [17000, 1880],
        'Social Media': [12500, 1290],
        'Content Marketing': [9300, 1100],
        'Email': [5200, 870],
        'Display Ads': [10400, 720]
      },
      2: { // March
        'Paid Search': [20000, 2250],
        'Social Media': [14000, 1480],
        'Content Marketing': [10000, 1220],
        'Email': [6000, 990],
        'Display Ads': [11800, 840]
      },
      3: { // April
        'Paid Search': [23000, 2620],
        'Social Media': [15500, 1670],
        'Content Marketing': [10700, 1340],
        'Email': [6700, 1110],
        'Display Ads': [13200, 960]
      },
      4: { // May
        'Paid Search': [26000, 3000],
        'Social Media': [17000, 1860],
        'Content Marketing': [11500, 1460],
        'Email': [7500, 1230],
        'Display Ads': [14600, 1080]
      },
      5: { // June
        'Paid Search': [29000, 3380],
        'Social Media': [18500, 2050],
        'Content Marketing': [12300, 1580],
        'Email': [8300, 1350],
        'Display Ads': [16000, 1200]
      }
    }
  }), []);

  // Auto-play functionality
  React.useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedMonth(prev => (prev + 1) % data.months.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data.months.length]);

  const currentFlows = data.flows[selectedMonth];
  const totalBudget = data.tactics.reduce((sum, t) => sum + t.budget[selectedMonth], 0);

  // Calculate stage totals
  const stageTotals = useMemo(() => {
    return data.stages.map((_, stageIdx) => {
      return data.tactics.reduce((sum, tactic) => {
        return sum + (currentFlows[tactic.name]?.[stageIdx] || 0);
      }, 0);
    });
  }, [selectedMonth, data.stages, data.tactics, currentFlows]);

  // Drawing parameters
  const width = 900;
  const height = 550;
  const stageWidth = 180;
  const stageSpacing = (width - stageWidth * data.stages.length) / (data.stages.length + 1);
  const leftMargin = 80;

  const getStageX = (idx) => leftMargin + stageSpacing + idx * (stageWidth + stageSpacing);

  const renderFlow = (tactic, tacticIdx) => {
    const flows = currentFlows[tactic.name];
    if (!flows) return null;

    const paths = [];
    const x1 = getStageX(0) + stageWidth;
    const x2 = getStageX(1);
    
    // Calculate y positions based on stacking
    let y1Start = 100;
    let y2Start = 100;
    
    // Stack based on previous tactics
    for (let t = 0; t < tacticIdx; t++) {
      const prevFlows = currentFlows[data.tactics[t].name];
      if (prevFlows) {
        y1Start += (prevFlows[0] / stageTotals[0]) * 350;
        y2Start += (prevFlows[1] / stageTotals[1]) * 350;
      }
    }

    const height1 = (flows[0] / stageTotals[0]) * 350;
    const height2 = (flows[1] / stageTotals[1]) * 350;

    const path = `
      M ${x1} ${y1Start}
      C ${x1 + 80} ${y1Start}, ${x2 - 80} ${y2Start}, ${x2} ${y2Start}
      L ${x2} ${y2Start + height2}
      C ${x2 - 80} ${y2Start + height2}, ${x1 + 80} ${y1Start + height1}, ${x1} ${y1Start + height1}
      Z
    `;

    const flowKey = `${tactic.name}-0`;
    const isHovered = hoveredFlow === flowKey;

    paths.push(
      <path
        key={flowKey}
        d={path}
        fill={tactic.color}
        opacity={isHovered ? 0.9 : 0.6}
        stroke={isHovered ? tactic.color : 'none'}
        strokeWidth={isHovered ? 2 : 0}
        onMouseEnter={() => setHoveredFlow(flowKey)}
        onMouseLeave={() => setHoveredFlow(null)}
        style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
      />
    );

    return paths;
  };

  return (
    <div className="w-full h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Marketing Funnel: Tactics × Budget × Time
          </h1>
          <p className="text-gray-600">
            Flow width represents user volume. Hover over flows for details.
          </p>
        </div>

        {/* Time Controls */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => {
                  setSelectedMonth(0);
                  setIsPlaying(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {data.months[selectedMonth]} - ${(totalBudget / 1000).toFixed(0)}k Budget
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={data.months.length - 1}
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(selectedMonth / (data.months.length - 1)) * 100}%, #e5e7eb ${(selectedMonth / (data.months.length - 1)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between mt-2">
              {data.months.map((month, idx) => (
                <span
                  key={month}
                  className={`text-sm ${idx === selectedMonth ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="mb-6 overflow-x-auto">
          <svg width={width} height={height} className="mx-auto">
            {/* Stage boxes */}
            {data.stages.map((stage, idx) => {
              const x = getStageX(idx);
              const total = stageTotals[idx];
              
              return (
                <g key={stage}>
                  <rect
                    x={x}
                    y={80}
                    width={stageWidth}
                    height={370}
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    strokeWidth={2}
                    rx={8}
                  />
                  <text
                    x={x + stageWidth / 2}
                    y={60}
                    textAnchor="middle"
                    className="font-bold text-lg"
                    fill="#374151"
                  >
                    {stage}
                  </text>
                  <text
                    x={x + stageWidth / 2}
                    y={470}
                    textAnchor="middle"
                    className="font-semibold"
                    fill="#6b7280"
                  >
                    {(total / 1000).toFixed(1)}k
                  </text>
                  {idx > 0 && (
                    <text
                      x={x + stageWidth / 2}
                      y={490}
                      textAnchor="middle"
                      className="text-sm"
                      fill="#9ca3af"
                    >
                      {((total / stageTotals[idx - 1]) * 100).toFixed(1)}% conv
                    </text>
                  )}
                </g>
              );
            })}

            {/* Flow paths */}
            {data.tactics.map((tactic, idx) => renderFlow(tactic, idx))}
          </svg>
        </div>

        {/* Legend & Budget Breakdown */}
        <div className="grid grid-cols-2 gap-6">
          {/* Tactics Legend */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Tactics</h3>
            <div className="space-y-2">
              {data.tactics.map(tactic => (
                <div key={tactic.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: tactic.color }}
                    />
                    <span className="text-sm text-gray-700">{tactic.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    ${(tactic.budget[selectedMonth] / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Performance Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Conversions:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {stageTotals[1].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overall Conv Rate:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {((stageTotals[1] / stageTotals[0]) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost per Conversion:</span>
                <span className="text-sm font-semibold text-gray-800">
                  ${(totalBudget / stageTotals[1]).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Budget:</span>
                <span className="text-sm font-semibold text-gray-800">
                  ${totalBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredFlow && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>{hoveredFlow.split('-')[0]}</strong> - Converting from{' '}
              {data.stages[0]} to {data.stages[1]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelVisualizer;
