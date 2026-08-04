import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { DeadlineChart } from "@/components/deadline-chart";
import { MemberPerformanceChart } from "@/components/member-performance-chart";
import { PriorityChart } from "@/components/priority-chart";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getTeamTasks } from "@/api/taskApi";
import {
  getTeamMembers,
  getMyTeams,
  addTeamMember,
  removeTeamMember,
  changeMemberRole,
  updateTeam,
  deleteTeam,
} from "@/api/teamApi";

import { StatusChart } from "@/components/status-chart";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  UserPlusIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ExternalLinkIcon,
  VideoIcon,
  ClockIcon,
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LayersIcon,
  FilterIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

import {
  getTeamAnnouncements,
  createTeamAnnouncement,
  deleteTeamAnnouncement,
} from "@/api/announcementApi";
import {
  getTeamMeetings,
  createTeamMeeting,
  deleteTeamMeeting,
} from "@/api/meetingApi";
import { getAllUserTasks, updateTeamTask } from "@/api/taskApi";
import { notify } from "@/components/ui/toast";

import TeamMembersSection from "@/components/sections/TeamMembersSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import TeamSettingsSection from "@/components/sections/TeamSettingsSection";
import MeetingsSection from "@/components/sections/MeetingsSection";
import DeadlinesSection from "@/components/sections/DeadlinesSection";

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

function getLoggedInUserId() {
  const token = localStorage.getItem("token");

  if (!token) return "";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload._id || payload.id || payload.userId || "";
  } catch (error) {
    console.error("Failed to decode token:", error);
    return "";
  }
}

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

const formatTaskForTable = (task) => ({
  id: task._id || task.id,
  header: task.title || "Untitled Task",
  description: task.description || "",
  type: task.category || "General",
  status: toFrontendStatus(task.status),
  rawStatus: task.status,
  target: task.dueDate ? task.dueDate.split("T")[0] : "",
  limit: toFrontendPriority(task.priority),
  reviewer: task.assignedTo?.name || "Unassigned",
  assignedToId: task.assignedTo?._id ? String(task.assignedTo._id) : "",
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
  completedAt: task.completedAt,
});

export default function Dashboard() {
  const [currentTeam, setCurrentTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const { teamId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUserRole, setCurrentUserRole] = useState("");
  const isMembersPage = location.pathname.endsWith("/members");
  const isMyTasksPage = location.pathname.endsWith("/my-tasks");
  const [currentUserId, setCurrentUserId] = useState("");
  const isAnnouncementsPage = location.pathname.endsWith("/announcements");
  const isMeetingsPage = location.pathname.endsWith("/meetings");
  const isDeadlinesPage = location.pathname.endsWith("/deadlines");
  const isSettingsPage = location.pathname.endsWith("/settings");
  const fetchDashboardData = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!teamId) {
          setCurrentTeam(null);
          setTasks([]);
          setMembers([]);
          setCurrentUserRole("");

          if (!silent) {
            setLoading(false);
          }

          return;
        }

        if (!silent) {
          setLoading(true);
        }

        const [taskRes, memberRes, teamRes] = await Promise.all([
          getTeamTasks(teamId),
          getTeamMembers(teamId),
          getMyTeams(),
        ]);

        const rawTeams = teamRes.teams || teamRes.teamMembers || teamRes || [];

        const formattedTeams = rawTeams
          .map(normalizeTeam)
          .filter((team) => team.id);

        const selectedTeam = formattedTeams.find(
          (team) => String(team.id) === String(teamId),
        );

        setCurrentTeam(selectedTeam || null);

        const rawTasks = taskRes.tasks || [];

        const rawMembers =
          memberRes.members || memberRes.teamMembers || memberRes || [];

        const formattedMembers = rawMembers.map((member) => {
          const user = member.userId || member.user || {};

          return {
            id: String(user._id || member.userId || member.user || ""),
            name: user.name || member.name || "Unknown user",
            email: user.email || member.email || "",
            role: member.role,
          };
        });

        setMembers(formattedMembers);

        const loggedInUserId = getLoggedInUserId();
        setCurrentUserId(loggedInUserId);

        const currentMember = formattedMembers.find(
          (member) => String(member.id) === String(loggedInUserId),
        );

        setCurrentUserRole(currentMember?.role || "");

        const formattedTasks = rawTasks.map(formatTaskForTable);

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        notify.error("Failed to load dashboard data");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [teamId],
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const displayedTasks = useMemo(() => {
    if (isMyTasksPage) {
      return tasks.filter(
        (task) => String(task.assignedToId) === String(currentUserId),
      );
    }
    return tasks;
  }, [isMyTasksPage, tasks, currentUserId]);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />

      <SidebarInset className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border bg-card px-5 py-4 text-card-foreground shadow-sm">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      Current team
                    </p>

                    <h1 className="text-2xl font-semibold tracking-tight">
                      {isMyTasksPage
                        ? `${currentTeam?.name || "Team"} — My Tasks`
                        : currentTeam?.name || "Team Dashboard"}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                      {isMyTasksPage
                        ? "Viewing tasks assigned to you in this team."
                        : currentTeam?.description ||
                          "Manage tasks, deadlines, and team members from one place."}
                    </p>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="px-4 text-sm text-muted-foreground lg:px-6">
                  Loading tasks...
                </div>
              ) : (
                <>
                  {isMembersPage ? (
                    <TeamMembersSection
                      teamId={teamId}
                      members={members}
                      currentUserRole={currentUserRole}
                      onMemberAdded={(newMember) => {
                         setMembers((prev) => [...prev, newMember]);
                      }}
                      onMemberRemoved={(memberId) => {
                        setMembers((prev) =>
                          prev.filter(
                            (member) => String(member.id) !== String(memberId),
                          ),
                        );
                      }}
                      onMemberRoleChanged={(memberId, newRole) => {
                        setMembers((prev) =>
                          prev.map((member) =>
                            String(member.id) === String(memberId)
                              ? { ...member, role: newRole }
                              : member,
                          ),
                        );
                      }}
                    />
                  ) : isAnnouncementsPage ? (
                    <AnnouncementsSection
                      teamId={teamId}
                      currentUserRole={currentUserRole}
                    />
                  ) : isMeetingsPage ? (
                    <MeetingsSection
                      teamId={teamId}
                      currentUserRole={currentUserRole}
                    />
                  ) : isDeadlinesPage ? (
                    <DeadlinesSection
                      teamId={teamId}
                      currentTeam={currentTeam}
                      currentUserId={currentUserId}
                    />
                  ) : isSettingsPage ? (
                    <TeamSettingsSection
                      teamId={teamId}
                      currentTeam={currentTeam}
                      currentUserRole={currentUserRole}
                      onTeamUpdated={(updatedTeam) => {
                        setCurrentTeam((prev) => ({
                          ...prev,
                          ...updatedTeam,
                        }));
                      }}
                      onTeamDeleted={() => {
                        navigate("/dashboard");
                      }}
                    />
                  ) : (
                    <>
                      {/* Charts Section */}
                      <div className="space-y-4 px-4 lg:px-6">
                        <ChartAreaInteractive tasks={displayedTasks} />

                        <div className="grid gap-4 xl:grid-cols-2">
                          <StatusChart tasks={displayedTasks} />

                          <div className="hidden xl:block">
                            <PriorityChart tasks={displayedTasks} />
                          </div>
                        </div>

                        <div className="hidden xl:grid xl:grid-cols-2 xl:gap-4">
                          <DeadlineChart tasks={displayedTasks} />

                          <MemberPerformanceChart tasks={displayedTasks} />
                        </div>
                      </div>
                      <DataTable
                        data={displayedTasks}
                        teamId={teamId}
                        members={members}
                        currentUserRole={currentUserRole}
                        currentUserId={currentUserId}
                        onTasksChange={() =>
                          fetchDashboardData({ silent: true })
                        }
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
