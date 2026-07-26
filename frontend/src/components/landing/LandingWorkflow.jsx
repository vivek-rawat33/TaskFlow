import { ArrowUpRight } from "lucide-react";
import { landingConfig } from "../../data/taskflowLandingData";

export default function LandingWorkflow() {
  return (
    <section id="workflow" className="scroll-mt-20 bg-[#07090d] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200/80">Simple by design</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
              From workspace setup to measurable progress.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              A clear workflow reduces coordination overhead and makes it obvious what needs attention next.
            </p>
            <a href="#permissions" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200">
              See permission roles <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div className="relative">
            <div className="absolute bottom-10 left-[23px] top-10 w-px bg-gradient-to-b from-emerald-300/50 via-white/10 to-transparent" />
            <div className="space-y-4">
              {landingConfig.workflow.map((step) => (
                <article key={step.number} className="relative grid grid-cols-[48px_1fr] gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04] sm:gap-6 sm:p-7">
                  <span className="relative z-10 grid size-12 place-items-center rounded-2xl border border-emerald-300/20 bg-[#0d1514] text-xs font-black text-emerald-200">
                    {step.number}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
