import { motion } from "framer-motion";
import { landingConfig } from "../../data/taskflowLandingData";
import { useLandingMotion } from "../../hooks/useLandingMotion";

export default function LandingFeatures() {
  const { reduceMotion, allowDesktopMotion } = useLandingMotion();

  const sectionVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0.025 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const headingVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 10 : 24,
      filter: reduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration: reduceMotion ? 0.3 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 12 : 36,
      scale: reduceMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0.28 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#07090d] px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Desktop-only background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.035] blur-[150px] md:block"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: reduceMotion ? 0.2 : 0.4,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={headingVariants}
            className="text-sm font-medium uppercase tracking-[0.14em] text-emerald-300"
          >
            Everything your team needs
          </motion.p>

          <motion.h2
            variants={headingVariants}
            className="mt-4 text-3xl font-[650] leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl"
          >
            Built to keep work organized,
            <span className="block text-zinc-400">
              visible, and moving forward.
            </span>
          </motion.h2>

          <motion.p
            variants={headingVariants}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
          >
            Manage teams, assign responsibilities, monitor progress, and keep
            every project aligned from one focused workspace.
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: reduceMotion ? 0.05 : 0.12,
            margin: "0px 0px -60px 0px",
          }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {landingConfig.features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={
                  allowDesktopMotion
                    ? {
                        y: -8,
                        scale: 1.01,
                      }
                    : undefined
                }
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7"
              >
                {/* Desktop-only hover glow */}
                {allowDesktopMotion && (
                  <motion.div
                    aria-hidden="true"
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    whileHover={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-300/[0.08] blur-3xl"
                  />
                )}

                {/* Desktop-only animated border */}
                {allowDesktopMotion && (
                  <motion.div
                    aria-hidden="true"
                    initial={{
                      scaleX: 0,
                    }}
                    whileHover={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
                  />
                )}

                <div className="relative">
                  {/* Icon */}
                  <motion.div
                    whileHover={
                      allowDesktopMotion
                        ? {
                            rotate: -6,
                            scale: 1.08,
                          }
                        : undefined
                    }
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-300"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  <span className="absolute right-0 top-0 text-xs font-medium text-zinc-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {feature.description}
                  </p>

                  {/* Desktop-only hover detail */}
                  {allowDesktopMotion && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      whileHover={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-300"
                    >
                      <span>Explore feature</span>
                      <span aria-hidden="true">→</span>
                    </motion.div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
