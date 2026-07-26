import {
  BarChart3,
  BellRing,
  CalendarClock,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const landingConfig = {
  brand: {
    name: "TaskFlow",
    mark: "TF",
  },
  routes: {
    signIn: "/signin",
    signUp: "/signup",
    dashboard: "/dashboard",
  },
  navigation: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#workflow" },
    { label: "Permissions", href: "#permissions" },
  ],
  hero: {
    eyebrow: "Collaborative task management for focused teams",
    title: "Plan clearly.",
    accent: "Move work forward.",
    description:
      "Create team workspaces, assign clear ownership, track deadlines, and understand progress without switching between scattered tools.",
  },
  metrics: [
    { value: "4", label: "permission roles" },
    { value: "3", label: "task stages" },
    { value: "1", label: "shared workspace" },
  ],
  features: [
    {
      icon: UsersRound,
      title: "Dedicated team workspaces",
      description:
        "Separate projects and teams while keeping members, tasks, announcements, and activity organized in one place.",
    },
    {
      icon: ListChecks,
      title: "Structured task planning",
      description:
        "Define priorities, categories, deadlines, assignees, descriptions, and task status without losing important context.",
    },
    {
      icon: ShieldCheck,
      title: "Role-based permissions",
      description:
        "Use owner, admin, member, and viewer roles to keep collaboration flexible while protecting sensitive actions.",
    },
    {
      icon: LayoutDashboard,
      title: "Focused project overview",
      description:
        "See active work, upcoming deadlines, team ownership, and completion status from a clean operational dashboard.",
    },
    {
      icon: BarChart3,
      title: "Progress analytics",
      description:
        "Understand workload, completion trends, priorities, deadlines, and member contribution through visual reports.",
    },
    {
      icon: BellRing,
      title: "Meaningful team updates",
      description:
        "Keep members aligned with announcements, assignment changes, and deadline-related updates inside each workspace.",
    },
  ],
  workflow: [
    {
      number: "01",
      title: "Create a workspace",
      description:
        "Give every project, department, or client engagement a dedicated place to manage work.",
    },
    {
      number: "02",
      title: "Add your team",
      description:
        "Invite collaborators, assign their role, and make every responsibility visible from the beginning.",
    },
    {
      number: "03",
      title: "Plan and assign",
      description:
        "Create tasks with priorities, categories, due dates, descriptions, and clear ownership.",
    },
    {
      number: "04",
      title: "Track and improve",
      description:
        "Review progress, identify blockers, and use analytics to keep the team moving in the right direction.",
    },
  ],
  roles: [
    {
      name: "Owner",
      description: "Controls the workspace, members, permissions, and critical team actions.",
      badge: "Full control",
    },
    {
      name: "Admin",
      description: "Helps manage members and day-to-day project operations.",
      badge: "Team management",
    },
    {
      name: "Member",
      description: "Creates, updates, and completes work assigned across the team.",
      badge: "Active contributor",
    },
    {
      name: "Viewer",
      description: "Follows project progress without changing operational data.",
      badge: "Read access",
    },
  ],
};

export const previewTasks = [
  {
    title: "Build authentication flow",
    category: "Backend",
    assignee: "VR",
    priority: "High",
    status: "In progress",
  },
  {
    title: "Refine dashboard mobile view",
    category: "Frontend",
    assignee: "AS",
    priority: "Medium",
    status: "Pending",
  },
  {
    title: "Prepare release checklist",
    category: "Planning",
    assignee: "NK",
    priority: "Low",
    status: "Completed",
  },
];

export const previewHighlights = [
  { icon: CheckCircle2, label: "Completed", value: "24" },
  { icon: CalendarClock, label: "Due this week", value: "6" },
  { icon: UsersRound, label: "Active members", value: "8" },
];
