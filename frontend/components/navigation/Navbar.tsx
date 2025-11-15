"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/pools", label: "Pools" },
  { href: "/create", label: "Create" }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-6 py-4 shadow-lg shadow-black/20 backdrop-blur">
      <Link href="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight">
        <motion.span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold"
          initial={{ rotate: -12, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Ξ
        </motion.span>
        Intel Marketplace
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "relative rounded-lg px-3 py-2 transition-colors",
              pathname === link.href ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
            )}
          >
            {pathname === link.href && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary to-accent opacity-20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
