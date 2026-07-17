"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Tasks",
  },
  low: {
    label: "Low",
    color: "hsl(221 83% 53%)",
  },
  medium: {
    label: "Medium",
    color: "hsl(262 83% 58%)",
  },
  high: {
    label: "High",
    color: "hsl(0 84% 60%)",
  },
};

function normalizePriority(priority) {
  const value = String(priority || "").toLowerCase();

  if (value === "high") return "high";
  if (value === "medium") return "medium";
  if (value === "low") return "low";

  return "medium";
}

function getPriorityCounts(tasks = []) {
  return tasks.reduce(
    (acc, task) => {
      const priority = normalizePriority(task.limit || task.priority);

      acc[priority] += 1;

      return acc;
    },
    {
      low: 0,
      medium: 0,
      high: 0,
    },
  );
}

export function PriorityChart({ tasks = [] }) {
  const priorityCounts = React.useMemo(() => getPriorityCounts(tasks), [tasks]);

  const totalTasks =
    priorityCounts.low + priorityCounts.medium + priorityCounts.high;

  const chartData = React.useMemo(
    () => [
      {
        priority: "Low",
        count: priorityCounts.low,
        fill: "var(--color-low)",
      },
      {
        priority: "Medium",
        count: priorityCounts.medium,
        fill: "var(--color-medium)",
      },
      {
        priority: "High",
        count: priorityCounts.high,
        fill: "var(--color-high)",
      },
    ],
    [priorityCounts],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority distribution</CardTitle>
        <CardDescription>Breakdown of tasks by urgency level</CardDescription>
      </CardHeader>

      <CardContent>
        {totalTasks === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            No priority data available.
          </div>
        ) : (
          <div>
            <ChartContainer config={chartConfig} className="h-65 w-full">
              <BarChart
                data={chartData}
                margin={{
                  top: 16,
                  right: 8,
                  left: 0,
                  bottom: 8,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />

                <XAxis
                  dataKey="priority"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs"
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={28}
                  allowDecimals={false}
                  className="text-xs"
                />

                <ChartTooltip
                  cursor={{
                    fill: "hsl(var(--muted) / 0.35)",
                  }}
                  content={<ChartTooltipContent hideLabel nameKey="priority" />}
                />

                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={54}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.priority}
                      fill={entry.fill}
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
