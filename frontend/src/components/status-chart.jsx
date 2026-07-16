"use client";

import * as React from "react";
import { Pie, PieChart, Sector } from "recharts";
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

function renderActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-200"
        style={{
          filter: `drop-shadow(0px 0px 10px ${fill})`,
        }}
      />

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 9}
        outerRadius={outerRadius + 11}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.35}
      />
    </g>
  );
}

const chartConfig = {
  todo: {
    label: "Todo",
    color: "hsl(221 83% 53%)",
  },
  inProcess: {
    label: "In Process",
    color: "hsl(262 83% 58%)",
  },
  done: {
    label: "Done",
    color: "hsl(142 71% 45%)",
  },
};

function normalizeStatus(status) {
  if (status === "Todo" || status === "pending" || status === "Not Started") {
    return "todo";
  }

  if (status === "In Process" || status === "in-progress") {
    return "inProcess";
  }

  if (status === "Done" || status === "completed") {
    return "done";
  }

  return "todo";
}

function getStatusCounts(tasks = []) {
  return tasks.reduce(
    (acc, task) => {
      const status = normalizeStatus(task.status);

      acc[status] += 1;

      return acc;
    },
    {
      todo: 0,
      inProcess: 0,
      done: 0,
    },
  );
}

export function StatusChart({ tasks = [] }) {
  const statusCounts = React.useMemo(() => getStatusCounts(tasks), [tasks]);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const totalTasks =
    statusCounts.todo + statusCounts.inProcess + statusCounts.done;

  const chartData = React.useMemo(
    () => [
      {
        status: "Todo",
        count: statusCounts.todo,
        fill: "var(--color-todo)",
      },
      {
        status: "In Process",
        count: statusCounts.inProcess,
        fill: "var(--color-inProcess)",
      },
      {
        status: "Done",
        count: statusCounts.done,
        fill: "var(--color-done)",
      },
    ],
    [statusCounts],
  );

  const filteredChartData = chartData.filter((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task status</CardTitle>
        <CardDescription>
          Current distribution of tasks by progress state
        </CardDescription>
      </CardHeader>

      <CardContent>
        {totalTasks === 0 ? (
          <div className="flex h-65 items-center justify-center text-sm text-muted-foreground">
            No tasks available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_180px] md:items-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-60"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="status" />}
                />

                <Pie
                  data={filteredChartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                  strokeWidth={4}
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3">
              {chartData.map((item) => {
                const percentage =
                  totalTasks > 0
                    ? Math.round((item.count / totalTasks) * 100)
                    : 0;

                return (
                  <div
                    key={item.status}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />

                      <span className="truncate text-sm font-medium">
                        {item.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.count}</p>
                      <p className="text-xs text-muted-foreground">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
