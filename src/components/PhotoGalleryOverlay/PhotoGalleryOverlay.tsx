"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedIcon } from "@/components/AnimatedIcon/AnimatedIcon";
import { PhotoGalleryList } from "@/components/PhotoGalleryList/PhotoGalleryList";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import { photoGalleryTitle } from "@/data/photo-gallery";
import {
  getPhotoGallerySheetVariants,
  getPhotoGalleryTransition,
} from "@/motion/photoGallery";
import "./PhotoGalleryOverlay.css";

type PhotoGalleryOverlayProps = {
  onClose: () => void;
};

export function PhotoGalleryOverlay({ onClose }: PhotoGalleryOverlayProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [closeHovered, setCloseHovered] = useState(false);
  const transition = getPhotoGalleryTransition(reduceMotion);

  useEffect(() => {
    const previous = document.activeElement;
    previousFocusRef.current =
      previous instanceof HTMLElement ? previous : null;
    closeButtonRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="photo-gallery-overlay"
      variants={getPhotoGallerySheetVariants(reduceMotion)}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
      onClick={onClose}
    >
      <div
        className="photo-gallery-frame"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="photo-gallery-sheet"
          role="dialog"
          id="photo-gallery-dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <ViewportEdgeBlur contained />
          <div className="photo-gallery-chrome">
            <h2 id={titleId} className="photo-gallery-title">
              {photoGalleryTitle}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              className="photo-gallery-close"
              aria-label="Close photo gallery"
              onClick={onClose}
              onPointerEnter={() => setCloseHovered(true)}
              onPointerLeave={() => setCloseHovered(false)}
              onFocus={() => setCloseHovered(true)}
              onBlur={() => setCloseHovered(false)}
            >
              <AnimatedIcon name="x" isActive={closeHovered} size={20} />
            </button>
          </div>
          <div className="photo-gallery-scroll">
            <PhotoGalleryList />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
