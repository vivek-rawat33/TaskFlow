import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      duration={1800}
      closeButton={false}
      expand={false}
      visibleToasts={3}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "hsl(var(--card))",
        "--normal-text": "hsl(var(--card-foreground))",
        "--normal-border": "hsl(var(--border))",
        "--border-radius": "0.75rem",
      }}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border shadow-lg bg-card text-card-foreground px-4 py-3",
          title: "font-semibold text-sm",
          description: "text-muted-foreground text-xs",
          icon: "mr-2",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
