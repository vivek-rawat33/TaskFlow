import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.12,
    },
  },
};

const heroItemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const previewVariants = {
  hidden: {
    opacity: 0,
    y: 70,
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
      delay: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[#07090d] px-5 pb-20 pt-32 text-white sm:px-6 sm:pb-28 sm:pt-40 lg:px-8">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Background glows */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 24, 0],
          y: [0, -18, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[-120px] top-[280px] h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Eyebrow */}
          <motion.div
            variants={heroItemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-2 text-sm font-medium text-emerald-200"
          >
            <motion.span
              animate={{
                opacity: [1, 0.45, 1],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-full bg-emerald-300"
            />
            Team task management built for focused teams
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={heroItemVariants}
            className="text-balance text-4xl font-[650] leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-[76px]"
          >
            Organize your work.
            <span className="mt-2 block bg-gradient-to-r from-emerald-200 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Move together.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={heroItemVariants}
            className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8"
          >
            Create teams, assign responsibilities, track deadlines, and measure
            progress from one focused workspace designed to keep everyone
            aligned.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={heroItemVariants}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 22,
              }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/signup"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 text-sm font-semibold text-zinc-950 shadow-[0_0_35px_rgba(110,231,183,0.18)] transition-colors hover:bg-emerald-200 sm:w-auto"
              >
                Start managing tasks
                <motion.span
                  className="inline-flex"
                  initial={false}
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.a
              href="#product-preview"
              whileHover={{
                y: -3,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 22,
              }}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-zinc-200 sm:w-auto"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <Play className="h-3 w-3 fill-current" />
              </span>
              Explore dashboard
            </motion.a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={heroItemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-500"
          >
            <span className="flex items-center gap-2">
              <CheckIcon />
              Role-based access
            </span>

            <span className="flex items-center gap-2">
              <CheckIcon />
              Team analytics
            </span>

            <span className="flex items-center gap-2">
              <CheckIcon />
              Deadline tracking
            </span>
          </motion.div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          id="product-preview"
          variants={previewVariants}
          initial="hidden"
          animate="visible"
          style={{
            perspective: 1200,
          }}
          className="relative mx-auto mt-16 max-w-6xl scroll-mt-28 sm:mt-20"
        >
          <div className="absolute inset-x-16 -bottom-8 h-24 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f15] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
            {/* Browser bar */}
            <div className="flex h-12 items-center justify-between border-b border-white/10 bg-white/[0.025] px-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
              </div>

              <div className="rounded-md border border-white/5 bg-black/20 px-5 py-1.5 text-xs text-zinc-500">
                app.taskflow.dev/dashboard
              </div>

              <div className="w-12" />
            </div>

            <div className="grid min-h-[470px] grid-cols-1 md:grid-cols-[210px_1fr]">
              {/* Sidebar */}
              <aside className="hidden border-r border-white/10 bg-black/10 p-4 md:block">
                <div className="mb-7 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-300 text-xs font-bold text-zinc-950">
                    TF
                  </div>

                  <span className="font-semibold text-white">TaskFlow</span>
                </div>

                <SidebarItem label="Overview" active />
                <SidebarItem label="Tasks" />
                <SidebarItem label="Teams" />
                <SidebarItem label="Analytics" />
                <SidebarItem label="Announcements" />
              </aside>

              {/* Main dashboard */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-zinc-500">Workspace</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white">
                      Product Development
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950"
                  >
                    Add task
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <StatCard label="Total tasks" value="28" />
                  <StatCard label="In progress" value="12" />
                  <StatCard label="Completed" value="19" />
                  <StatCard label="Due soon" value="4" />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                  {/* Tasks */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Current tasks
                      </h3>

                      <span className="text-xs text-zinc-500">View all</span>
                    </div>

                    <div className="space-y-2">
                      <TaskRow
                        title="Complete authentication flow"
                        category="Backend"
                        status="In progress"
                        priority="High"
                      />

                      <TaskRow
                        title="Improve mobile dashboard"
                        category="Frontend"
                        status="Pending"
                        priority="Medium"
                      />

                      <TaskRow
                        title="Create analytics charts"
                        category="Feature"
                        status="Completed"
                        priority="High"
                      />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-sm font-semibold text-white">
                      Team progress
                    </p>

                    <div className="mt-5 flex items-end gap-2">
                      {[44, 64, 52, 78, 68, 88, 74].map((height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: `${height}px`,
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.65,
                            delay: 1.15 + index * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500/40 to-emerald-300"
                        />
                      ))}
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Tasks completed</span>
                        <span className="font-medium text-emerald-200">
                          78%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "78%" }}
                          transition={{
                            duration: 1,
                            delay: 1.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-emerald-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-[10px] text-emerald-200">
      ✓
    </span>
  );
}

function SidebarItem({ label, active = false }) {
  return (
    <div
      className={`mb-1 rounded-lg px-3 py-2 text-sm ${
        active ? "bg-emerald-300/10 text-emerald-200" : "text-zinc-500"
      }`}
    >
      {label}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function TaskRow({ title, category, status, priority }) {
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
    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/5 bg-black/10 p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-200">{title}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-zinc-500">{category}</span>

          <span className={`rounded-full px-2 py-0.5 ${statusClasses[status]}`}>
            {status}
          </span>
        </div>
      </div>

      <span
        className={`self-start text-[11px] font-medium ${priorityClasses[priority]}`}
      >
        {priority}
      </span>
    </div>
  );
}

export default LandingHero;
