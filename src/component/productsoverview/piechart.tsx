// src/Chart.js
import React, { useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import stylePieChart from '@/styles/styleProductsOverview/pieChart.module.css'

const COLORS = ["#00FF00", "#FF0000"];
const HOVER_COLORS = ["#33FF66", "#FF6666"];

interface DataEntry {
  name: string;
  value: number;
}

interface ChartProps {
  data: DataEntry[];
  title: string;
}

const Chart: React.FC<ChartProps> = ({ data, title }) => {
  const actualValue = data.find((entry) => entry.name === "Actual")?.value || 0;
  const targetValue = data.find((entry) => entry.name === "Target")?.value || 0;
  const diffValue = (targetValue - actualValue) * -1;
  const chartData =
    diffValue < 0
      ? [
        { name: "Value", value: actualValue },
        { name: "Value", value: diffValue * -1 }, // Hiển thị phần còn lại lên tới 100%
      ]
      : [
        { name: "Value", value: actualValue },
        { name: "Value", value: 0 },
      ];
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (index: any) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const getFillColor = (index: any) => {
    if (activeIndex === index) {
      return HOVER_COLORS[index % HOVER_COLORS.length];
    } else {
      return COLORS[index % COLORS.length];
    }
  };

  const valueClass = diffValue > 0 ? stylePieChart.diffPositive : stylePieChart.diffNegative;

  return (
    <div>
      <div className={stylePieChart.chartHeading}>
        <strong>{title}</strong>
      </div>
      <div className={stylePieChart.chartContent} >
        <PieChart width={250} height={250}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_, index) => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getFillColor(index)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className={stylePieChart.chartInfo}>
        <div className={stylePieChart.info}>
          <strong className={stylePieChart.strongStyle}> Target</strong>
          <div className={stylePieChart.Value}> {targetValue} </div>
        </div>
        <div className={stylePieChart.info}>
          <strong className={stylePieChart.strongStyleActual}> Actual </strong>
          <div className={stylePieChart.Value} style={{ color: "green" }}>
            {actualValue}
          </div>
        </div>
        <div className={stylePieChart.info}>
          <strong className={stylePieChart.strongStyleDiff}>Diff</strong>
          <div className={`value-diff ${valueClass}`}>{diffValue}</div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
