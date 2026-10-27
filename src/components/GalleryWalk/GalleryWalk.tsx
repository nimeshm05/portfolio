"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import type { GalleryFrame } from "@/data/gallery";
import "./GalleryWalk.css";

/*
 * Scroll-driven art walk. The track is tall; the stage pins to the viewport
 * while scroll progress (in viewport heights) drives three phases:
 *   1. enter  – a small rotating portal rises to the middle of the screen
 *   2. portal – the circle grows until the corridor fills the screen
 *   3. walk   – the camera steps from one frame to the next
 *
 * The corridor is a CSS 3D scene drawn on a fixed 1440×900 canvas that is
 * scaled to cover the screen. The shell (walls, floor, ceiling) never moves
 * along the corridor; only the frames, end wall and floor seams do, so no
 * plane ever has to pass behind the camera.
 */

const CANVAS_W = 1440;
const CANVAS_H = 900;
const PERSPECTIVE = 900;

// Corridor geometry, in canvas px relative to the eye.
const CAM_X = -150; // walk a little left of center so the right wall reads
const WALL_R = 550 - CAM_X;
const WALL_L = -550 - CAM_X;
const FLOOR_Y = 430;
const CEILING_Y = -650;
const WALL_H = FLOOR_Y - CEILING_Y;
const WALL_MID_Y = (FLOOR_Y + CEILING_Y) / 2;
const SHELL_FAR = 6000;
const RIGHT_NEAR = 60;
const OTHER_NEAR = 600;

// Walking.
const YAW_VIEW = 36; // degrees, turned toward the art
const YAW_WALK = 18; // glance down the corridor mid-step
const YAW_PORTAL = 14; // through the portal, the art peeks in from the right
const VIEW_D = WALL_R / Math.tan((YAW_VIEW * Math.PI) / 180);
const SPACING = 1150;
const START_BACK = 1100;
const END_GAP = 1800;
const END_VIEW = 1300;
const STRIDE = 520;
const BOB = 7;
const FLOOR_SEAM = 360;
const HANG_W = 1000;
const NEAR_CLIP = 40;

// Scroll budget, in viewport heights.
const ENTER_FROM = 0.5;
const PORTAL_LEN = 1.4;
const END_DWELL = 0.4;
const SMOOTHING = 0.14;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (edge0: number, edge1: number, v: number) => {
  const t = clamp((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const frameZ = (index: number) => -VIEW_D - index * SPACING;

type GalleryWalkProps = {
  invite: string;
  frames: GalleryFrame[];
};

export function GalleryWalk({ invite, frames }: GalleryWalkProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inviteRef = useRef<HTMLParagraphElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const endWallRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  const steps = frames.length;
  const lastStop = frameZ(frames.length - 1) + VIEW_D;
  const endWallZ = frameZ(frames.length - 1) - END_GAP;
  const endStop = endWallZ + END_VIEW;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;

    if (!track || !stage) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let running = false;
    let current = -1;
    let target = 0;
    let vw = 0;
    let vh = 0;
    let cover = 1;
    let fullRadius = 0;

    const measure = () => {
      vw = stage.clientWidth;
      vh = stage.clientHeight;
      cover = Math.max(vw / CANVAS_W, vh / CANVAS_H);
      fullRadius = Math.hypot(vw, vh) / 2 + 4;
    };

    const readTarget = () => {
      const rect = track.getBoundingClientRect();
      target = (window.innerHeight - rect.top) / window.innerHeight;
    };

    const camera = (q: number, walk: number) => {
      if (walk <= 0) {
        return {
          z: START_BACK * (1 - smoothstep(0, 1, q)),
          x: CAM_X,
          yaw: lerp(YAW_PORTAL, YAW_VIEW, smoothstep(0.55, 1, q)),
          moving: 0,
        };
      }

      const segment = Math.min(Math.floor(walk), steps - 1);
      const eased = smoothstep(0.15, 0.85, walk - segment);
      const moving = Math.sin(Math.PI * eased);

      if (segment < steps - 1) {
        return {
          z: -segment * SPACING - eased * SPACING,
          x: CAM_X,
          yaw: YAW_VIEW - (YAW_VIEW - YAW_WALK) * moving,
          moving,
        };
      }

      return {
        z: lerp(lastStop, endStop, eased),
        x: lerp(CAM_X, 0, eased),
        yaw: lerp(YAW_VIEW, 0, eased),
        moving,
      };
    };

    const render = (u: number) => {
      const reduce = motionQuery.matches;
      const q = clamp((u - ENTER_FROM) / (1 + PORTAL_LEN - ENTER_FROM));
      const walk = clamp(u - 1 - PORTAL_LEN, 0, steps);
      const open = q >= 1;

      // Portal: a small lens that spins down to rest as it fills the screen.
      const radius = lerp(2, fullRadius, Math.pow(q, 2.4));
      const lensScale = lerp(0.22, 1, Math.pow(q, 1.6));
      const spin = reduce ? 0 : -300 * Math.pow(1 - q, 1.6);

      if (portalRef.current) {
        portalRef.current.style.clipPath = open
          ? "none"
          : `circle(${radius}px at 50% 50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.width = `${radius * 2}px`;
        ringRef.current.style.height = `${radius * 2}px`;
        ringRef.current.style.opacity = String(
          (1 - smoothstep(0.55, 0.95, q)) * smoothstep(0, 0.08, q),
        );
      }
      if (lensRef.current) {
        lensRef.current.style.transform = `translate(-50%, -50%) scale(${
          cover * lensScale
        }) rotate(${spin}deg)`;
      }
      if (inviteRef.current) {
        const fade = smoothstep(0.16, 0.4, q);
        inviteRef.current.style.opacity = String(1 - fade);
        inviteRef.current.style.transform = `translate(-50%, ${-fade * 64}px)`;
      }

      // Camera.
      const cam = camera(q, walk);
      const yawRad = (cam.yaw * Math.PI) / 180;
      // Eye-space depth of a point on the right wall; planes must stay in front.
      const depthOnRightWall = (z: number) =>
        WALL_R * Math.sin(yawRad) - z * Math.cos(yawRad);
      const bob = reduce
        ? 0
        : Math.sin((-cam.z / STRIDE) * Math.PI * 2) * BOB * cam.moving;

      if (worldRef.current) {
        worldRef.current.style.transform = `translateZ(${PERSPECTIVE}px) rotateY(${
          cam.yaw
        }deg) translate3d(${CAM_X - cam.x}px, ${-bob}px, 0)`;
      }
      if (floorRef.current) {
        const seam = (((-cam.z) % FLOOR_SEAM) + FLOOR_SEAM) % FLOOR_SEAM;
        floorRef.current.style.backgroundPosition = `0 0, 0 ${seam}px`;
      }

      frameRefs.current.forEach((el, index) => {
        if (!el) {
          return;
        }

        const z = frameZ(index) - cam.z;
        const distance = -z;
        const visible =
          depthOnRightWall(z + HANG_W / 2) > NEAR_CLIP && distance < SHELL_FAR;

        el.style.visibility = visible ? "visible" : "hidden";
        if (visible) {
          el.style.transform = `translate3d(${WALL_R - 1}px, ${WALL_MID_Y}px, ${z}px) rotateY(-90deg)`;
          el.style.setProperty(
            "--gallery-fog",
            String(clamp((distance - 1500) / 3200, 0, 0.92)),
          );
        }
      });

      if (endWallRef.current) {
        const z = endWallZ - cam.z;
        const visible = -z < SHELL_FAR;

        endWallRef.current.style.visibility = visible ? "visible" : "hidden";
        endWallRef.current.style.transform = `translate3d(${
          (WALL_L + WALL_R) / 2
        }px, ${WALL_MID_Y}px, ${z}px)`;
        endWallRef.current.style.setProperty(
          "--gallery-fog",
          String(clamp((-z - 1500) / 3200, 0, 0.92)),
        );
      }

      stage.classList.toggle("is-open", open);
      document.documentElement.classList.toggle(
        "gallery-walk-immersed",
        q > 0.35 && u < 1 + PORTAL_LEN + steps + END_DWELL + 0.5,
      );
    };

    const tick = () => {
      frameId = 0;
      readTarget();

      const ease = motionQuery.matches || current < 0 ? 1 : SMOOTHING;
      current += (target - current) * ease;

      if (Math.abs(target - current) < 0.0005) {
        current = target;
      }

      render(current);

      if (running && current !== target) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (frameId === 0 && running) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      schedule();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) {
          schedule();
        } else {
          document.documentElement.classList.remove("gallery-walk-immersed");
        }
      },
      { rootMargin: "50% 0px" },
    );

    measure();
    readTarget();
    current = target;
    render(current);
    observer.observe(track);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("gallery-walk-immersed");
    };
  }, [steps, lastStop, endStop, endWallZ]);

  const trackStyle = {
    "--gallery-scroll-vh": 1 + PORTAL_LEN + steps + END_DWELL,
  } as CSSProperties;

  const plane = (width: number, height: number, transform: string) =>
    ({
      width,
      height,
      marginLeft: -width / 2,
      marginTop: -height / 2,
      transform,
    }) satisfies CSSProperties;

  const rightLen = SHELL_FAR - RIGHT_NEAR;
  const otherLen = SHELL_FAR - OTHER_NEAR;
  const otherMidZ = -(OTHER_NEAR + otherLen / 2);
  const corridorW = WALL_R - WALL_L;
  const corridorMidX = (WALL_L + WALL_R) / 2;

  return (
    <section className="gallery-walk" aria-label="Gallery art walk">
      <div className="gallery-walk-track" ref={trackRef} style={trackStyle}>
        <div className="gallery-walk-stage" ref={stageRef}>
          <p className="gallery-walk-invite" ref={inviteRef}>
            {invite}
          </p>
          <div className="gallery-walk-ring" ref={ringRef} aria-hidden="true" />
          <div className="gallery-walk-portal" ref={portalRef}>
            <div
              className="gallery-walk-lens"
              ref={lensRef}
              style={{ width: CANVAS_W, height: CANVAS_H }}
            >
              <div
                className="gallery-walk-viewport"
                style={{ perspective: PERSPECTIVE }}
              >
                <div className="gallery-walk-world" ref={worldRef}>
                  <div
                    className="gallery-walk-plane gallery-walk-wall gallery-walk-wall--right"
                    style={plane(
                      rightLen,
                      WALL_H,
                      `translate3d(${WALL_R}px, ${WALL_MID_Y}px, ${-(
                        RIGHT_NEAR +
                        rightLen / 2
                      )}px) rotateY(-90deg)`,
                    )}
                  />
                  <div
                    className="gallery-walk-plane gallery-walk-wall gallery-walk-wall--left"
                    style={plane(
                      otherLen,
                      WALL_H,
                      `translate3d(${WALL_L}px, ${WALL_MID_Y}px, ${otherMidZ}px) rotateY(90deg)`,
                    )}
                  />
                  <div
                    className="gallery-walk-plane gallery-walk-floor"
                    ref={floorRef}
                    style={plane(
                      corridorW,
                      otherLen,
                      `translate3d(${corridorMidX}px, ${FLOOR_Y}px, ${otherMidZ}px) rotateX(90deg)`,
                    )}
                  />
                  <div
                    className="gallery-walk-plane gallery-walk-ceiling"
                    style={plane(
                      corridorW,
                      otherLen,
                      `translate3d(${corridorMidX}px, ${CEILING_Y}px, ${otherMidZ}px) rotateX(-90deg)`,
                    )}
                  />

                  {frames.map((frame, index) => (
                    <div
                      key={frame.id}
                      className="gallery-walk-plane gallery-walk-hang"
                      ref={(el) => {
                        frameRefs.current[index] = el;
                      }}
                      style={plane(HANG_W, WALL_H, "none")}
                    >
                      <div className="gallery-walk-wash" aria-hidden="true" />
                      <figure
                        className={`gallery-walk-frame gallery-walk-frame--${frame.orientation}`}
                        style={{ top: -CEILING_Y - 10 }}
                      >
                        <div className="gallery-walk-mat">
                          <div className="gallery-walk-photo">
                            <Image
                              src={frame.src}
                              alt={frame.alt}
                              fill
                              sizes="560px"
                            />
                          </div>
                        </div>
                        <figcaption className="gallery-walk-placard">
                          <span className="gallery-walk-placard-title">
                            {frame.title}
                          </span>
                          <span className="gallery-walk-placard-caption">
                            {frame.caption}
                          </span>
                        </figcaption>
                        <div className="gallery-walk-fog" aria-hidden="true" />
                      </figure>
                    </div>
                  ))}

                  <div
                    className="gallery-walk-plane gallery-walk-end"
                    ref={endWallRef}
                    style={plane(corridorW, WALL_H, "none")}
                  >
                    <div className="gallery-walk-end-glow" aria-hidden="true" />
                    <p className="gallery-walk-end-text">
                      That&apos;s the walk, for now.
                    </p>
                    <div className="gallery-walk-fog" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="gallery-walk-vignette" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
