"use client";

import {
  Children,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  getPageEnterContainerVariants,
  getPageEnterItemVariants,
} from "@/motion/pageEnter";
import "./PageEnter.css";

const PageEnterContext = createContext(false);
const PageEnterIndexContext = createContext<(() => number) | null>(null);

type PageEnterProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "main";
};

type PageEnterChildProps = {
  children: ReactNode;
  className?: string;
};

type PageEnterItemAs = "div" | "span" | "h1" | "p";

type PageEnterItemProps = {
  children?: ReactNode;
  className?: string;
  as?: PageEnterItemAs;
  "aria-hidden"?: boolean;
};

const motionTags = {
  div: motion.div,
  span: motion.span,
  h1: motion.h1,
  p: motion.p,
} as const;

export function PageEnter({
  children,
  className = "",
  as = "div",
}: PageEnterProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const Root = as === "main" ? motion.main : motion.div;
  const nested = useContext(PageEnterContext);
  let itemIndex = 0;
  const nextItemIndex = () => itemIndex++;

  return (
    <PageEnterContext.Provider value={true}>
      <PageEnterIndexContext.Provider value={nextItemIndex}>
        <Root
          className={className}
          variants={getPageEnterContainerVariants(reduceMotion)}
          initial={nested ? undefined : "initial"}
          animate={nested ? undefined : "animate"}
        >
          {children}
        </Root>
      </PageEnterIndexContext.Provider>
    </PageEnterContext.Provider>
  );
}

export function PageEnterGroup({ children, className = "" }: PageEnterChildProps) {
  return <div className={className}>{children}</div>;
}

export function PageEnterItem({
  children,
  className = "",
  as = "div",
  "aria-hidden": ariaHidden,
}: PageEnterItemProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const nextItemIndex = useContext(PageEnterIndexContext);
  const index = nextItemIndex?.() ?? 0;
  const MotionTag = motionTags[as];
  const classNames = ["page-enter-item", className].filter(Boolean).join(" ");

  return (
    <MotionTag
      className={classNames}
      variants={getPageEnterItemVariants(reduceMotion)}
      custom={index}
      initial="initial"
      animate="animate"
      aria-hidden={ariaHidden}
    >
      {children}
    </MotionTag>
  );
}

export function PageEnterItems({ children }: { children: ReactNode }) {
  return Children.map(children, (child) =>
    child == null || child === false ? child : (
      <PageEnterItem>{child}</PageEnterItem>
    ),
  );
}
