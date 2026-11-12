"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import { useExitToHome } from "@/motion/pageExit";
import { useStaggerEnter } from "@/motion/staggerEnter";
import "./ProjectDock.css";

type ProjectDockItem = {
  id: string;
  label: string;
  href?: string;
};

type ProjectDockProps = {
  items: ProjectDockItem[];
  activeId: string;
};

/* The section label swaps word by word, like the before/after captions */
const labelVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const reducedWordVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* Opening, the sections pill swells into the menu and swallows the back
   button, like Linear's mobile tab bar; closing reverses it */
const morphTransition = {
  type: "spring",
  stiffness: 420,
  damping: 38,
  mass: 0.9,
} as const;

/** The back button's 42px circle plus the gap: where the pill sits closed */
const PILL_LEFT_PX = 50;
const PILL_HEIGHT_PX = 42;

/** Mobile project controls: back, and a pill naming the section in view
    that morphs into a menu of every section */
export function ProjectDock({ items, activeId }: ProjectDockProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const exitToHome = useExitToHome();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [openSize, setOpenSize] = useState<{ width: number; height: number }>();
  const sizerRef = useRef<HTMLSpanElement>(null);
  const labelWidth = useMotionValue<number | "auto">("auto");
  const menuId = useId();

  const links = items.filter((item) => item.href);
  const active = links.find((item) => item.id === activeId) ?? links[0];
  const activeLabel = active?.label ?? "";

  // The pill eases to the new label's width rather than jumping; the first
  // measurement is applied straight away so it never grows in on load
  useLayoutEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;
    let controls: ReturnType<typeof animate> | undefined;
    const measure = () => {
      // Plus the 2px blur room on each side, which the box adds as padding
      const width = sizer.offsetWidth + 4;
      if (labelWidth.get() === "auto" || reduceMotion) {
        labelWidth.set(width);
      } else {
        controls?.stop();
        controls = animate(labelWidth, width, {
          type: "spring",
          stiffness: 380,
          damping: 34,
        });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sizer);
    return () => {
      controls?.stop();
      observer.disconnect();
    };
  }, [activeLabel, labelWidth, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const openMenu = () => {
    const surface = surfaceRef.current;
    const menu = menuRef.current;
    if (!surface || !menu) return;
    // The panel covers the whole dock, and is as big as its list needs
    setOpenSize({
      width: Math.max(menu.offsetWidth, PILL_LEFT_PX + surface.offsetWidth),
      height: menu.offsetHeight,
    });
    setOpen(true);
  };

  const words = activeLabel.split(" ");
  // On arrival the buttons slide in from the right one after the other;
  // the menu's items rise in like the desktop sidebar
  const enter = useStaggerEnter({ from: "right", stagger: 0.06, delay: 0.12 });
  const menuEnter = useStaggerEnter();
  const instant = { duration: reduceMotion ? 0.15 : 0.2 };

  return (
    <motion.div
      ref={rootRef}
      className="project-dock"
      variants={enter.container}
      initial="initial"
      animate="animate"
    >
      <motion.div className="project-dock-enter" variants={enter.item}>
        <motion.div
          className="project-dock-back-slot"
          initial={false}
          animate={
            open
              ? {
                  opacity: 0,
                  scale: reduceMotion ? 1 : 0.6,
                  filter: "blur(4px)",
                }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  // Any filter left on an ancestor cuts the glass off from
                  // what's behind it, so it's dropped once the blur clears
                  transitionEnd: { filter: "none" },
                }
          }
          transition={reduceMotion ? instant : morphTransition}
          inert={open}
        >
          <Link
            className="glass-control project-dock-back"
            href="/"
            onClick={exitToHome}
            aria-label="Back"
          >
            <span className="project-dock-back-icon" aria-hidden="true">
              <Icon name="chevron-left" size={20} />
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {links.length > 0 ? (
        <motion.div
          className="project-dock-enter project-dock-enter--surface"
          variants={enter.item}
        >
          <motion.div
            ref={surfaceRef}
            className={
              open
                ? "glass-control project-dock-surface is-open"
                : "glass-control project-dock-surface"
            }
            initial={false}
            animate={
              open && openSize
                ? {
                    left: 0,
                    width: openSize.width,
                    height: openSize.height,
                    borderRadius: 28,
                  }
                : {
                    left: PILL_LEFT_PX,
                    width: "auto",
                    height: PILL_HEIGHT_PX,
                    borderRadius: PILL_HEIGHT_PX / 2,
                  }
            }
            transition={reduceMotion ? { duration: 0 } : morphTransition}
          >
            <motion.nav
              ref={menuRef}
              id={menuId}
              className="project-dock-menu"
              aria-label="Sections"
              // Items rise in one after another, like the desktop sidebar's
              // entrance, and drop away in reverse when it closes
              variants={menuEnter.container}
              initial={false}
              animate={open ? "animate" : "exit"}
              inert={!open}
            >
              {links.map((item) => {
                const isActive = item.id === active?.id;
                return (
                  <motion.a
                    key={item.id}
                    variants={menuEnter.item}
                    className={
                      isActive
                        ? "project-dock-menu-item is-active"
                        : "project-dock-menu-item"
                    }
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
            </motion.nav>

            <motion.button
              type="button"
              className="project-dock-sections"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={`Sections, currently ${activeLabel}`}
              onClick={openMenu}
              initial={false}
              animate={
                open
                  ? { opacity: 0, filter: "blur(6px)", transition: instant }
                  : {
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: { ...instant, delay: reduceMotion ? 0 : 0.1 },
                    }
              }
              inert={open}
            >
              <motion.span
                className="project-dock-label"
                aria-hidden="true"
                style={{ width: labelWidth }}
              >
                <span ref={sizerRef} className="project-dock-label-sizer">
                  {activeLabel}
                </span>
                <AnimatePresence initial={false}>
                  <motion.span
                    key={activeLabel}
                    className="project-dock-label-line"
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {words.map((word, index) => (
                      <motion.span
                        key={index}
                        className="project-dock-label-word"
                        variants={
                          reduceMotion ? reducedWordVariants : wordVariants
                        }
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
