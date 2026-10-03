'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface PortalTransitionProps {
  children: React.ReactNode;
}

export const PortalTransition: React.FC<PortalTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          shouldReduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0.92, y: 6 }
        }
        animate={{ opacity: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0.92, y: -6 }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 0.24,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
