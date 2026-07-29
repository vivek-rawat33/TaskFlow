import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CircleCheck,
  Info,
  TriangleAlert,
  CircleX,
  Loader2,
} from "lucide-react";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      duration={1800}
      visibleToasts={3}
      closeButton={false}
      expand={false}
      richColors={false}
      offset={20}
      gap={12}
      icons={{
        success: <CircleCheck className="h-5 w-5 text-emerald-500" />,
        error: <CircleX className="h-5 w-5 text-red-500" />,
        warning: <TriangleAlert className="h-5 w-5 text-amber-500" />,
        info: <Info className="h-5 w-5 text-sky-500" />,
        loading: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-2xl transition-all duration-200 data-[mounted=true]:animate-in data-[mounted=true]:fade-in data-[mounted=true]:slide-in-from-top-2 data-[removed=true]:animate-out data-[removed=true]:fade-out data-[removed=true]:slide-out-to-right-full hover:-translate-y-0.5",

          title: "text-sm font-semibold",

          description: "mt-1 text-xs leading-relaxed text-muted-foreground",

          content: "flex-1",

          icon: "mt-0.5 shrink-0",

          success:
            "border-l-4 border-l-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.12)]",

          error:
            "border-l-4 border-l-red-500 shadow-[0_0_30px_rgba(239,68,68,0.12)]",

          warning:
            "border-l-4 border-l-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.12)]",

          info: "border-l-4 border-l-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.12)]",

          actionButton:
            "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",

          cancelButton:
            "rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80",

          closeButton:
            "rounded-md border border-border bg-background text-muted-foreground hover:bg-muted",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
