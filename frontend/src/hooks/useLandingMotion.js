import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "./use-mobile";

export function useLandingMotion() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const reduceMotion = isMobile || prefersReducedMotion;
  const allowDesktopMotion = !reduceMotion;

  return {
    isMobile,
    reduceMotion,
    allowDesktopMotion,
  };
}
