import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CheckCircle2, Clock, ListTodo, UserX } from "lucide-react";

export function SectionCards({ data = [] }) {
  const totalTasks = data.length;

  const completedTasks = data.filter((task) => task.status === "Done").length;

  const inProcessTasks = data.filter(
    (task) => task.status === "In Process",
  ).length;

  const unassignedTasks = data.filter(
    (task) => task.reviewer === "Assign reviewer",
  ).length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tasks</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTasks}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <ListTodo className="size-4" />
              Workspace
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All assigned and created tasks
          </div>

          <div className="text-muted-foreground">
            Total tasks currently in your dashboard
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Tasks</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completedTasks}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <CheckCircle2 className="size-4" />
              {completionRate}%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Completion progress
            <CheckCircle2 className="size-4" />
          </div>

          <div className="text-muted-foreground">
            Tasks marked as done by the team
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>In Process</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {inProcessTasks}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <Clock className="size-4" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Work currently active
            <Clock className="size-4" />
          </div>

          <div className="text-muted-foreground">
            Tasks that need progress updates
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unassigned Tasks</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {unassignedTasks}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <UserX className="size-4" />
              Needs owner
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reviewer/member missing
            <UserX className="size-4" />
          </div>

          <div className="text-muted-foreground">
            Assign these tasks to team members
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
