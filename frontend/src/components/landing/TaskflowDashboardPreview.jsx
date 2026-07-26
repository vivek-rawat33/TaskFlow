import {
  BarChart3,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import {
  previewHighlights,
  previewTasks,
} from "../../data/taskflowLandingData";

const priorityStyles = {
  High: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  Medium: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  Low: "border-sky-400/20 bg-sky-400/10 text-sky-200",
};

const statusStyles = {
  "In progress": "text-amber-200",
  Pending: "text-zinc-400",
  Completed: "text-emerald-200",
};

function TinyChart() {
  const bars = [38, 52, 44, 68, 58, 78, 64, 88, 76, 92, 84, 98];

  return (
    <div className="flex h-24 items-end gap-1.5" aria-label="Completion trend preview">
      {bars.map((height, index) => (
        <span
          // This is a static visual preview, so an index key is stable here.
          key={index}
          className="min-w-0 flex-1 rounded-t bg-gradient-to-t from-emerald-400/25 to-emerald-200/80"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

export default function TaskflowDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-emerald-300/5 blur-3xl" />
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0e13] shadow-[0_35px_120px_rgba(0,0,0,0.55)]">
        <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-400/70" />
            <span className="size-2.5 rounded-full bg-amber-300/70" />
            <span className="size-2.5 rounded-full bg-emerald-300/70" />
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-500 sm:text-xs">
            app.taskflow.dev/dashboard
          </div>
          <div className="w-12" />
        </div>

        <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-[210px_1fr]">
          <aside className="hidden border-r border-white/10 bg-black/10 p-4 lg:block">
            <div className="mb-7 flex items-center gap-3 px-2">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-300 text-xs font-black text-zinc-950">
                TF
              </span>
              <div>
                <p className="text-sm font-semibold text-white">TaskFlow</p>
                <p className="text-[11px] text-zinc-500">Product team</p>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5 text-white">
                <BarChart3 className="size-4 text-emerald-200" />
                Overview
              </div>
              {[
                ["Tasks", "28"],
                ["Members", "8"],
                ["Announcements", "3"],
              ].map(([label, count]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-zinc-500"
                >
                  <span>{label}</span>
                  <span className="text-xs">{count}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Team progress</span>
                <span className="text-xs font-semibold text-emerald-200">78%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-emerald-300" />
              </div>
            </div>
          </aside>

          <main className="min-w-0 p-4 sm:p-6 lg:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/70">
                  Product development
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Team overview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="grid size-9 place-items-center rounded-xl border border-white/10 text-zinc-400">
                  <Search className="size-4" />
                </button>
                <button className="grid size-9 place-items-center rounded-xl border border-white/10 text-zinc-400">
                  <Bell className="size-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 sm:text-sm">
                  <Plus className="size-4" /> New task
                </button>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {previewHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="grid size-8 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
                        <Icon className="size-4" />
                      </span>
                      <MoreHorizontal className="size-4 text-zinc-600" />
                    </div>
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-white">Current tasks</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">Work requiring team attention</p>
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs text-zinc-400">
                    All tasks <ChevronDown className="size-3" />
                  </button>
                </div>

                <div className="divide-y divide-white/[0.07]">
                  {previewTasks.map((task) => (
                    <div key={task.title} className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-100">{task.title}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">{task.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${priorityStyles[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`text-[11px] font-medium ${statusStyles[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                      <span className="grid size-7 place-items-center rounded-full border border-white/10 bg-white/5 text-[9px] font-bold text-zinc-300">
                        {task.assignee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Completion trend</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">Last 12 weeks</p>
                  </div>
                  <span className="rounded-lg bg-emerald-300/10 px-2 py-1 text-[10px] font-semibold text-emerald-200">
                    +18.4%
                  </span>
                </div>
                <TinyChart />
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xl font-semibold text-white">86%</p>
                    <p className="text-[10px] text-zinc-500">On-time completion</p>
                  </div>
                  <div className="flex -space-x-2">
                    {["VR", "AS", "NK", "+5"].map((member) => (
                      <span
                        key={member}
                        className="grid size-7 place-items-center rounded-full border-2 border-[#101319] bg-zinc-800 text-[8px] font-semibold text-zinc-300"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
