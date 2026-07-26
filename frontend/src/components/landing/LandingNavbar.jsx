import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { landingNavigation } from "../../data/taskflowLandingData";
function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Features");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavigationClick = (label) => {
    setActiveItem(label);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        hasScrolled
          ? "border-white/10 bg-[#07090d]/85 shadow-lg shadow-black/10 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-sm font-bold text-emerald-200"
          >
            TF
          </motion.div>

          <span className="text-lg font-semibold tracking-[-0.02em] text-white">
            TaskFlow
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {landingNavigation.map((item) => {
            const isActive = activeItem === item.label;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavigationClick(item.label)}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                <span className="relative z-10">{item.label}</span>

                {isActive && (
                  <motion.span
                    layoutId="navbar-active-item"
                    className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.07]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {isActive && (
                  <motion.span
                    layoutId="navbar-active-line"
                    className="absolute inset-x-4 -bottom-px h-px bg-emerald-300"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/signin"
              className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/signup"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(110,231,183,0.15)] transition-colors hover:bg-emerald-200"
            >
              Get started
            </Link>
          </motion.div>
        </div>

        {/* Mobile menu button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="close-icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="absolute"
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu-icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="absolute"
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-18 -z-10 bg-black/55 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -16,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-t border-white/10 bg-[#090b10]/95 px-5 py-5 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-1">
                {landingNavigation.map((item, index) => {
                  const isActive = activeItem === item.label;

                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.25,
                      }}
                      onClick={() => handleNavigationClick(item.label)}
                      className={`relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-navbar-active"
                          className="absolute inset-0 border border-emerald-300/15 bg-emerald-300/[0.08]"
                        />
                      )}

                      <span className="relative z-10">{item.label}</span>
                    </motion.a>
                  );
                })}

                <div className="my-3 h-px bg-white/10" />

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-200"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl bg-emerald-300 text-sm font-semibold text-zinc-950"
                  >
                    Get started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default LandingNavbar;
