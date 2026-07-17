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
  completed: {
    label: "Completed",
    color: "hsl(142 71% 45%)",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(0 84% 60%)",
  },
  today: {
    label: "Due today",
    color: "hsl(38 92% 50%)",
  },
  week: {
    label: "This week",
    color: "hsl(262 83% 58%)",
  },
  later: {
    label: "Later",
    color: "hsl(221 83% 53%)",
  },
  none: {
    label: "No deadline",
    color: "hsl(215 16% 47%)",
  },
};

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseDateOnly(value) {
  if (!value) return null;

  const dateString = String(value).slice(0, 10);
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function isCompletedStatus(status) {
  return status === "Done" || status === "completed" || status === "Completed";
}

function getDeadlineCounts(tasks = []) {
  const today = getStartOfToday();

  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  return tasks.reduce(
    (acc, task) => {
      if (isCompletedStatus(task.status || task.rawStatus)) {
        acc.completed += 1;
        return acc;
      }

      const deadline = parseDateOnly(task.target || task.dueDate);

      if (!deadline) {
        acc.none += 1;
        return acc;
      }

      if (deadline < today) {
        acc.overdue += 1;
      } else if (deadline.getTime() === today.getTime()) {
        acc.today += 1;
      } else if (deadline <= weekEnd) {
        acc.week += 1;
      } else {
        acc.later += 1;
      }

      return acc;
    },
    {
      completed: 0,
      overdue: 0,
      today: 0,
      week: 0,
      later: 0,
      none: 0,
    },
  );
}

export function DeadlineChart({ tasks = [] }) {
  const deadlineCounts = React.useMemo(() => getDeadlineCounts(tasks), [tasks]);

  const totalTasks =
    deadlineCounts.completed +
    deadlineCounts.overdue +
    deadlineCounts.today +
    deadlineCounts.week +
    deadlineCounts.later +
    deadlineCounts.none;

  const chartData = React.useMemo(
    () => [
      {
        bucket: "Completed",
        count: deadlineCounts.completed,
        fill: "var(--color-completed)",
      },
      {
        bucket: "Overdue",
        count: deadlineCounts.overdue,
        fill: "var(--color-overdue)",
      },
      {
        bucket: "Due today",
        count: deadlineCounts.today,
        fill: "var(--color-today)",
      },
      {
        bucket: "This week",
        count: deadlineCounts.week,
        fill: "var(--color-week)",
      },
      {
        bucket: "Later",
        count: deadlineCounts.later,
        fill: "var(--color-later)",
      },
      {
        bucket: "No deadline",
        count: deadlineCounts.none,
        fill: "var(--color-none)",
      },
    ],
    [deadlineCounts],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deadline overview</CardTitle>
        <CardDescription>
          Deadline pressure across active and completed tasks
        </CardDescription>
      </CardHeader>

      <CardContent>
        {totalTasks === 0 ? (
          <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
            No deadline data available.
          </div>
        ) : (
          <div>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  top: 8,
                  right: 20,
                  left: 8,
                  bottom: 8,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />

                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  className="text-xs"
                />

                <YAxis
                  dataKey="bucket"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={86}
                  className="text-xs"
                />

                <ChartTooltip
                  cursor={{
                    fill: "hsl(var(--muted) / 0.35)",
                  }}
                  content={<ChartTooltipContent hideLabel nameKey="bucket" />}
                />

                <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={28}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.bucket}
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
