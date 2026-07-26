import { motion } from "framer-motion";
import { landingConfig } from "../../data/taskflowLandingData";

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const headingVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#07090d] px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.035] blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.4,
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

        {/* Feature grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
            margin: "0px 0px -80px 0px",
          }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {landingConfig.features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7"
              >
                {/* Hover glow */}
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

                {/* Animated top border */}
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

                <div className="relative">
                  {/* Icon */}
                  <motion.div
                    whileHover={{
                      rotate: -6,
                      scale: 1.08,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-300"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  {/* Feature number */}
                  <span className="absolute right-0 top-0 text-xs font-medium text-zinc-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {feature.description}
                  </p>

                  {/* Bottom detail */}
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
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
