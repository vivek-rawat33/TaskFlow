import { Check } from "lucide-react";
import { landingConfig } from "../../data/taskflowLandingData";

const roleCapabilities = {
  Owner: ["Manage workspace", "Manage members", "Control permissions"],
  Admin: ["Manage members", "Create and assign tasks", "Publish updates"],
  Member: [
    "Create and update tasks",
    "Complete assigned work",
    "Follow team activity",
  ],
  Viewer: ["View tasks and analytics", "Read announcements", "Follow progress"],
};

export default function LandingPermissions() {
  return (
    <section
      id="permissions"
      className="scroll-mt-20 border-y border-white/[0.07] bg-[#090c11] px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/80">
            Access without confusion
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
            Give everyone the access they need.
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-400">
            TaskFlow separates workspace control, operational management,
            contribution, and read-only visibility through four understandable
            roles.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {landingConfig.roles.map((role, index) => (
            <article
              key={role.name}
              className={`rounded-3xl border p-6 ${
                index === 0
                  ? "border-emerald-300/25 bg-emerald-300/[0.055]"
                  : "border-white/10 bg-white/[0.025]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Role
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {role.name}
                  </h3>
                </div>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                  {role.badge}
                </span>
              </div>
              <p className="mt-5 min-h-16 text-sm leading-6 text-zinc-500">
                {role.description}
              </p>
              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                {roleCapabilities[role.name].map((capability) => (
                  <div
                    key={capability}
                    className="flex items-center gap-2 text-xs text-zinc-300"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-emerald-300/10 text-emerald-200">
                      <Check className="size-3" />
                    </span>
                    {capability}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
