import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { landingConfig } from "../../data/taskflowLandingData";
import { useLandingMotion } from "../../hooks/useLandingMotion";

export default function LandingCta() {
  const { reduceMotion, allowDesktopMotion } = useLandingMotion();

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 12 : 30,
      scale: reduceMotion ? 1 : 0.98,
      filter: reduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "none",
      transition: {
        duration: reduceMotion ? 0.3 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-[#07090d] px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Desktop-only background glow */}
      {allowDesktopMotion && (
        <>
          <motion.div
            aria-hidden="true"
            animate={{
              opacity: [0.3, 0.55, 0.3],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.1] blur-[130px]"
          />

          <motion.div
            aria-hidden="true"
            animate={{
              x: [-20, 20, -20],
              y: [10, -10, 10],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute right-[-100px] top-10 h-[260px] w-[260px] rounded-full bg-violet-500/[0.08] blur-[110px]"
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: reduceMotion ? 0.15 : 0.35,
          }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center sm:px-10 sm:py-18 lg:px-16 lg:py-20"
        >
          {/* Desktop-only inner glow */}
          {allowDesktopMotion && (
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: [0.25, 0.45, 0.25],
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/[0.07] blur-[100px]"
            />
          )}

          {/* Desktop-only top line */}
          {allowDesktopMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-x-16 top-0 h-px origin-center bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
            />
          )}

          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-emerald-300">
              Start building better workflows
            </p>

            <h2 className="mt-5 text-3xl font-[650] leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl">
              Give your team one place
              <span className="block text-zinc-400">
                to plan, track, and deliver.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Create your TaskFlow workspace, invite your team, and start
              managing responsibilities without scattered tools or unclear
              ownership.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Role-based collaboration
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Task and deadline tracking
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Team progress analytics
              </span>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div
                whileHover={
                  allowDesktopMotion
                    ? {
                        y: -3,
                        scale: 1.02,
                      }
                    : undefined
                }
                whileTap={{
                  scale: reduceMotion ? 0.99 : 0.97,
                }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 22,
                }}
                className="w-full sm:w-auto"
              >
                <Link
                  to={landingConfig.routes.signUp}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 text-sm font-semibold text-zinc-950 shadow-[0_0_35px_rgba(110,231,183,0.16)] transition-colors hover:bg-emerald-200 sm:w-auto"
                >
                  Create your workspace
                  {allowDesktopMotion ? (
                    <motion.span
                      animate={{
                        x: [0, 4, 0],
                      }}
                      transition={{
                        duration: 1.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="inline-flex"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Link>
              </motion.div>

              <motion.div
                whileHover={
                  allowDesktopMotion
                    ? {
                        y: -3,
                      }
                    : undefined
                }
                whileTap={{
                  scale: reduceMotion ? 0.99 : 0.97,
                }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 22,
                }}
                className="w-full sm:w-auto"
              >
                <Link
                  to={landingConfig.routes.signIn}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07] sm:w-auto"
                >
                  Sign in to TaskFlow
                </Link>
              </motion.div>
            </div>

            <p className="mt-6 text-xs text-zinc-600">
              Set up your workspace and invite your team when you are ready.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
