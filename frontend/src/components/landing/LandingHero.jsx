import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { landingConfig } from "../../data/taskflowLandingData";
import TaskflowDashboardPreview from "./TaskflowDashboardPreview";

export default function LandingHero() {
  const { hero, metrics, routes } = landingConfig;

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 sm:pt-40 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#07090d]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-155 w-225 -translate-x-1/2 rounded-full bg-emerald-300/8 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[64px_64px] mask-[linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
            {hero.eyebrow}
          </div>

          <h1 className="text-balance text-4xl font-[650] leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {hero.title}
            <span className="block bg-linear-to-r from-emerald-200 via-white to-violet-200 bg-clip-text text-transparent">
              {hero.accent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            {hero.description}
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to={routes.signUp}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200"
            >
              Start managing tasks
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#product-preview"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/6"
            >
              <PlayCircle className="size-4 text-emerald-200" />
              Explore the workspace
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            {["No credit card", "Fast team setup", "Role-based access"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-300" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div id="product-preview" className="mt-16 scroll-mt-24 sm:mt-20">
          <TaskflowDashboardPreview />
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/2 px-2 py-5 sm:px-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-2 text-center sm:px-6">
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-1 text-[10px] text-zinc-500 sm:text-xs">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
