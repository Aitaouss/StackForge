"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { SHIPPED_CAPABILITIES, STACK_LOGOS } from "@/data/tech-stack";

const EASE = [0.22, 1, 0.36, 1] as const;

function logoUrl(slug: string, color: string) {
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

const logoItem = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

export function TechStack() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="stack" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Built with the stack you already trust
          </h2>
          <p className="mt-4 text-zinc-400">
            StackForge wires familiar tools into one generate command—typed frontend, secure API,
            database, containers, and CI templates aligned with what we ship on npm today.
          </p>
        </Reveal>

        <motion.ul
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
          }}
        >
          {STACK_LOGOS.map((item) => (
            <motion.li
              key={item.name}
              variants={reduceMotion ? undefined : logoItem}
              className="glass group flex flex-col items-center rounded-xl px-3 py-5 text-center transition duration-300 hover:border-emerald-500/25 hover:shadow-glow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  src={logoUrl(item.slug, item.color)}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 opacity-75 brightness-0 invert transition duration-300 ease-out group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-400 transition duration-300 group-hover:text-zinc-100">
                {item.name}
              </p>
              <p className="mt-1 text-xs text-zinc-600 transition duration-300 group-hover:text-zinc-500">
                {item.role}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <Reveal className="mt-16 glass rounded-xl p-6 sm:p-8" delay={0.1}>
          <h3 className="text-lg font-semibold text-zinc-100">Included in every generated app</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Not just logos—working code, configs, and scripts you can run on day one.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SHIPPED_CAPABILITIES.map((line, index) => (
              <motion.li
                key={line}
                className="flex gap-2 text-sm text-zinc-300"
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: EASE }}
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                  aria-hidden
                />
                <span>{line}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
