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

type PageEnterProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "main";
};

type PageEnterChildProps = {
  children: ReactNode;
  className?: string;
};

export function PageEnter({
  children,
  className = "",
  as = "div",
}: PageEnterProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const Root = as === "main" ? motion.main : motion.div;
  const nested = useContext(PageEnterContext);

  return (
    <PageEnterContext.Provider value={true}>
      <Root
        className={className}
        variants={getPageEnterContainerVariants(reduceMotion)}
        initial={nested ? undefined : "initial"}
        animate={nested ? undefined : "animate"}
      >
        {children}
      </Root>
    </PageEnterContext.Provider>
  );
}

export function PageEnterGroup({ children, className = "" }: PageEnterChildProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      variants={getPageEnterContainerVariants(reduceMotion)}
    >
      {children}
    </motion.div>
  );
}

export function PageEnterItem({ children, className = "" }: PageEnterChildProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const classNames = ["page-enter-item", className].filter(Boolean).join(" ");

  return (
    <motion.div
      className={classNames}
      variants={getPageEnterItemVariants(reduceMotion)}
    >
      {children}
    </motion.div>
  );
}

export function PageEnterItems({ children }: { children: ReactNode }) {
  return Children.map(children, (child) =>
    child == null || child === false ? child : (
      <PageEnterItem>{child}</PageEnterItem>
    ),
  );
}
