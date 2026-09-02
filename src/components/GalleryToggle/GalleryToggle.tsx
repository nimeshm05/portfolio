"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GalleryThumbnailsAnimatedIcon } from "@/components/AnimatedIcon/icons/gallery-thumbnails";
import { XAnimatedIcon } from "@/components/AnimatedIcon/icons/x";
import { Icon } from "@/components/Icon/Icon";
import type { AnimatedIconHandle } from "@/components/AnimatedIcon/types";
import {
  getPhotoSlideshowSwapVariants,
  photoSlideshowSwapTransition,
} from "@/motion/photoSlideshow";

type GalleryToggleProps = {
  open: boolean;
  onToggle: () => void;
};

export function GalleryToggle({ open, onToggle }: GalleryToggleProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const iconRef = useRef<AnimatedIconHandle>(null);
  const variants = getPhotoSlideshowSwapVariants(reduceMotion);

  return (
    <button
      type="button"
      className="site-control"
      aria-label={open ? "Close photo slideshow" : "Open photo slideshow"}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? "photo-slideshow-dialog" : undefined}
      onClick={onToggle}
      onPointerEnter={() => {
        if (!reduceMotion) {
          iconRef.current?.startAnimation();
        }
      }}
      onPointerLeave={() => {
        if (!reduceMotion) {
          iconRef.current?.stopAnimation();
        }
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={open ? "close" : "gallery"}
          className="site-control-icon-swap"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={photoSlideshowSwapTransition}
        >
          {open ? (
            reduceMotion ? (
              <Icon name="x" size={20} className="site-control-icon" />
            ) : (
              <XAnimatedIcon
                ref={iconRef}
                size={20}
                className="site-control-icon"
              />
            )
          ) : reduceMotion ? (
            <Icon
              name="gallery-thumbnails"
              size={20}
              className="site-control-icon"
            />
          ) : (
            <GalleryThumbnailsAnimatedIcon
              ref={iconRef}
              size={20}
              className="site-control-icon"
            />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
