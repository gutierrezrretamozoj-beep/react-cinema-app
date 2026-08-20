import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "@/shared/components";

export const PageShell = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};
