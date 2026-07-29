import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

export function AnimatedCounter({ value, prefix = "", suffix = "", isCurrency = false }: { value: number, prefix?: string, suffix?: string, isCurrency?: boolean }) {
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2000
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    if (isCurrency && current >= 1000000) {
      return (current / 1000000).toFixed(1) + 'M';
    }
    return Math.floor(current).toLocaleString();
  });

  return (
    <motion.span>
      {prefix}<motion.span>{displayValue}</motion.span>{suffix}
    </motion.span>
  );
}
