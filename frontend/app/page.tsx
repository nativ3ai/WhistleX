import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, LockOpen } from "lucide-react";

const features = [
  {
    title: "Crowdfund Intelligence",
    description: "Contributors pledge USDC into intel pools. When the threshold is met, everyone unlocks the reveal.",
    icon: TrendingUp
  },
  {
    title: "Lit Gated Secrets",
    description: "Lit Protocol keeps creator intel encrypted until smart-contract access control conditions are satisfied.",
    icon: ShieldCheck
  },
  {
    title: "Trustless Settlement",
    description: "Funds live in on-chain pools and automatically route to creators upon unlock with optional refunds on expiry.",
    icon: LockOpen
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <motion.h1
            className="text-5xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Fund, unlock, and decrypt premium intel together.
          </motion.h1>
          <p className="max-w-xl text-lg text-slate-300">
            Intel Marketplace coordinates creators and backers using Base L2 smart contracts, Lit Protocol access control, and
            Supabase-powered metadata. Explore live pools or launch your own case in minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/pools" className="btn-primary">
              View Pools
            </Link>
            <Link href="/create" className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              Launch a Pool
            </Link>
          </div>
        </div>
        <motion.div
          className="relative grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="card flex items-start gap-4 bg-black/40"
              whileHover={{ translateY: -4, transition: { type: "spring", stiffness: 260, damping: 20 } }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <section className="card space-y-6 bg-black/30">
        <h2 className="section-title">Quick links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/pools" className="card bg-white/5 transition hover:bg-white/10">
            <h3 className="text-lg font-semibold">Browse Pools</h3>
            <p className="text-sm text-slate-300">
              Inspect active intel cases, contribution progress, unlock status, and Lit decryption readiness.
            </p>
          </Link>
          <Link href="/create" className="card bg-white/5 transition hover:bg-white/10">
            <h3 className="text-lg font-semibold">Create Intel Pool</h3>
            <p className="text-sm text-slate-300">
              Draft your intel case, configure thresholds and deadlines, encrypt with Lit, and publish to Base.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
