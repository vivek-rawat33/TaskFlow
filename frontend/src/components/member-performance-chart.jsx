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
  completed: {
    label: "Completed",
    color: "hsl(262 83% 58%)",
  },
};

function isCompletedStatus(status) {
  return status === "Done" || status === "completed" || status === "Completed";
}

function getMemberId(member) {
  return String(
    member?.userId?._id || member?.userId || member?._id || member?.id || "",
  );
}

function getMemberName(member) {
  return (
    member?.userId?.name ||
    member?.name ||
    member?.email ||
    member?.userId?.email ||
    "Unknown member"
  );
}

function getTaskAssigneeId(task) {
  return String(
    task?.assignedToId || task?.assignedTo?._id || task?.assignedTo || "",
  );
}

function getMemberPerformance(tasks = [], members = []) {
  const memberMap = new Map();

  members.forEach((member) => {
    const id = getMemberId(member);

    if (!id) return;

    memberMap.set(id, {
      id,
      member: getMemberName(member),
      completed: 0,
      assigned: 0,
    });
  });

  tasks.forEach((task) => {
    const assigneeId = getTaskAssigneeId(task);

    if (!assigneeId) return;

    if (!memberMap.has(assigneeId)) {
      memberMap.set(assigneeId, {
        id: assigneeId,
        member: task.reviewer || "Unknown member",
        completed: 0,
        assigned: 0,
      });
    }

    const member = memberMap.get(assigneeId);

    member.assigned += 1;

    if (isCompletedStatus(task.status || task.rawStatus)) {
      member.completed += 1;
    }
  });

  return Array.from(memberMap.values())
    .filter((member) => member.completed > 0)
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5);
}

export function MemberPerformanceChart({ tasks = [], members = [] }) {
  const chartData = React.useMemo(
    () => getMemberPerformance(tasks, members),
    [tasks, members],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top performance</CardTitle>
        <CardDescription>
          Top members by completed assigned tasks
        </CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
            No completed task data available.
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
                  dataKey="member"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  className="text-xs"
                />

                <ChartTooltip
                  cursor={{
                    fill: "hsl(var(--muted) / 0.35)",
                  }}
                  content={<ChartTooltipContent hideLabel nameKey="member" />}
                />

                <Bar
                  dataKey="completed"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={28}
                  fill="var(--color-completed)"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill="var(--color-completed)"
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
