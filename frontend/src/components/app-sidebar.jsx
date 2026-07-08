import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { createTeam, getMyTeams } from "@/api/teamApi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import {
  LayoutDashboardIcon,
  ListTodoIcon,
  CheckSquareIcon,
  UsersIcon,
  BellIcon,
  CalendarDaysIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  ClipboardListIcon,
  ClockIcon,
  CommandIcon,
  CirclePlusIcon,
  SettingsIcon,
} from "lucide-react";

const data = {
  user: {
    name: "Vivek",
    email: "vivek@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "All Tasks",
      url: "/tasks",
      icon: <ListTodoIcon />,
    },
    {
      title: "My Tasks",
      url: "/my-tasks",
      icon: <CheckSquareIcon />,
    },
    {
      title: "Team Members",
      url: "/team",
      icon: <UsersIcon />,
    },
    {
      title: "Announcements",
      url: "/announcements",
      icon: <BellIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "/search",
      icon: <SearchIcon />,
    },
  ],

  documents: [
    {
      name: "Project Tasks",
      url: "/tasks",
      icon: <ClipboardListIcon />,
    },
    {
      name: "Deadlines",
      url: "/deadlines",
      icon: <ClockIcon />,
    },
    {
      name: "Meetings",
      url: "/meetings",
      icon: <CalendarDaysIcon />,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [teams, setTeams] = useState([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await getMyTeams();

        const rawTeams = res.teams || res.teamMembers || res || [];

        const formattedTeams = rawTeams
          .map(normalizeTeam)
          .filter((team) => team.id);

        setTeams(formattedTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        toast.error("Failed to fetch teams");
      }
    }

    fetchTeams();
  }, []);

  async function handleCreateTeam(e) {
    e.preventDefault();

    const name = teamForm.name.trim();

    if (!name) {
      toast.error("Team name is required");
      return;
    }

    try {
      const createdTeam = await createTeam({
        name,
        description: teamForm.description.trim(),
      });

      const team = normalizeTeam(createdTeam.team || createdTeam);

      setTeamForm({
        name: "",
        description: "",
      });
      setTeams((prev) => [team, ...prev]);

      setIsCreateTeamOpen(false);

      toast.success("Team created successfully");

      if (!team.id) {
        console.error("Created team has no id:", createdTeam);
        toast.error("Team created but team id missing");
        return;
      }

      navigate(`/dashboard/${team.id}`);
    } catch (error) {
      console.error("Create team failed:", error);
      toast.error(error.response?.data?.message || "Failed to create team");
    }
  }

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

  const hasSelectedTeam = Boolean(teamId);

  const getTeamPath = (path = "") => {
    if (!teamId) return "";
    return `/dashboard/${teamId}${path}`;
  };

  const navMain = hasSelectedTeam
    ? [
        {
          title: "Dashboard",
          url: getTeamPath(),
          icon: <LayoutDashboardIcon />,
        },
        {
          title: "All Tasks",
          url: getTeamPath("/tasks"),
          icon: <ListTodoIcon />,
        },
        {
          title: "My Tasks",
          url: getTeamPath("/my-tasks"),
          icon: <CheckSquareIcon />,
        },
        {
          title: "Team Members",
          url: getTeamPath("/members"),
          icon: <UsersIcon />,
        },
        {
          title: "Announcements",
          url: getTeamPath("/announcements"),
          icon: <BellIcon />,
        },
        {
          title: "Settings",
          url: getTeamPath("/settings"),
          icon: <SettingsIcon />,
        },
      ]
    : [];
  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link to={teamId ? `/dashboard/${teamId}` : "/dashboard"}>
                  <CommandIcon className="size-5!" />
                  <span className="text-base font-semibold">TaskFlow.</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Create Team Button */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Create Team"
                    onClick={() => setIsCreateTeamOpen(true)}
                    className="group relative min-w-8 overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0 active:shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/15"
                  >
                    <CirclePlusIcon className="relative z-10 text-slate-500 transition-colors duration-300 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white" />
                    <span className="relative z-10">Create Team</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Teams List */}
          <SidebarGroup>
            <SidebarGroupLabel>Your Teams</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {teams.map((team) => {
                  if (!team.id) return null;

                  const isActive = String(team.id) === String(teamId);

                  return (
                    <SidebarMenuItem key={team.id}>
                      <SidebarMenuButton
                        type="button"
                        onClick={() => navigate(`/dashboard/${team.id}`)}
                        isActive={isActive}
                        tooltip={team.name}
                      >
                        <span className="truncate">{team.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <NavMain items={navMain} />
          <NavDocuments items={data.documents} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
            <DialogDescription>
              Create a new workspace for tasks, members, and deadlines.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="teamName">Team name</Label>
              <Input
                id="teamName"
                placeholder="Frontend Team"
                value={teamForm.name}
                onChange={(e) =>
                  setTeamForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teamDescription">Description</Label>
              <textarea
                id="teamDescription"
                placeholder="Team for product development and task tracking"
                value={teamForm.description}
                onChange={(e) =>
                  setTeamForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateTeamOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Create Team</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
