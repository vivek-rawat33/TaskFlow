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
import { notify } from "@/components/ui/toast";

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
                      {currentTeam?.name || "Team Dashboard"}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                      {currentTeam?.description ||
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
                        <ChartAreaInteractive tasks={tasks} />

                        <div className="grid gap-4 xl:grid-cols-2">
                          <StatusChart tasks={tasks} />

                          <div className="hidden xl:block">
                            <PriorityChart tasks={tasks} />
                          </div>
                        </div>

                        <div className="hidden xl:grid xl:grid-cols-2 xl:gap-4">
                          <DeadlineChart tasks={tasks} />

                          <MemberPerformanceChart tasks={tasks} />
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

function TeamMembersSection({
  teamId,
  members = [],
  currentUserRole = "",
  onMemberAdded,
  onMemberRemoved,
  onMemberRoleChanged,
}) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({
    email: "",
    role: "member",
  });
  const [addMemberError, setAddMemberError] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const canManageMembers =
    currentUserRole === "owner" || currentUserRole === "admin";

  async function handleAddMember(e) {
    e.preventDefault();

    const email = memberForm.email.trim();

    if (!email) {
      notify.error("Email is required");
      return;
    }

    try {
      const res = await addTeamMember(teamId, {
        email,
        role: memberForm.role,
      });

      const member = res.member || res.teamMember || res;

      const formattedMember = {
        id: String(
          member.userId?._id || member.userId || member.user?._id || "",
        ),
        name: member.userId?.name || member.user?.name || "Unknown user",
        email: member.userId?.email || member.user?.email || email,
        role: member.role || memberForm.role,
      };

      onMemberAdded?.(formattedMember);

      setMemberForm({
        email: "",
        role: "member",
      });

      setIsAddMemberOpen(false);
      notify.success("Member added successfully");
    } catch (error) {
      console.error("Add member failed:", error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        notify.error("User not found. Ask this user to sign up first.");
        return;
      }

      if (status === 409 || message?.toLowerCase().includes("already")) {
        notify.error("This user is already a member of this team.");
        return;
      }

      if (status === 403) {
        notify.error("You do not have permission to add members.");
        return;
      }

      if (status === 401) {
        notify.error("Please sign in again.");
        localStorage.removeItem("token");
        window.location.href = "/signin";
        return;
      }

      notify.error(message || "Failed to add member");
    }
  }
  async function handleRemoveMember(member) {
    const confirmed = window.confirm(
      `Remove ${member.name || "this member"} from this team?`,
    );

    if (!confirmed) return;

    try {
      await removeTeamMember(teamId, member.id);

      onMemberRemoved?.(member.id);

      notify.success("Member removed successfully");
    } catch (error) {
      console.error("Remove member failed:", error);

      const message = error.response?.data?.message;

      notify.error(message || "Failed to remove member");
    }
  }

  async function handleChangeMemberRole(member, newRole) {
    if (!teamId) {
      notify.error("Team ID missing");
      return;
    }

    if (member.role === "owner") {
      notify.error("Owner role cannot be changed");
      return;
    }

    try {
      await changeMemberRole(teamId, member.id, newRole);

      onMemberRoleChanged?.(member.id, newRole);

      notify.success("Role updated successfully");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to change role");
    }
  }
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Team Members
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage team access, member roles, and permissions.
            </p>
          </div>

          {canManageMembers && (
            <Button
              variant="default"
              onClick={() => setIsAddMemberOpen(true)}
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <UserPlusIcon className="size-4" />
              Add Member
            </Button>
          )}
        </div>
        <div className="divide-y">
          {members.length === 0 ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              No members found in this team.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold uppercase text-muted-foreground">
                    {member.name?.charAt(0) || "U"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{member.name}</p>

                      {member.role === "owner" && (
                        <Badge variant="secondary" className="text-xs">
                          Owner
                        </Badge>
                      )}
                    </div>

                    <p className="truncate text-sm text-muted-foreground">
                      {member.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {currentUserRole === "owner" && member.role !== "owner" ? (
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleChangeMemberRole(member, value)
                      }
                    >
                      <SelectTrigger className="h-8 w-32 rounded-full text-xs capitalize">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-1 capitalize"
                    >
                      {member.role}
                    </Badge>
                  )}

                  {canManageMembers && member.role !== "owner" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={isAddMemberOpen}
        onOpenChange={(open) => {
          setIsAddMemberOpen(open);

          if (!open) {
            setAddMemberError("");
            setMemberForm({
              email: "",
              role: "member",
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>
              Add an existing registered user to this team by email.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="memberEmail">Email</Label>

              <Input
                id="memberEmail"
                type="email"
                placeholder="member@example.com"
                value={memberForm.email}
                onChange={(e) => {
                  setMemberForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));

                  if (addMemberError) {
                    setAddMemberError("");
                  }
                }}
                className={addMemberError ? "border-destructive" : ""}
              />

              <p className="text-xs text-muted-foreground">
                The user must already have an account before you can add them.
              </p>

              {addMemberError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {addMemberError}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memberRole">Role</Label>
              <Select
                value={memberForm.role}
                onValueChange={(value) =>
                  setMemberForm((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
              >
                <SelectTrigger id="memberRole" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMemberOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isAddingMember}>
                {isAddingMember ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnnouncementsSection({ teamId, currentUserRole = "" }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const canManageAnnouncements =
    currentUserRole === "owner" || currentUserRole === "admin";

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!teamId) return;

      try {
        setLoading(true);

        const res = await getTeamAnnouncements(teamId);
        setAnnouncements(res.announcements || []);
      } catch (error) {
        console.error("Fetch announcements failed:", error);
        notify.error(
          error.response?.data?.message || "Failed to fetch announcements",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, [teamId]);

  async function handleCreateAnnouncement(e) {
    e.preventDefault();

    const title = announcementForm.title.trim();
    const message = announcementForm.message.trim();

    if (!title) {
      notify.error("Announcement title is required");
      return;
    }

    if (!message) {
      notify.error("Announcement message is required");
      return;
    }

    try {
      setIsCreating(true);

      const res = await createTeamAnnouncement(teamId, {
        title,
        message,
      });

      setAnnouncements((prev) => [res.announcement, ...prev]);

      setAnnouncementForm({
        title: "",
        message: "",
      });

      setIsCreateOpen(false);

      notify.success("Announcement posted successfully");
    } catch (error) {
      console.error("Create announcement failed:", error);
      notify.error(
        error.response?.data?.message || "Failed to create announcement",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteAnnouncement(announcementId) {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;

    try {
      await deleteTeamAnnouncement(teamId, announcementId);

      setAnnouncements((prev) =>
        prev.filter(
          (announcement) => String(announcement._id) !== String(announcementId),
        ),
      );

      notify.success("Announcement deleted successfully");
    } catch (error) {
      console.error("Delete announcement failed:", error);
      notify.error(
        error.response?.data?.message || "Failed to delete announcement",
      );
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Announcements
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share important updates with your team.
            </p>
          </div>

          {canManageAnnouncements && (
            <Button onClick={() => setIsCreateOpen(true)}>
              Create Announcement
            </Button>
          )}
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No announcements yet.
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement._id} className="px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold tracking-tight">
                      {announcement.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {announcement.message}
                    </p>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Posted by {announcement.createdBy?.name || "Unknown user"}{" "}
                      ·{" "}
                      {new Date(announcement.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  {canManageAnnouncements && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create announcement</DialogTitle>
            <DialogDescription>
              Post an update that all team members can read.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="announcementTitle">Title</Label>
              <Input
                id="announcementTitle"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Example: Sprint planning update"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="announcementMessage">Message</Label>
              <textarea
                id="announcementMessage"
                value={announcementForm.message}
                onChange={(e) =>
                  setAnnouncementForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder="Write your announcement..."
                rows={5}
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Posting..." : "Post Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamSettingsSection({
  teamId,
  currentTeam,
  currentUserRole = "",
  onTeamUpdated,
  onTeamDeleted,
}) {
  const [teamForm, setTeamForm] = useState({
    name: currentTeam?.name || "",
    description: currentTeam?.description || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canUpdateTeam =
    currentUserRole === "owner" || currentUserRole === "admin";

  const canDeleteTeam = currentUserRole === "owner";

  useEffect(() => {
    setTeamForm({
      name: currentTeam?.name || "",
      description: currentTeam?.description || "",
    });
  }, [currentTeam]);

  async function handleUpdateTeam(e) {
    e.preventDefault();

    const name = teamForm.name.trim();
    const description = teamForm.description.trim();

    if (!name) {
      notify.error("Team name is required");
      return;
    }

    try {
      setIsSaving(true);

      const res = await updateTeam(teamId, {
        name,
        description,
      });

      onTeamUpdated?.(res.team);

      notify.success("Team updated successfully");
    } catch (error) {
      console.error("Update team failed:", error);
      notify.error(error.response?.data?.message || "Failed to update team");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTeam() {
    const confirmed = window.confirm(
      "Delete this team permanently? This will delete all tasks and members from this team.",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteTeam(teamId);

      notify.success("Team deleted successfully");

      onTeamDeleted?.();
    } catch (error) {
      console.error("Delete team failed:", error);
      notify.error(error.response?.data?.message || "Failed to delete team");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="border-b px-5 py-5">
          <h2 className="text-xl font-semibold tracking-tight">
            Team Settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update team details and manage dangerous actions.
          </p>
        </div>

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleUpdateTeam} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamForm.name}
                disabled={!canUpdateTeam}
                onChange={(e) =>
                  setTeamForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Example: Product Team"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teamDescription">Description</Label>
              <textarea
                id="teamDescription"
                value={teamForm.description}
                disabled={!canUpdateTeam}
                onChange={(e) =>
                  setTeamForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe this team..."
                rows={5}
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {canUpdateTeam ? (
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                You do not have permission to edit this team.
              </p>
            )}
          </form>

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Deleting a team permanently removes its tasks, members, and team
              data.
            </p>

            <Button
              type="button"
              variant="destructive"
              className="mt-4"
              disabled={!canDeleteTeam || isDeleting}
              onClick={handleDeleteTeam}
            >
              {isDeleting ? "Deleting..." : "Delete Team"}
            </Button>

            {!canDeleteTeam && (
              <p className="mt-2 text-xs text-muted-foreground">
                Only the team owner can delete this team.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingsSection({ teamId, currentUserRole = "" }) {
  const [meetings, setMeetings] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    meetingUrl: "",
  });

  const canManageMeetings =
    currentUserRole === "owner" || currentUserRole === "admin";

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    let cancelled = false;

    async function fetchMeetings() {
      if (!teamId) return;

      try {
        const res = await getTeamMeetings(teamId, monthStr);
        if (!cancelled) {
          setMeetings(res.meetings || []);
          setInitialLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fetch meetings failed:", error);
          notify.error(
            error.response?.data?.message || "Failed to fetch meetings",
          );
          setInitialLoading(false);
        }
      }
    }

    fetchMeetings();
    return () => {
      cancelled = true;
    };
  }, [teamId, monthStr]);

  function goToPrevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  function goToNextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  function goToToday() {
    setCurrentMonth(new Date());
    setSelectedDate(null);
  }

  // Calendar grid helpers
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Build the 6-row calendar grid
  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: null,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      date: dateStr,
    });
  }

  // Next month leading days to fill the grid
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: null,
    });
  }

  // Get meetings for a given date string
  function getMeetingsForDate(dateStr) {
    if (!dateStr) return [];
    return meetings.filter((m) => {
      const mDate = new Date(m.date);
      const mStr = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, "0")}-${String(mDate.getDate()).padStart(2, "0")}`;
      return mStr === dateStr;
    });
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function handleDayClick(dayObj) {
    if (!dayObj.isCurrentMonth || !dayObj.date) return;

    if (selectedDate === dayObj.date) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(dayObj.date);

    if (canManageMeetings) {
      setMeetingForm((prev) => ({
        ...prev,
        date: dayObj.date,
      }));
    }
  }

  function openCreateDialog(dateStr) {
    setMeetingForm({
      title: "",
      description: "",
      date: dateStr || "",
      startTime: "",
      endTime: "",
      meetingUrl: "",
    });
    setIsCreateOpen(true);
  }

  async function handleCreateMeeting(e) {
    e.preventDefault();

    const title = meetingForm.title.trim();
    if (!title) {
      notify.error("Meeting title is required");
      return;
    }

    if (!meetingForm.date) {
      notify.error("Meeting date is required");
      return;
    }

    if (!meetingForm.startTime) {
      notify.error("Start time is required");
      return;
    }

    try {
      setIsCreating(true);

      const res = await createTeamMeeting(teamId, {
        title,
        description: meetingForm.description.trim(),
        date: meetingForm.date,
        startTime: meetingForm.startTime,
        endTime: meetingForm.endTime,
        meetingUrl: meetingForm.meetingUrl.trim(),
      });

      setMeetings((prev) =>
        [...prev, res.meeting].sort((a, b) => {
          const dateComp = new Date(a.date) - new Date(b.date);
          if (dateComp !== 0) return dateComp;
          return (a.startTime || "").localeCompare(b.startTime || "");
        }),
      );

      setMeetingForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        meetingUrl: "",
      });

      setIsCreateOpen(false);
      notify.success("Meeting created successfully");
    } catch (error) {
      console.error("Create meeting failed:", error);
      notify.error(error.response?.data?.message || "Failed to create meeting");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteMeeting(meetingId) {
    const confirmed = window.confirm("Delete this meeting?");
    if (!confirmed) return;

    try {
      await deleteTeamMeeting(teamId, meetingId);

      setMeetings((prev) =>
        prev.filter((m) => String(m._id) !== String(meetingId)),
      );

      notify.success("Meeting deleted successfully");
    } catch (error) {
      console.error("Delete meeting failed:", error);
      notify.error(error.response?.data?.message || "Failed to delete meeting");
    }
  }

  function formatTime(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }

  const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="px-4 lg:px-6">
      {/* Calendar Card */}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Meetings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule and manage team meetings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>

            {canManageMeetings && (
              <Button
                size="sm"
                onClick={() => openCreateDialog(selectedDate || todayStr)}
                className="gap-1.5"
              >
                <PlusIcon className="size-4" />
                New Meeting
              </Button>
            )}
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevMonth}
            className="size-8 rounded-lg"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <h3 className="text-sm font-semibold tracking-tight">{monthLabel}</h3>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="size-8 rounded-lg"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>

        {initialLoading ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Loading meetings...
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="p-2 sm:p-4">
              {/* Day headers */}
              <div className="mb-1 grid grid-cols-7">
                {dayNames.map((name) => (
                  <div
                    key={name}
                    className="py-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {name}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayObj, idx) => {
                  const dateMeetings = dayObj.date
                    ? getMeetingsForDate(dayObj.date)
                    : [];
                  const isToday = dayObj.date === todayStr;
                  const isSelected = dayObj.date === selectedDate;

                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={dayObj.isCurrentMonth ? 0 : -1}
                      onClick={() => handleDayClick(dayObj)}
                      className={[
                        "relative flex min-h-[4rem] flex-col items-center gap-1 rounded-lg p-1.5 text-sm transition-all duration-150 select-none sm:min-h-[5rem] sm:items-start sm:p-2",
                        "outline-none focus-visible:outline-none",
                        !dayObj.isCurrentMonth
                          ? "pointer-events-none text-muted-foreground/30"
                          : "cursor-pointer hover:bg-muted/50",
                        isSelected && dayObj.isCurrentMonth
                          ? "bg-muted/80 dark:bg-muted/60"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className={[
                          "inline-flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors duration-150",
                          isToday ? "bg-primary text-primary-foreground" : "",
                          isSelected && !isToday && dayObj.isCurrentMonth
                            ? "bg-foreground/10"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {dayObj.day}
                      </span>

                      {dateMeetings.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-[3px] sm:justify-start">
                          {dateMeetings.slice(0, 3).map((_, i) => (
                            <span
                              key={i}
                              className="size-[5px] rounded-full bg-primary/70"
                            />
                          ))}
                          {dateMeetings.length > 3 && (
                            <span className="text-[9px] leading-none text-muted-foreground">
                              +{dateMeetings.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected day panel */}
            {selectedDate && (
              <div className="border-t bg-muted/20 px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold tracking-tight">
                      {selectedDateLabel}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {selectedMeetings.length === 0
                        ? "No meetings scheduled"
                        : `${selectedMeetings.length} meeting${selectedMeetings.length > 1 ? "s" : ""}`}
                    </p>
                  </div>

                  {canManageMeetings && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCreateDialog(selectedDate)}
                      className="gap-1.5"
                    >
                      <PlusIcon className="size-4" />
                      Add Meeting
                    </Button>
                  )}
                </div>

                {selectedMeetings.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {selectedMeetings.map((meeting) => (
                      <div
                        key={meeting._id}
                        className="rounded-xl border bg-card p-4 shadow-xs transition-colors hover:bg-accent/30"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <VideoIcon className="size-3.5 text-primary" />
                              </div>
                              <h4 className="font-semibold tracking-tight">
                                {meeting.title}
                              </h4>
                            </div>

                            <div className="mt-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                              <ClockIcon className="size-3.5" />
                              <span>
                                {formatTime(meeting.startTime)}
                                {meeting.endTime
                                  ? ` – ${formatTime(meeting.endTime)}`
                                  : ""}
                              </span>
                            </div>

                            {meeting.description && (
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {meeting.description}
                              </p>
                            )}

                            {meeting.meetingUrl && (
                              <a
                                href={meeting.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                              >
                                <ExternalLinkIcon className="size-3" />
                                Join Meeting
                              </a>
                            )}

                            <p className="mt-3 text-xs text-muted-foreground/70">
                              Created by{" "}
                              {meeting.createdBy?.name || "Unknown user"}
                            </p>
                          </div>

                          {canManageMeetings && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMeeting(meeting._id)}
                              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2Icon className="size-3.5" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule meeting</DialogTitle>
            <DialogDescription>
              Create a new meeting for your team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="meetingTitle">Title</Label>
              <Input
                id="meetingTitle"
                value={meetingForm.title}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Sprint planning"
              />
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <DatePicker
                value={meetingForm.date}
                onChange={(val) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    date: val,
                  }))
                }
                placeholder="Pick a date"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="meetingStartTime">Start time</Label>
                <Input
                  id="meetingStartTime"
                  type="time"
                  value={meetingForm.startTime}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meetingEndTime">End time</Label>
                <Input
                  id="meetingEndTime"
                  type="time"
                  value={meetingForm.endTime}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetingDescription">Description</Label>
              <textarea
                id="meetingDescription"
                value={meetingForm.description}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of the meeting..."
                rows={3}
                className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetingUrl">Meeting link</Label>
              <Input
                id="meetingUrl"
                type="url"
                value={meetingForm.meetingUrl}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    meetingUrl: e.target.value,
                  }))
                }
                placeholder="https://meet.google.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Google Meet, Zoom, Teams, or any meeting link.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
