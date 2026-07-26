import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { landingConfig } from "../../data/taskflowLandingData";

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { brand, navigation, routes } = landingConfig;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="TaskFlow home">
          <span className="grid size-9 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-xs font-black tracking-tight text-emerald-200 shadow-[0_0_28px_rgba(110,231,183,0.12)]">
            {brand.mark}
          </span>
          <span className="text-base font-semibold tracking-tight text-white">{brand.name}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to={routes.signIn}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to={routes.signUp}
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200"
          >
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-white/10 text-zinc-200 md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#07090d] px-4 py-5 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <Link
                to={routes.signIn}
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Sign in
              </Link>
              <Link
                to={routes.signUp}
                className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-zinc-950"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
