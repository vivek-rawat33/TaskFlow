import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

const previewVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.96,
    rotateX: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const sidebarItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Tasks",
    icon: ListTodo,
  },
  {
    label: "Teams",
    icon: Users,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
];

const tasks = [
  {
    title: "Complete authentication flow",
    category: "Backend",
    status: "In progress",
    priority: "High",
    assignee: "VR",
  },
  {
    title: "Improve mobile dashboard",
    category: "Frontend",
    status: "Pending",
    priority: "Medium",
    assignee: "AS",
  },
  {
    title: "Create analytics charts",
    category: "Feature",
    status: "Completed",
    priority: "High",
    assignee: "RK",
  },
  {
    title: "Review onboarding experience",
    category: "UI",
    status: "Pending",
    priority: "Low",
    assignee: "NS",
  },
];

const chartBars = [38, 55, 46, 72, 61, 88, 76];

function TaskFlowDashboardPreview() {
  return (
    <section
      id="product-preview"
      className="relative overflow-hidden bg-[#07090d] px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.07] blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-emerald-300">
            One focused workspace
          </p>

          <h2 className="mt-4 text-3xl font-[650] leading-tight tracking-[-0.025em] text-white sm:text-5xl">
            See every task, deadline, and update clearly.
          </h2>

          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            TaskFlow brings team activity, task ownership, deadlines, and
            progress analytics into one organized dashboard.
          </p>
        </motion.div>

        {/* Animated dashboard */}
        <div
          className="relative mx-auto max-w-6xl"
          style={{
            perspective: "1400px",
          }}
        >
          {/* Glow under dashboard */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.2,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="absolute inset-x-20 -bottom-8 h-32 rounded-full bg-emerald-300/10 blur-3xl"
          />

          <motion.div
            variants={previewVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.18,
              margin: "0px 0px -80px 0px",
            }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e14] shadow-[0_40px_130px_rgba(0,0,0,0.7)]"
          >
            {/* Browser toolbar */}
            <motion.div
              variants={childVariants}
              className="flex h-12 items-center justify-between border-b border-white/10 bg-white/[0.025] px-4"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
              </div>

              <div className="hidden rounded-md border border-white/5 bg-black/20 px-6 py-1.5 text-xs text-zinc-500 sm:block">
                app.taskflow.dev/dashboard
              </div>

              <div className="w-12" />
            </motion.div>

            <div className="grid min-h-[580px] grid-cols-1 md:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <motion.aside
                variants={childVariants}
                className="hidden border-r border-white/10 bg-black/10 p-4 md:block"
              >
                <div className="mb-8 flex items-center gap-3 px-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300 text-xs font-bold text-zinc-950">
                    TF
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">TaskFlow</p>
                    <p className="text-[11px] text-zinc-500">
                      Product workspace
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {sidebarItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.label}
                        initial={{
                          opacity: 0,
                          x: -12,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: 0.45 + index * 0.07,
                        }}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                          item.active
                            ? "bg-emerald-300/10 text-emerald-200"
                            : "text-zinc-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500">
                    <Settings className="h-4 w-4" />
                    Settings
                  </div>
                </div>
              </motion.aside>

              {/* Dashboard content */}
              <div className="min-w-0 p-4 sm:p-6">
                {/* Header */}
                <motion.div
                  variants={childVariants}
                  className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm text-zinc-500">Workspace overview</p>

                    <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                      Product Development
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-zinc-400"
                    >
                      <Bell className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-semibold text-zinc-950"
                    >
                      <Plus className="h-4 w-4" />
                      Add task
                    </button>
                  </div>
                </motion.div>

                {/* Stats cards */}
                <motion.div
                  variants={childVariants}
                  className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
                >
                  <StatCard
                    label="Total tasks"
                    value="28"
                    change="+6 this week"
                  />

                  <StatCard
                    label="In progress"
                    value="12"
                    change="43% of total"
                  />

                  <StatCard
                    label="Completed"
                    value="19"
                    change="+14% this month"
                  />

                  <StatCard
                    label="Due soon"
                    value="4"
                    change="Next 3 days"
                    warning
                  />
                </motion.div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                  {/* Task table */}
                  <motion.div
                    variants={childVariants}
                    className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025]"
                  >
                    <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Current tasks
                        </h4>

                        <p className="mt-1 text-xs text-zinc-500">
                          Tasks assigned across the product team
                        </p>
                      </div>

                      <div className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3">
                        <Search className="h-3.5 w-3.5 text-zinc-500" />

                        <span className="text-xs text-zinc-600">
                          Search tasks
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-white/[0.06]">
                      {tasks.map((task, index) => (
                        <motion.div
                          key={task.title}
                          initial={{
                            opacity: 0,
                            x: -18,
                          }}
                          whileInView={{
                            opacity: 1,
                            x: 0,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.65 + index * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <TaskRow task={task} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Progress card */}
                  <motion.div
                    variants={childVariants}
                    className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Team progress
                        </h4>

                        <p className="mt-1 text-xs text-zinc-500">
                          Completed tasks this week
                        </p>
                      </div>

                      <button type="button" className="text-zinc-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Animated chart */}
                    <div className="mt-8 flex h-32 items-end gap-2">
                      {chartBars.map((height, index) => (
                        <div
                          key={index}
                          className="flex h-full flex-1 items-end rounded-md bg-white/[0.025]"
                        >
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            whileInView={{
                              height: `${height}%`,
                              opacity: 1,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.7,
                              delay: 0.8 + index * 0.07,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="w-full rounded-md bg-gradient-to-t from-emerald-500/30 to-emerald-300"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-between text-[10px] text-zinc-600">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-7">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          Weekly completion
                        </span>

                        <span className="text-xs font-medium text-emerald-200">
                          78%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "78%" }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.1,
                            delay: 0.95,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-emerald-300"
                        />
                      </div>
                    </div>

                    {/* Completion summary */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 1.05,
                        duration: 0.45,
                      }}
                      className="mt-6 flex items-center gap-3 rounded-lg border border-emerald-300/10 bg-emerald-300/[0.05] p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-300/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-zinc-200">
                          19 tasks completed
                        </p>

                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          14% improvement from last week
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, change, warning = false }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
    >
      <p className="text-xs text-zinc-500">{label}</p>

      <p className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-white">
        {value}
      </p>

      <p
        className={`mt-2 text-[11px] ${
          warning ? "text-amber-300" : "text-zinc-600"
        }`}
      >
        {change}
      </p>
    </motion.div>
  );
}

function TaskRow({ task }) {
  const statusClasses = {
    "In progress": "bg-blue-400/10 text-blue-300",
    Pending: "bg-amber-400/10 text-amber-300",
    Completed: "bg-emerald-400/10 text-emerald-300",
  };

  const priorityClasses = {
    High: "text-red-300",
    Medium: "text-violet-300",
    Low: "text-blue-300",
  };

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-medium text-zinc-300">
          {task.assignee}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-200">
            {task.title}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-600">{task.category}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${statusClasses[task.status]}`}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>

      <span
        className={`text-[11px] font-medium ${priorityClasses[task.priority]}`}
      >
        {task.priority}
      </span>
    </div>
  );
}

export default TaskFlowDashboardPreview;
