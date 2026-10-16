/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Target, Users } from "lucide-react";
import PublicLayout from "../layout/PublicLayout.jsx";

const features = [
  { title: "Plan Tasks", text: "Create and organize your tasks easily.", icon: ClipboardList },
  { title: "Track Progress", text: "Stay on track and never miss a deadline.", icon: Target },
  { title: "Achieve More", text: "Collaborate and get things done faster.", icon: Users },
];

export default function Landing() {
  return (
    <PublicLayout>
      {/* ================= HERO SECTION ================= */}
      <motion.section
        className="flex flex-1 flex-col items-center px-4 pb-20 pt-10 text-center sm:pt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-sm font-medium text-brand-light">
          🚀 Boost Productivity
        </span>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
          Organize your{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
            Tasks
          </span>{" "}
          Smartly.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Boost productivity with your personal task manager. Plan, track,
          and achieve your goals seamlessly — anytime, anywhere.
        </p>

        <Link
          to="/register"
          className="btn-primary mt-10 bg-brand-gradient px-8 py-4 text-lg shadow-glow hover:brightness-110"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Link>

        {/* ================= FEATURES ================= */}
        <div className="mt-20 grid w-full max-w-4xl gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-start gap-4 text-left sm:px-6">
                <div className="icon-tile h-14 w-14 shrink-0 text-brand-light">
                  <Icon size={26} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{feature.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    </PublicLayout>
  );
}
