import React, { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const gameTypes = [
  { key: "blitz", label: "Blitz", color: "#f59e0b" },
  { key: "rapid", label: "Rápida", color: "#3b82f6" },
  { key: "classical", label: "Clássico", color: "#10b981" }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-primary border border-gold/20 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RatingEvolutionCard({ ratingHistory }) {
  const [selectedType, setSelectedType] = useState("blitz");

  const formattedData = ratingHistory.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }));

  const currentRating = ratingHistory[ratingHistory.length - 1]?.[selectedType] || 0;
  const previousRating = ratingHistory[ratingHistory.length - 2]?.[selectedType] || currentRating;
  const ratingChange = currentRating - previousRating;
  const selectedConfig = gameTypes.find(t => t.key === selectedType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card variant="gradient">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              <Card.Title as="h3" className="text-lg">Evolução do Rating</Card.Title>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold" style={{ color: selectedConfig?.color }}>
                {currentRating}
              </span>
              <span className={cn(
                "text-sm font-medium",
                ratingChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {ratingChange >= 0 ? "+" : ""}{ratingChange}
              </span>
            </div>
          </div>
        </Card.Header>
        
        <Card.Content>
          {/* Game type selector */}
          <div className="flex gap-2 mb-4">
            {gameTypes.map(type => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  selectedType === type.key
                    ? "text-surface-primary"
                    : "bg-surface-tertiary/50 text-muted-foreground hover:text-foreground"
                )}
                style={{
                  backgroundColor: selectedType === type.key ? type.color : undefined
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <YAxis
                  domain={["dataMin - 50", "dataMax + 50"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={selectedType}
                  name={selectedConfig?.label}
                  stroke={selectedConfig?.color}
                  strokeWidth={2}
                  dot={{ fill: selectedConfig?.color, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: selectedConfig?.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
