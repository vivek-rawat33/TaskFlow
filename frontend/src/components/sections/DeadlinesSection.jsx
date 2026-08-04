import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamTasks, getAllUserTasks, updateTeamTask } from "@/api/taskApi";
import { getMyTeams } from "@/api/teamApi";
import { notify } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, UsersIcon, UserIcon, AlertTriangleIcon, AlertCircleIcon, CalendarIcon, CheckCircle2Icon, FilterIcon, LayersIcon } from "lucide-react";

const toFrontendStatus = (status) => {
  if (status === "completed") return "Done";
  if (status === "in-progress") return "In Process";
  return "Todo";
};

const toFrontendPriority = (priority) => {
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Medium";
};

function normalizeTeam(item) {
  const team = item.team || item.teamId || item;

  const id = team?._id || team?.id || item?._id || item?.id || "";

  return {
    id: id ? String(id) : "",
    name: team?.name || item?.name || "Untitled Team",
    description: team?.description || item?.description || "",
    role: item?.role || team?.role || "",
  };
}

export const getDeadlineMeta = (dueDate, status) => {
  const isCompleted =
    status === "completed" || status === "Done" || status === "Completed";

  if (isCompleted) {
    return {
      key: "completed",
      label: "Completed",
      days: 0,
      badgeClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }

  if (!dueDate) {
    return {
      key: "none",
      label: "No Deadline",
      days: null,
      badgeClass: "bg-muted text-muted-foreground border-border",
    };
  }

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return {
      key: "overdue",
      label: `Overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}`,
      days: diffDays,
      badgeClass:
        "bg-destructive/15 text-destructive font-semibold border-destructive/30 animate-pulse",
    };
  }

  if (diffDays === 0) {
    return {
      key: "today",
      label: "Due Today!",
      days: 0,
      badgeClass:
        "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/30",
    };
  }

  if (diffDays <= 7) {
    return {
      key: "week",
      label: `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
      days: diffDays,
      badgeClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    };
  }

  return {
    key: "upcoming",
    label: `Due in ${diffDays} days`,
    days: diffDays,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  };
};

export default function DeadlinesSection({ teamId, currentTeam, currentUserId }) {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamScope, setSelectedTeamScope] = useState(
    teamId || "ALL_TEAMS",
  );
  const [loading, setLoading] = useState(true);
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const navigate = useNavigate();

  // Sync selectedTeamScope with URL teamId if teamId changes
  useEffect(() => {
    if (teamId) {
      setSelectedTeamScope(teamId);
    }
  }, [teamId]);

  // Fetch all user teams for the team switcher
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await getMyTeams();
        const rawTeams = res.teams || res.teamMembers || res || [];
        const formatted = rawTeams.map(normalizeTeam).filter((t) => t.id);
        setTeams(formatted);
      } catch (error) {
        console.error("Failed to fetch teams in Deadlines:", error);
      }
    }
    fetchTeams();
  }, []);

  // Fetch tasks based on selectedTeamScope
  const fetchTasksForScope = useCallback(async () => {
    try {
      setLoading(true);
      if (selectedTeamScope === "ALL_TEAMS") {
        const res = await getAllUserTasks();
        setTasks(res.tasks || []);
      } else {
        const res = await getTeamTasks(selectedTeamScope);
        setTasks(res.tasks || []);
      }
    } catch (error) {
      console.error("Fetch deadlines failed:", error);
      notify.error(error.response?.data?.message || "Failed to load deadlines");
    } finally {
      setLoading(false);
    }
  }, [selectedTeamScope]);

  useEffect(() => {
    fetchTasksForScope();
  }, [fetchTasksForScope]);

  const handleScopeChange = (newScope) => {
    setSelectedTeamScope(newScope);
    if (newScope !== "ALL_TEAMS") {
      navigate(`/dashboard/${newScope}/deadlines`);
    }
  };

  const handleQuickStatusUpdate = async (task, newStatus) => {
    const targetTeamId =
      task.teamId?._id || task.teamId?.id || task.teamId || teamId;
    const taskId = task._id || task.id;

    if (!targetTeamId || !taskId) {
      notify.error("Unable to identify task team");
      return;
    }

    try {
      const backendStatusMap = {
        Done: "completed",
        "In Process": "in-progress",
        Todo: "pending",
        completed: "completed",
        "in-progress": "in-progress",
        pending: "pending",
      };

      const backendStatus = backendStatusMap[newStatus] || "pending";

      await updateTeamTask(targetTeamId, taskId, {
        status: backendStatus,
      });

      notify.success(`Status updated to ${newStatus}`);
      fetchTasksForScope();
    } catch (error) {
      console.error("Quick status update failed:", error);
      notify.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Filter tasks by assignee scope first (All Members vs My Tasks)
  const displayScopedTasks = useMemo(() => {
    if (assigneeFilter === "mine") {
      return tasks.filter((t) => {
        const assigneeId = String(
          t.assignedTo?._id || t.assignedTo || t.assignedToId || "",
        );
        return assigneeId === String(currentUserId);
      });
    }
    return tasks;
  }, [tasks, assigneeFilter, currentUserId]);

  // Metrics computation based on currently selected assignee scope
  const metrics = useMemo(() => {
    let overdue = 0;
    let today = 0;
    let week = 0;
    let completed = 0;

    displayScopedTasks.forEach((t) => {
      const meta = getDeadlineMeta(t.dueDate, t.status || t.rawStatus);
      if (meta.key === "completed") completed++;
      else if (meta.key === "overdue") overdue++;
      else if (meta.key === "today") today++;
      else if (meta.key === "week") week++;
    });

    return {
      overdue,
      today,
      week,
      completed,
      total: displayScopedTasks.length,
    };
  }, [displayScopedTasks]);

  // Filtering tasks by timeframe
  const filteredTasks = useMemo(() => {
    return displayScopedTasks.filter((t) => {
      const meta = getDeadlineMeta(t.dueDate, t.status || t.rawStatus);

      if (timeframeFilter !== "all") {
        if (timeframeFilter === "overdue" && meta.key !== "overdue")
          return false;
        if (timeframeFilter === "today" && meta.key !== "today") return false;
        if (timeframeFilter === "week" && meta.key !== "week") return false;
        if (timeframeFilter === "upcoming" && meta.key !== "upcoming")
          return false;
        if (timeframeFilter === "none" && meta.key !== "none") return false;
        if (timeframeFilter === "completed" && meta.key !== "completed")
          return false;
      }

      return true;
    });
  }, [displayScopedTasks, timeframeFilter]);

  // Grouping tasks by urgency
  const groupedTasks = useMemo(() => {
    const groups = {
      overdue: [],
      today: [],
      week: [],
      upcoming: [],
      none: [],
      completed: [],
    };

    filteredTasks.forEach((t) => {
      const meta = getDeadlineMeta(t.dueDate, t.status || t.rawStatus);
      if (groups[meta.key]) {
        groups[meta.key].push({ ...t, _meta: meta });
      }
    });

    return groups;
  }, [filteredTasks]);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Top Header Card with Team Switcher */}
      <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ClockIcon className="size-5 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Deadlines & Timelines
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor task due dates, overdue warnings, and team progress.
            </p>
          </div>

          {/* Header Controls: Scope Selector & Assignee Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Assignee Toggle (All Members vs My Tasks) - Visible on Mobile, Tablet & Desktop */}
            <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
              <Button
                variant={assigneeFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setAssigneeFilter("all")}
                className="h-7 rounded-md text-xs px-2.5"
              >
                <UsersIcon className="mr-1 size-3" /> All Members
              </Button>
              <Button
                variant={assigneeFilter === "mine" ? "default" : "ghost"}
                size="sm"
                onClick={() => setAssigneeFilter("mine")}
                className="h-7 rounded-md text-xs px-2.5"
              >
                <UserIcon className="mr-1 size-3" /> My Tasks
              </Button>
            </div>

            {/* Team Scope Selector */}
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
                Workspace:
              </Label>
              <Select value={selectedTeamScope} onValueChange={handleScopeChange}>
                <SelectTrigger className="w-[190px] rounded-lg h-9 text-xs">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_TEAMS">
                    🌐 All Teams (All Workspaces)
                  </SelectItem>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      🏢 {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Overdue Alert Banner */}
      {metrics.overdue > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive shadow-sm">
          <AlertTriangleIcon className="size-5 shrink-0 animate-bounce" />
          <div className="flex-1 text-sm">
            <span className="font-bold">
              {metrics.overdue} Task{metrics.overdue > 1 ? "s" : ""} Overdue!
            </span>{" "}
            <span>
              {assigneeFilter === "mine"
                ? "Immediate action required for your overdue task(s)."
                : "Please review and update the overdue task statuses below."}
            </span>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setTimeframeFilter("overdue")}
            className="shrink-0 text-xs"
          >
            Show Overdue Only
          </Button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => setTimeframeFilter("overdue")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
            timeframeFilter === "overdue"
              ? "border-destructive bg-destructive/10 ring-2 ring-destructive/30"
              : "bg-card hover:border-destructive/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overdue Tasks
            </span>
            <AlertCircleIcon className="size-4 text-destructive" />
          </div>
          <p className="mt-2 text-3xl font-bold text-destructive">
            {metrics.overdue}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Requires immediate attention
          </p>
        </div>

        <div
          onClick={() => setTimeframeFilter("today")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
            timeframeFilter === "today"
              ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30"
              : "bg-card hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Due Today
            </span>
            <ClockIcon className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-500">
            {metrics.today}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Must be completed today
          </p>
        </div>

        <div
          onClick={() => setTimeframeFilter("week")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
            timeframeFilter === "week"
              ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30"
              : "bg-card hover:border-blue-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              This Week
            </span>
            <CalendarIcon className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-500">
            {metrics.week}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Due in the next 7 days
          </p>
        </div>

        <div
          onClick={() => setTimeframeFilter("completed")}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
            timeframeFilter === "completed"
              ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30"
              : "bg-card hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completed
            </span>
            <CheckCircle2Icon className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-500">
            {metrics.completed}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Successfully finished
          </p>
        </div>
      </div>

      {/* Desktop-only Timeframe Filter Toolbar */}
      <div className="hidden lg:flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterIcon className="mr-1 size-4 text-muted-foreground" />
          {[
            { id: "all", label: "All Tasks" },
            { id: "overdue", label: `Overdue (${metrics.overdue})` },
            { id: "today", label: `Due Today (${metrics.today})` },
            { id: "week", label: `This Week (${metrics.week})` },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((f) => (
            <Button
              key={f.id}
              variant={timeframeFilter === f.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframeFilter(f.id)}
              className="h-8 rounded-lg text-xs"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Task Deadline List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading deadlines...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center">
          <CheckCircle2Icon className="mx-auto size-8 text-muted-foreground/50" />
          <p className="mt-2 text-base font-semibold">No deadlines found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {timeframeFilter !== "all"
              ? "No tasks match the selected deadline filter."
              : "No active tasks with deadlines."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {[
            {
              key: "overdue",
              title: "🚨 Overdue Tasks",
              list: groupedTasks.overdue,
            },
            { key: "today", title: "⚡ Due Today", list: groupedTasks.today },
            { key: "week", title: "📅 Due This Week", list: groupedTasks.week },
            {
              key: "upcoming",
              title: "🔮 Upcoming Deadlines",
              list: groupedTasks.upcoming,
            },
            {
              key: "none",
              title: "📋 No Deadline Specified",
              list: groupedTasks.none,
            },
            {
              key: "completed",
              title: "✅ Completed Tasks",
              list: groupedTasks.completed,
            },
          ].map((group) => {
            if (group.list.length === 0) return null;

            return (
              <div key={group.key} className="space-y-3">
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  {group.title}
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {group.list.length}
                  </Badge>
                </h2>

                <div className="grid gap-3">
                  {group.list.map((task) => {
                    const statusStr = toFrontendStatus(task.status);
                    const priorityStr = toFrontendPriority(task.priority);
                    const teamName =
                      task.teamId?.name ||
                      currentTeam?.name ||
                      "Team Workspace";

                    return (
                      <div
                        key={task._id || task.id}
                        className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs transition-all hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold tracking-tight">
                              {task.title || task.header}
                            </span>

                            {/* Team Name Badge */}
                            <Badge
                              variant="outline"
                              className="rounded-full text-[11px] font-medium bg-muted/50"
                            >
                              <LayersIcon className="mr-1 size-3 text-muted-foreground" />
                              {teamName}
                            </Badge>

                            {/* Category Badge */}
                            {task.category && (
                              <Badge
                                variant="secondary"
                                className="rounded-full text-[11px]"
                              >
                                {task.category}
                              </Badge>
                            )}

                            {/* Urgency Badge */}
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${task._meta.badgeClass}`}
                            >
                              {task._meta.label}
                            </span>
                          </div>

                          {task.description && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="size-3.5" />
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}

                            <span className="flex items-center gap-1">
                              <UserIcon className="size-3.5" />
                              {task.assignedTo?.name ||
                                task.reviewer ||
                                "Unassigned"}
                            </span>
                          </div>
                        </div>

                        {/* Controls: Priority & Quick Status Toggle */}
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge
                            variant={
                              priorityStr === "High"
                                ? "destructive"
                                : priorityStr === "Medium"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="rounded-full px-2.5 py-1 text-xs"
                          >
                            {priorityStr} Priority
                          </Badge>

                          <Select
                            value={statusStr}
                            onValueChange={(val) =>
                              handleQuickStatusUpdate(task, val)
                            }
                          >
                            <SelectTrigger className="h-8 w-32 rounded-lg text-xs capitalize">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Todo">Todo</SelectItem>
                              <SelectItem value="In Process">
                                In Process
                              </SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
