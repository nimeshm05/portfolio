"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import { photoGalleryItems } from "@/data/photo-gallery";
import {
  getPhotoSlideshowImageTransition,
  getPhotoSlideshowImageVariants,
  getPhotoSlideshowOverlayTransition,
  getPhotoSlideshowSwapVariants,
  photoSlideshowOverlayVariants,
  photoSlideshowSwapTransition,
  type PhotoSlideshowDirection,
} from "@/motion/photoSlideshow";
import "./PhotoSlideshow.css";

type PhotoSlideshowProps = {
  onClose: () => void;
};

export function PhotoSlideshow({ onClose }: PhotoSlideshowProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<PhotoSlideshowDirection>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const item = photoGalleryItems[index];
  const count = photoGalleryItems.length;
  const imageVariants = getPhotoSlideshowImageVariants(reduceMotion);
  const imageTransition = getPhotoSlideshowImageTransition(reduceMotion);
  const swapVariants = getPhotoSlideshowSwapVariants(reduceMotion);

  const go = useCallback(
    (delta: PhotoSlideshowDirection) => {
      if (isAnimating || count < 2) {
        return;
      }

      setIsAnimating(true);
      setDirection(delta);
      setIndex((current) => (current + delta + count) % count);
    },
    [count, isAnimating],
  );

  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  return (
    <motion.div
      className="photo-slideshow"
      role="dialog"
      id="photo-slideshow-dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      variants={photoSlideshowOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={getPhotoSlideshowOverlayTransition(reduceMotion)}
    >
      <div className="photo-slideshow-main">
        <div className="photo-slideshow-stage">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={item.id}
              className="photo-slideshow-frame"
              custom={direction}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={imageTransition}
              onAnimationComplete={(definition) => {
                if (definition === "animate") {
                  setIsAnimating(false);
                }
              }}
            >
              <Image
                className="photo-slideshow-image"
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 42rem) 100vw, 42rem"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="photo-slideshow-label-slot" id={labelId} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={item.id}
              className="photo-slideshow-label"
              variants={swapVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={photoSlideshowSwapTransition}
            >
              {item.label}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <nav className="photo-slideshow-nav" aria-label="Photo slideshow">
        <button
          type="button"
          className="photo-slideshow-nav-button"
          aria-label="Previous photo"
          onClick={() => go(-1)}
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <button
          type="button"
          className="photo-slideshow-nav-button"
          aria-label="Next photo"
          onClick={() => go(1)}
        >
          <Icon name="chevron-right" size={20} />
        </button>
      </nav>
    </motion.div>
  );
}
