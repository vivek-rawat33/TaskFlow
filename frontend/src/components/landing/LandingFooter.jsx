import { GitBranch } from "lucide-react";
import { landingConfig } from "../../data/taskflowLandingData";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#07090d] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/[0.08] text-xs font-black text-emerald-200">
            {landingConfig.brand.mark}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{landingConfig.brand.name}</p>
            <p className="text-xs text-zinc-600">Plan clearly. Move work forward.</p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs text-zinc-500">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#workflow" className="transition hover:text-white">Workflow</a>
          <a
            href="https://github.com/vivek-rawat33/task-manager"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-white"
          >
            <GitBranch className="size-3.5" /> GitHub
          </a>
        </div>

        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} TaskFlow</p>
      </div>
    </footer>
  );
}
