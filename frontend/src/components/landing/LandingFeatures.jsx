import { landingConfig } from "../../data/taskflowLandingData";

export default function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-white/[0.07] bg-[#090c11] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/80">Everything in context</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
            One workspace for the entire task lifecycle.
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-400">
            TaskFlow keeps planning, ownership, access control, deadlines, and progress reporting connected instead of spreading them across multiple tools.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {landingConfig.features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="group relative bg-[#0b0e13] p-6 transition hover:bg-[#0e1218] sm:p-8">
                <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-emerald-300/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                <span className="grid size-11 place-items-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-200">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-8 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
