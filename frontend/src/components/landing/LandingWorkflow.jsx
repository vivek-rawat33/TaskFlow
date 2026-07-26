import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { landingConfig } from "../../data/taskflowLandingData";
import { useLandingMotion } from "../../hooks/useLandingMotion";

export default function LandingWorkflow() {
  const { reduceMotion, allowDesktopMotion } = useLandingMotion();

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

  const workflowContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.3,
      },
    },
  };

  const stepVariants = {
    hidden: reduceMotion
      ? {
          opacity: 1,
          y: 0,
          scale: 1,
        }
      : {
          opacity: 0,
          y: 32,
          scale: 0.97,
        },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const workflow = landingConfig.workflow;

  return (
    <section
      id="workflow"
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
            A simple operating flow
          </motion.p>

          <motion.h2
            variants={headingVariants}
            className="mt-4 text-3xl font-[650] leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl"
          >
            From workspace setup
            <span className="block text-zinc-400">to measurable progress.</span>
          </motion.h2>

          <motion.p
            variants={headingVariants}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
          >
            TaskFlow gives your team a clear process for creating work,
            assigning ownership, and tracking execution.
          </motion.p>
        </motion.div>

        <div className="relative mt-16">
          {/* Desktop base line */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-white/10 lg:block"
          />

          {/* Desktop animated line */}
          {allowDesktopMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                duration: 1.25,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px origin-left bg-gradient-to-r from-emerald-300/30 via-emerald-300 to-emerald-300/30 lg:block"
            />
          )}

          {/* Desktop moving highlight */}
          {allowDesktopMotion && (
            <motion.div
              aria-hidden="true"
              initial={{
                left: "12.5%",
                opacity: 0,
              }}
              whileInView={{
                left: "87.5%",
                opacity: [0, 1, 1, 0],
              }}
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                ease: "easeInOut",
              }}
              className="absolute top-[29px] hidden h-[3px] w-10 -translate-x-1/2 rounded-full bg-emerald-200 blur-[2px] lg:block"
            />
          )}

          {/* Mobile base line */}
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-8 top-8 w-px bg-white/10 lg:hidden"
          />

          {/* Mobile line growth */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{
              once: true,
              amount: 0.12,
            }}
            transition={{
              duration: reduceMotion ? 0.55 : 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-8 left-8 top-8 w-px origin-top bg-gradient-to-b from-emerald-300 via-emerald-300/60 to-emerald-300/10 lg:hidden"
          />

          <motion.div
            variants={workflowContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: reduceMotion ? 0.05 : 0.12,
              margin: "0px 0px -60px 0px",
            }}
            className="relative grid gap-5 lg:grid-cols-4 lg:gap-6"
          >
            {workflow.map((step, index) => (
              <motion.article
                key={step.number}
                variants={stepVariants}
                whileHover={
                  allowDesktopMotion
                    ? {
                        y: -7,
                      }
                    : undefined
                }
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
                className="group relative grid grid-cols-[64px_1fr] gap-5 lg:block"
              >
                {/* Number node */}
                <motion.div
                  whileHover={
                    allowDesktopMotion
                      ? {
                          scale: 1.08,
                          rotate: -4,
                        }
                      : undefined
                  }
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                  }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-[#0c1110] text-sm font-semibold text-emerald-200 shadow-[0_0_0_6px_#07090d] lg:mx-auto"
                >
                  {step.number}

                  {/* Desktop-only pulse */}
                  {allowDesktopMotion && (
                    <motion.span
                      aria-hidden="true"
                      initial={{
                        opacity: 0,
                        scale: 0.75,
                      }}
                      whileInView={{
                        opacity: [0, 0.45, 0],
                        scale: [0.75, 1.35, 1.55],
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: 0.45 + index * 0.15,
                      }}
                      className="absolute inset-0 -z-10 rounded-2xl border border-emerald-300/30"
                    />
                  )}
                </motion.div>

                {/* Step card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:mt-8 lg:min-h-[215px] lg:p-6">
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                        Step {step.number}
                      </span>

                      {allowDesktopMotion && index < workflow.length - 1 && (
                        <motion.div
                          animate={{
                            x: [0, 4, 0],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.15,
                          }}
                          className="hidden text-emerald-300/50 lg:block"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </div>

                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
