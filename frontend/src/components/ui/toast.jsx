import { CircleCheck, CircleX, TriangleAlert, Info } from "lucide-react";
import { toast } from "sonner";

// Small colored badge behind each icon — reads as "premium SaaS" (Linear/Vercel
// style) instead of a flat colored icon or a heavy left border.
const IconBadge = ({ icon: Icon, tone }) => (
  <div
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}
  >
    <Icon className="h-4 w-4" strokeWidth={2.25} />
  </div>
);

// Base look shared by every toast. Every color here has a light AND dark
// value — that's what was missing before, so text just inherited whatever
// the light-mode default was and became invisible.
const baseClassNames = {
  toast:
    "!items-start !gap-3 !p-4 !rounded-2xl !border !backdrop-blur-xl " +
    "!bg-white/90 !border-zinc-200/70 " +
    "!shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_40px_rgba(0,0,0,0.08)] " +
    "dark:!bg-zinc-900/90 dark:!border-white/10 " +
    "dark:!shadow-[0_2px_8px_rgba(0,0,0,0.3),0_20px_48px_rgba(0,0,0,0.55)]",
  title:
    "!text-[13.5px] !font-semibold !leading-snug !text-zinc-900 dark:!text-zinc-50",
  description:
    "!text-[13px] !leading-relaxed !mt-0.5 !text-zinc-500 dark:!text-zinc-400",
  icon: "!mt-0 !mr-0.5",
  closeButton:
    "!bg-zinc-100 !border-zinc-200 !text-zinc-400 " +
    "hover:!bg-zinc-200 hover:!text-zinc-600 " +
    "dark:!bg-white/5 dark:!border-white/10 dark:!text-zinc-500 " +
    "dark:hover:!bg-white/10 dark:hover:!text-zinc-200 !transition-colors",
};

// Per-type accents: a faint tinted border (not a heavy solid one) plus the
// badge color. Subtle > loud for a premium feel.
const tones = {
  success: {
    border: "!border-emerald-500/25 dark:!border-emerald-400/20",
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
  },
  error: {
    border: "!border-red-500/25 dark:!border-red-400/20",
    badge: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400",
  },
  warning: {
    border: "!border-amber-500/25 dark:!border-amber-400/20",
    badge:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  },
  info: {
    border: "!border-sky-500/25 dark:!border-sky-400/20",
    badge: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400",
  },
};

const makeToast = (Icon, tone) => (title, description) =>
  toast(title, {
    description,
    icon: <IconBadge icon={Icon} tone={tones[tone].badge} />,
    classNames: {
      ...baseClassNames,
      toast: `${baseClassNames.toast} ${tones[tone].border}`,
    },
  });

export const notify = {
  success: makeToast(CircleCheck, "success"),
  error: makeToast(CircleX, "error"),
  warning: makeToast(TriangleAlert, "warning"),
  info: makeToast(Info, "info"),
};
