import React, { useState, useMemo } from 'react';

const FunnelVisualizer = () => {
  const [hoveredFlow, setHoveredFlow] = useState(null);
  const [selectedTactic, setSelectedTactic] = useState(null);

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

  // Calculate stage totals for each month
  const allStageTotals = useMemo(() => {
    return data.months.map((_, monthIdx) => {
      const monthFlows = data.flows[monthIdx];
      return data.stages.map((_, stageIdx) => {
        return data.tactics.reduce((sum, tactic) => {
          return sum + (monthFlows[tactic.name]?.[stageIdx] || 0);
        }, 0);
      });
    });
  }, [data]);

  // Drawing parameters
  const width = 1200;
  const height = 700;
  const monthWidth = 180;
  const stageHeight = 120;
  const topMargin = 80;
  const leftMargin = 200;

  const getMonthX = (idx) => leftMargin + idx * monthWidth;
  const getStageY = (idx) => topMargin + idx * (stageHeight + 80);

  const renderFlowsForMonth = (monthIdx) => {
    const monthFlows = data.flows[monthIdx];
    const stageTotals = allStageTotals[monthIdx];
    const x = getMonthX(monthIdx);

    return data.tactics.map((tactic, tacticIdx) => {
      const flows = monthFlows[tactic.name];
      if (!flows) return null;

      const y1 = getStageY(0);
      const y2 = getStageY(1);

      // Calculate horizontal positions based on stacking
      let x1Start = x;
      let x2Start = x;

      for (let t = 0; t < tacticIdx; t++) {
        const prevFlows = monthFlows[data.tactics[t].name];
        if (prevFlows) {
          x1Start += (prevFlows[0] / stageTotals[0]) * (monthWidth - 20);
          x2Start += (prevFlows[1] / stageTotals[1]) * (monthWidth - 20);
        }
      }

      const width1 = (flows[0] / stageTotals[0]) * (monthWidth - 20);
      const width2 = (flows[1] / stageTotals[1]) * (monthWidth - 20);

      const path = `
        M ${x1Start} ${y1 + stageHeight}
        L ${x1Start + width1} ${y1 + stageHeight}
        C ${x1Start + width1} ${y1 + stageHeight + 40}, ${x2Start + width2} ${y2 - 40}, ${x2Start + width2} ${y2}
        L ${x2Start} ${y2}
        C ${x2Start} ${y2 - 40}, ${x1Start} ${y1 + stageHeight + 40}, ${x1Start} ${y1 + stageHeight}
        Z
      `;

      const flowKey = `${tactic.name}-${monthIdx}`;
      const isHovered = hoveredFlow === flowKey;
      const isSelected = selectedTactic === tactic.name;
      const isDimmed = selectedTactic && selectedTactic !== tactic.name;

      return (
        <path
          key={flowKey}
          d={path}
          fill={tactic.color}
          opacity={isDimmed ? 0.15 : (isHovered || isSelected ? 0.9 : 0.6)}
          stroke={isHovered || isSelected ? tactic.color : 'none'}
          strokeWidth={isHovered || isSelected ? 2 : 0}
          onMouseEnter={() => setHoveredFlow(flowKey)}
          onMouseLeave={() => setHoveredFlow(null)}
          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
        />
      );
    });
  };

  const renderStageBox = (stageIdx, monthIdx) => {
    const x = getMonthX(monthIdx);
    const y = getStageY(stageIdx);
    const stageTotals = allStageTotals[monthIdx];
    const total = stageTotals[stageIdx];

    return (
      <g key={`stage-${stageIdx}-${monthIdx}`}>
        <rect
          x={x}
          y={y}
          width={monthWidth - 20}
          height={stageHeight}
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth={2}
          rx={6}
        />
        <text
          x={x + (monthWidth - 20) / 2}
          y={y + stageHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-semibold"
          fill="#374151"
        >
          {(total / 1000).toFixed(1)}k
        </text>
        {stageIdx === 1 && (
          <text
            x={x + (monthWidth - 20) / 2}
            y={y + stageHeight / 2 + 20}
            textAnchor="middle"
            className="text-xs"
            fill="#9ca3af"
          >
            {((total / stageTotals[0]) * 100).toFixed(1)}%
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Marketing Funnel: Time × Tactics × Budget
          </h1>
          <p className="text-gray-600">
            Time flows left to right. Click tactics to highlight. Hover for details.
          </p>
        </div>

        {/* Main Visualization */}
        <div className="mb-6 overflow-x-auto">
          <svg width={width} height={height} className="mx-auto">
            {/* Stage labels on the left */}
            {data.stages.map((stage, idx) => (
              <g key={`label-${idx}`}>
                <text
                  x={20}
                  y={getStageY(idx) + stageHeight / 2}
                  textAnchor="start"
                  dominantBaseline="middle"
                  className="font-bold text-base"
                  fill="#374151"
                >
                  {stage}
                </text>
              </g>
            ))}

            {/* Month labels at top */}
            {data.months.map((month, idx) => {
              const totalBudget = data.tactics.reduce((sum, t) => sum + t.budget[idx], 0);
              return (
                <g key={`month-${idx}`}>
                  <text
                    x={getMonthX(idx) + (monthWidth - 20) / 2}
                    y={40}
                    textAnchor="middle"
                    className="font-bold text-base"
                    fill="#374151"
                  >
                    {month}
                  </text>
                  <text
                    x={getMonthX(idx) + (monthWidth - 20) / 2}
                    y={60}
                    textAnchor="middle"
                    className="text-sm"
                    fill="#6b7280"
                  >
                    ${(totalBudget / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* Render all stage boxes */}
            {data.months.map((_, monthIdx) => 
              data.stages.map((_, stageIdx) => renderStageBox(stageIdx, monthIdx))
            )}

            {/* Render all flows */}
            {data.months.map((_, monthIdx) => renderFlowsForMonth(monthIdx))}
          </svg>
        </div>

        {/* Legend & Controls */}
        <div className="grid grid-cols-2 gap-6">
          {/* Tactics Legend */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Tactics (Click to Highlight)</h3>
            <div className="space-y-2">
              {data.tactics.map(tactic => {
                const totalBudget = tactic.budget.reduce((a, b) => a + b, 0);
                const isSelected = selectedTactic === tactic.name;
                return (
                  <div
                    key={tactic.name}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition ${
                      isSelected ? 'bg-gray-200 shadow' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedTactic(isSelected ? null : tactic.name)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: tactic.color }}
                      />
                      <span className="text-sm text-gray-700 font-medium">{tactic.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${(totalBudget / 1000).toFixed(0)}k total
                    </span>
                  </div>
                );
              })}
            </div>
            {selectedTactic && (
              <button
                onClick={() => setSelectedTactic(null)}
                className="mt-3 w-full px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">6-Month Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Budget:</span>
                <span className="text-sm font-semibold text-gray-800">
                  ${(data.tactics.reduce((sum, t) => sum + t.budget.reduce((a, b) => a + b, 0), 0) / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Conversions:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {allStageTotals.reduce((sum, totals) => sum + totals[1], 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Conv Rate:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {(allStageTotals.reduce((sum, totals, idx) => sum + (totals[1] / totals[0]), 0) / data.months.length * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Cost per Conv:</span>
                <span className="text-sm font-semibold text-gray-800">
                  ${(
                    data.tactics.reduce((sum, t) => sum + t.budget.reduce((a, b) => a + b, 0), 0) /
                    allStageTotals.reduce((sum, totals) => sum + totals[1], 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-300">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Monthly Trend</h4>
              <div className="space-y-1">
                {data.months.map((month, idx) => {
                  const convRate = (allStageTotals[idx][1] / allStageTotals[idx][0]) * 100;
                  return (
                    <div key={month} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-8">{month}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(convRate / 15) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {convRate.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredFlow && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>{hoveredFlow.split('-')[0]}</strong> in{' '}
              <strong>{data.months[parseInt(hoveredFlow.split('-')[1])]}</strong>
              {' '}converting from {data.stages[0]} to {data.stages[1]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelVisualizer;
