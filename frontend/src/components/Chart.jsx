import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';

export const Chart = ({ 
  data, 
  type = 'bar', 
  title, 
  xKey, 
  yKey1, 
  yKey2,
  yKey1Label = 'Real',
  yKey2Label = 'Synthetic',
  height = 300 
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey={xKey} 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Bar 
            dataKey={yKey1} 
            fill="hsl(var(--chart-1))" 
            name={yKey1Label}
            radius={[4, 4, 0, 0]}
          />
          {yKey2 && (
            <Bar 
              dataKey={yKey2} 
              fill="hsl(var(--chart-2))" 
              name={yKey2Label}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey={xKey} 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Line 
            type="monotone" 
            dataKey={yKey1} 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            name={yKey1Label}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          {yKey2 && (
            <Line 
              type="monotone" 
              dataKey={yKey2} 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name={yKey2Label}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      );
    }

    return null;
  };

  return (
    <Card className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      <div className="chart-container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Chart;
