import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { landingNavigation } from "../../data/taskflowLandingData";
import { useLandingMotion } from "../../hooks/useLandingMotion";

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Features");
  const [hasScrolled, setHasScrolled] = useState(false);
  const { reduceMotion } = useLandingMotion();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleNavigationClick = (label) => {
    setActiveItem(label);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        hasScrolled || mobileMenuOpen
          ? "border-white/10 bg-[#07090d]/95"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
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
                    layoutId="desktop-navbar-active"
                    className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.07]"
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

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/signin"
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200"
          >
            Get started
          </Link>
        </div>

        {/* Optimized mobile button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 md:hidden"
        >
          <motion.span
            animate={{
              rotate: mobileMenuOpen ? 90 : 0,
              opacity: mobileMenuOpen ? 0 : 1,
            }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.15,
            }}
            className="absolute"
          >
            <Menu className="h-5 w-5" />
          </motion.span>

          <motion.span
            animate={{
              rotate: mobileMenuOpen ? 0 : -90,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.15,
            }}
            className="absolute"
          >
            <X className="h-5 w-5" />
          </motion.span>
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[72px] -z-10 bg-black/60"
            />

            <div className="border-t border-white/10 bg-[#090b10] px-5 py-5 shadow-xl">
              <div className="mx-auto flex max-w-7xl flex-col gap-1">
                {landingNavigation.map((item) => {
                  const isActive = activeItem === item.label;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => handleNavigationClick(item.label)}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-emerald-300/[0.08] text-white"
                          : "text-zinc-400 active:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}

                <div className="my-3 h-px bg-white/10" />

                <div className="grid grid-cols-2 gap-3">
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
