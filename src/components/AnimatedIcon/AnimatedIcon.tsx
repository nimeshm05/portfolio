"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { ArrowDownAnimatedIcon } from "./icons/arrow-down";
import { ArrowRightAnimatedIcon } from "./icons/arrow-right";
import { ArrowUpRightAnimatedIcon } from "./icons/arrow-up-right";
import { BotAnimatedIcon } from "./icons/bot";
import { ChartPieAnimatedIcon } from "./icons/chart-pie";
import { CodeXmlAnimatedIcon } from "./icons/code-xml";
import { ExpandAnimatedIcon } from "./icons/expand";
import { Music2AnimatedIcon } from "./icons/music-2";
import { NotebookPenAnimatedIcon } from "./icons/notebook-pen";
import type { AnimatedIconHandle } from "./types";

const animatedIcons = {
  "chart-pie": ChartPieAnimatedIcon,
  bot: BotAnimatedIcon,
  "music-2": Music2AnimatedIcon,
  "code-xml": CodeXmlAnimatedIcon,
  "notebook-pen": NotebookPenAnimatedIcon,
  "arrow-down": ArrowDownAnimatedIcon,
  "arrow-right": ArrowRightAnimatedIcon,
  "arrow-up-right": ArrowUpRightAnimatedIcon,
  expand: ExpandAnimatedIcon,
} as const;

type HomeAnimatedIconName = keyof typeof animatedIcons;

function isHomeAnimatedIcon(name: IconName): name is HomeAnimatedIconName {
  return name in animatedIcons;
}

type AnimatedIconProps = {
  name: IconName;
  isActive: boolean;
  size?: number;
  className?: string;
};

export function AnimatedIcon({
  name,
  isActive,
  size = 20,
  className,
}: AnimatedIconProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const iconRef = useRef<AnimatedIconHandle>(null);
  const AnimatedComponent = isHomeAnimatedIcon(name)
    ? animatedIcons[name]
    : null;

  useEffect(() => {
    if (!AnimatedComponent || reduceMotion) {
      return;
    }

    if (isActive) {
      iconRef.current?.startAnimation();
      return;
    }

    iconRef.current?.stopAnimation();
  }, [AnimatedComponent, isActive, reduceMotion]);

  if (!AnimatedComponent || reduceMotion) {
    return <Icon name={name} size={size} className={className} />;
  }

  return (
    <AnimatedComponent ref={iconRef} size={size} className={className ?? "icon"} />
  );
}
