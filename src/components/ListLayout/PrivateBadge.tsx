import React from 'react';

interface PrivateBadgeProps {
  isActive: boolean;
}

export const PrivateBadge: React.FC<PrivateBadgeProps> = ({ isActive }) => {
  return (
    <span className={`
    rounded-xl mx-1 px-1.5 py-1 text-[9px] uppercase leading-[1.2] tracking-[1px] sm:leading-none md:font-semibold
    transition duration-200 ease-in-out
    ${isActive
      ? "bg-black text-white bg-opacity-100"
      : "bg-black text-white bg-opacity-50 hover:bg-opacity-100"
    }
    dark:bg-black dark:text-slate-200 bg-opacity-10
    ${isActive
      ? "dark:bg-opacity-100"
      : "dark:bg-opacity-50 dark:hover:bg-opacity-100"
    }
  `}>
    Members-only
  </span>
  );
};