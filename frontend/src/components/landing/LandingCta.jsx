import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { landingConfig } from "../../data/taskflowLandingData";

export default function LandingCta() {
  return (
    <section className="relative overflow-hidden bg-[#07090d] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/[0.07] blur-[120px]" />
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.065] to-white/[0.025] px-6 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:px-12 sm:py-20">
        <div className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/80">Bring clarity to the team</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Turn scattered tasks into coordinated progress.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
          Create your TaskFlow workspace, invite your team, and give every task a clear owner, deadline, and next step.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={landingConfig.routes.signUp}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200"
          >
            Create your workspace
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to={landingConfig.routes.signIn}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            Sign in to TaskFlow
          </Link>
        </div>
      </div>
    </section>
  );
}
