import { motion } from "framer-motion";
import { Crown, Eye, ShieldCheck, UserCog, UserRound } from "lucide-react";
import { landingConfig } from "../../data/taskflowLandingData";

const roleIcons = {
  Owner: Crown,
  Admin: UserCog,
  Member: UserRound,
  Viewer: Eye,
};

const rolePermissions = {
  Owner: [
    "Manage the complete workspace",
    "Invite and remove team members",
    "Assign every available role",
    "Create, update, and delete tasks",
    "Control critical team settings",
  ],
  Admin: [
    "Manage day-to-day team activity",
    "Invite and organize members",
    "Create and assign tasks",
    "Update project workflows",
    "Review team progress",
  ],
  Member: [
    "Create and update tasks",
    "Complete assigned work",
    "Collaborate with team members",
    "Follow project announcements",
    "Track deadlines and priorities",
  ],
  Viewer: [
    "View workspace activity",
    "Read tasks and announcements",
    "Follow project progress",
    "Review deadlines and ownership",
    "Access shared project context",
  ],
};

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
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
    y: 38,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const permissionContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.18,
    },
  },
};

const permissionVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LandingPermissions() {
  const roles = landingConfig.roles;

  return (
    <section
      id="permissions"
      className="relative overflow-hidden bg-[#07090d] px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[950px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.035] blur-[160px]"
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
            Clear access at every level
          </motion.p>

          <motion.h2
            variants={headingVariants}
            className="mt-4 text-3xl font-[650] leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl"
          >
            Give every person
            <span className="block text-zinc-400">
              the right level of control.
            </span>
          </motion.h2>

          <motion.p
            variants={headingVariants}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
          >
            TaskFlow separates workspace control, daily management, active
            contribution, and read-only access through four focused roles.
          </motion.p>
        </motion.div>

        {/* Roles grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
            margin: "0px 0px -80px 0px",
          }}
          className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {roles.map((role, index) => {
            const Icon = roleIcons[role.name] ?? ShieldCheck;
            const permissions = rolePermissions[role.name] ?? [];
            const isRecommended = role.name === "Admin";

            return (
              <motion.article
                key={role.name}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                className={`group relative overflow-hidden rounded-2xl border p-6 ${
                  isRecommended
                    ? "border-emerald-300/25 bg-emerald-300/[0.045]"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                {/* Recommended badge */}
                {isRecommended && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.9,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.55,
                      duration: 0.4,
                    }}
                    className="absolute right-4 top-4 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-200"
                  >
                    Recommended
                  </motion.div>
                )}

                {/* Hover background glow */}
                <motion.div
                  aria-hidden="true"
                  initial={{
                    opacity: 0,
                    scale: 0.75,
                  }}
                  whileHover={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-300/[0.09] blur-3xl"
                />

                {/* Animated top line */}
                <motion.div
                  aria-hidden="true"
                  initial={{
                    scaleX: 0,
                  }}
                  whileHover={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent"
                />

                <div className="relative">
                  {/* Role icon */}
                  <motion.div
                    whileHover={{
                      rotate: -7,
                      scale: 1.1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 18,
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                      isRecommended
                        ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                        : "border-white/10 bg-white/[0.04] text-zinc-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  {/* Number */}
                  <span className="absolute right-0 top-0 text-xs font-medium text-zinc-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="mt-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                        {role.name}
                      </h3>

                      <motion.span
                        whileHover={{
                          scale: 1.04,
                        }}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-400"
                      >
                        {role.badge}
                      </motion.span>
                    </div>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-zinc-400">
                      {role.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-6 h-px bg-white/[0.07]" />

                  {/* Permission list */}
                  <motion.ul
                    variants={permissionContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.4,
                    }}
                    className="space-y-3"
                  >
                    {permissions.map((permission) => (
                      <motion.li
                        key={permission}
                        variants={permissionVariants}
                        className="flex items-start gap-3 text-sm text-zinc-400"
                      >
                        <motion.span
                          whileHover={{
                            scale: 1.15,
                            rotate: -8,
                          }}
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] text-[10px] text-emerald-200"
                        >
                          ✓
                        </motion.span>

                        <span className="leading-5">{permission}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Bottom access indicator */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    whileHover={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="mt-7 flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/10 px-3 py-2.5"
                  >
                    <span className="text-xs text-zinc-500">Access level</span>

                    <span
                      className={`text-xs font-medium ${
                        role.name === "Owner"
                          ? "text-emerald-200"
                          : role.name === "Admin"
                            ? "text-cyan-300"
                            : role.name === "Member"
                              ? "text-violet-300"
                              : "text-zinc-400"
                      }`}
                    >
                      {getAccessLabel(role.name)}
                    </span>
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

function getAccessLabel(roleName) {
  const labels = {
    Owner: "Complete",
    Admin: "Advanced",
    Member: "Standard",
    Viewer: "Read only",
  };

  return labels[roleName] ?? "Standard";
}
