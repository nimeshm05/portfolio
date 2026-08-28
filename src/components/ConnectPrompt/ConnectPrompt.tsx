"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ConnectExcitement, type ExcitementExitMode } from "@/components/ConnectExcitement/ConnectExcitement";
import { ConnectMascot } from "@/components/ConnectMascot/ConnectMascot";
import { AnimatedCoffeeIcon } from "@/components/AnimatedCoffeeIcon/AnimatedCoffeeIcon";
import { MorphingArrowRight } from "@/components/MorphingArrowRight/MorphingArrowRight";
import { MorphingConnectIcon } from "@/components/MorphingConnectIcon/MorphingConnectIcon";
import { connect, type HomeTab } from "@/data/home";
import {
  PHONE_WAVE_EMOJI,
  excitementSmokeTransition,
  mascotWinkTransition,
  phoneWaveRotate,
  phoneWaveTransition,
  phoneWordEnter,
  phoneWordHiddenBelow,
  phoneWordStaggerSeconds,
  phoneWordTransition,
} from "@/motion/connectPrompt";
import {
  tabContentBlurVariants,
  tabContentTransition,
} from "@/motion/tabContent";
import "./ConnectPrompt.css";

type ConnectStep = "invite" | "prefer" | "social" | "inPerson" | "phone";
type PhoneLabel = "contact" | "soon";
type SocialLabel = "handles" | "bye";

const PHONE_LABEL_CONTACT = "Here's my number and email.";
const PHONE_LABEL_SOON = `I'll see you soon my fren ${PHONE_WAVE_EMOJI}`;
const SOCIAL_LABEL_HANDLES = "My handles:";
const SOCIAL_LABEL_BYE = `See ya ${PHONE_WAVE_EMOJI}`;
const LABEL_SWAP_DELAY_MS = 1500;
const MASCOT_ENABLED = false;

function PromptText({ children }: { children: ReactNode }) {
  return <span className="connect-prompt-text">{children}</span>;
}

function PromptAction({
  children,
  onClick,
  onHoverChange,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: {
  children: ReactNode;
  onClick: () => void;
  onHoverChange?: (hovered: boolean) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <button
      type="button"
      className="connect-prompt-action"
      data-cuelume-press="success"
      onClick={onClick}
      onMouseEnter={() => {
        onHoverChange?.(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        onHoverChange?.(false);
        onMouseLeave?.();
      }}
      onFocus={() => {
        onHoverChange?.(true);
        onFocus?.();
      }}
      onBlur={() => {
        onHoverChange?.(false);
        onBlur?.();
      }}
    >
      {children}
    </button>
  );
}

function PromptLink({
  children,
  href,
  onHoverChange,
}: {
  children: ReactNode;
  href: string;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className="connect-prompt-action"
      href={href}
      data-cuelume-press="arrival"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}

function PromptSeparator() {
  return <span className="connect-prompt-separator">/</span>;
}

function Options({
  items,
}: {
  items: { key: string; node: ReactNode }[];
}) {
  return (
    <div className="connect-prompt-options">
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? <PromptSeparator /> : null}
          {item.node}
        </Fragment>
      ))}
    </div>
  );
}

function WordPullText({
  text,
  animateEntrance,
}: {
  text: string;
  animateEntrance: boolean;
}) {
  const words = text.split(/\s+/);
  /**
   * Parent step AnimatePresence can suppress nested mount `initial`→`animate`.
   * Drive the pull-up from state after paint (same pattern as ListItem chevrons).
   */
  const [pulled, setPulled] = useState(!animateEntrance);
  const exitDuration =
    phoneWordTransition.duration +
    phoneWordStaggerSeconds * Math.max(words.length - 1, 0);

  useEffect(() => {
    if (!animateEntrance) {
      setPulled(true);
      return;
    }

    setPulled(false);
    let innerFrameId = 0;
    const outerFrameId = requestAnimationFrame(() => {
      innerFrameId = requestAnimationFrame(() => {
        setPulled(true);
      });
    });
    return () => {
      cancelAnimationFrame(outerFrameId);
      cancelAnimationFrame(innerFrameId);
    };
  }, [text, animateEntrance]);

  return (
    <motion.span
      className="connect-prompt-phone-label-motion connect-prompt-phone-label-active connect-prompt-text"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 1,
        transition: {
          duration: exitDuration,
          ease: phoneWordTransition.ease,
        },
      }}
    >
      {words.map((word, index) => {
        const isWave = word === PHONE_WAVE_EMOJI;
        const pullDelay =
          pulled && animateEntrance ? index * phoneWordStaggerSeconds : 0;
        const waveDelay =
          phoneWordTransition.duration + index * phoneWordStaggerSeconds;

        return (
          <motion.span
            key={`${text}-${index}`}
            className={`connect-prompt-word-mask${isWave ? " connect-prompt-word-mask--wave" : ""}`}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
          >
            <motion.span
              className="connect-prompt-word"
              initial={false}
              animate={pulled ? phoneWordEnter : phoneWordHiddenBelow}
              exit={{
                ...phoneWordHiddenBelow,
                transition: {
                  ...phoneWordTransition,
                  delay: index * phoneWordStaggerSeconds,
                },
              }}
              transition={{
                ...phoneWordTransition,
                delay: pullDelay,
              }}
            >
              {isWave ? (
                <motion.span
                  className="connect-prompt-wave"
                  initial={false}
                  animate={
                    pulled && animateEntrance
                      ? { rotate: [...phoneWaveRotate] }
                      : { rotate: 0 }
                  }
                  transition={
                    (pulled && animateEntrance
                      ? {
                          duration: phoneWaveTransition.duration,
                          ease: phoneWaveTransition.ease,
                          times: phoneWaveTransition.times,
                          repeat: phoneWaveTransition.repeat,
                          delay: waveDelay,
                        }
                      : { duration: 0 }) as Transition
                  }
                >
                  {word}
                </motion.span>
              ) : (
                word
              )}
              {index < words.length - 1 ? "\u00A0" : null}
            </motion.span>
          </motion.span>
        );
      })}
    </motion.span>
  );
}

function PullLabelSlot({
  labelKey,
  idleText,
  activeText,
  isActive,
}: {
  labelKey: string;
  idleText: string;
  activeText: string;
  isActive: boolean;
}) {
  const visibleText = isActive ? activeText : idleText;

  return (
    <span className="connect-prompt-phone-label">
      <span
        className="connect-prompt-phone-label-sizer connect-prompt-text"
        aria-hidden="true"
      >
        {idleText}
      </span>
      <span
        className="connect-prompt-phone-label-sizer connect-prompt-text"
        aria-hidden="true"
      >
        {activeText}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <WordPullText
          key={labelKey}
          text={visibleText}
          animateEntrance={isActive}
        />
      </AnimatePresence>
    </span>
  );
}

export function ConnectPrompt({ activeTab }: { activeTab: HomeTab }) {
  const [step, setStep] = useState<ConnectStep>("invite");
  const [phoneLabel, setPhoneLabel] = useState<PhoneLabel>("contact");
  const [socialLabel, setSocialLabel] = useState<SocialLabel>("handles");
  const [yesHovered, setYesHovered] = useState(false);
  const [burstExitMode, setBurstExitMode] =
    useState<ExcitementExitMode>("reverse");
  const [mascotPinned, setMascotPinned] = useState(false);
  const [mascotPreview, setMascotPreview] = useState(false);
  const [optionHovered, setOptionHovered] = useState(false);
  const [mascotBlinkKey, setMascotBlinkKey] = useState(0);
  const isInvite = step === "invite";
  const mascotVisible = mascotPinned || mascotPreview;
  const previousTabRef = useRef(activeTab);
  const rootRef = useRef<HTMLDivElement>(null);
  const smokingRef = useRef(false);
  const smokeTimeoutRef = useRef(0);
  const mascotPinnedRef = useRef(false);
  const winkNavigateTimeoutRef = useRef(0);

  const reset = () => {
    smokingRef.current = false;
    mascotPinnedRef.current = false;
    window.clearTimeout(winkNavigateTimeoutRef.current);
    setYesHovered(false);
    setBurstExitMode("reverse");
    setMascotPinned(false);
    setMascotPreview(false);
    setOptionHovered(false);
    setMascotBlinkKey(0);
    setStep("invite");
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(smokeTimeoutRef.current);
      window.clearTimeout(winkNavigateTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (burstExitMode === "smoke" && yesHovered) {
      setYesHovered(false);
    }
  }, [burstExitMode, yesHovered]);

  useEffect(() => {
    if (isInvite) {
      return;
    }

    const node = rootRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          reset();
        }
      },
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isInvite]);

  useEffect(() => {
    const previousTab = previousTabRef.current;
    previousTabRef.current = activeTab;

    if (previousTab === activeTab) {
      return;
    }

    if (!isInvite) {
      reset();
    }
  }, [activeTab, isInvite]);

  useEffect(() => {
    if (step !== "phone") {
      setPhoneLabel("contact");
      return;
    }

    setPhoneLabel("contact");
    const timeoutId = window.setTimeout(() => {
      setPhoneLabel("soon");
    }, LABEL_SWAP_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "social") {
      setSocialLabel("handles");
      return;
    }

    setSocialLabel("handles");
    const timeoutId = window.setTimeout(() => {
      setSocialLabel("bye");
    }, LABEL_SWAP_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [step]);

  let content: ReactNode;

  switch (step) {
    case "invite":
      content = (
        <>
          <span
            className={`connect-prompt-invite-label${yesHovered || burstExitMode === "smoke" ? " is-excited" : ""}`}
          >
            <AnimatePresence>
              {yesHovered ? (
                <ConnectExcitement
                  key="excitement"
                  exitMode={burstExitMode}
                />
              ) : null}
            </AnimatePresence>
            <PromptText>Let's chat?</PromptText>
          </span>
          <Options
            items={[
              {
                key: "yes",
                node: (
                  <PromptAction
                    onHoverChange={setOptionHovered}
                    onMouseEnter={() => {
                      if (
                        smokingRef.current ||
                        !window.matchMedia("(hover: hover)").matches
                      ) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(true);
                      setMascotPreview(true);
                    }}
                    onMouseLeave={() => {
                      if (smokingRef.current) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(false);
                      if (!mascotPinnedRef.current) {
                        setMascotPreview(false);
                      }
                    }}
                    onFocus={() => {
                      if (smokingRef.current) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(true);
                      setMascotPreview(true);
                    }}
                    onBlur={() => {
                      if (smokingRef.current) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(false);
                      if (!mascotPinnedRef.current) {
                        setMascotPreview(false);
                      }
                    }}
                    onClick={() => {
                      mascotPinnedRef.current = true;
                      setMascotPinned(true);
                      setOptionHovered(false);

                      if (yesHovered) {
                        smokingRef.current = true;
                        setBurstExitMode("smoke");
                        window.clearTimeout(smokeTimeoutRef.current);
                        smokeTimeoutRef.current = window.setTimeout(() => {
                          smokingRef.current = false;
                          setBurstExitMode("reverse");
                          setStep("prefer");
                        }, excitementSmokeTransition.duration * 1000);
                        return;
                      }

                      setStep("prefer");
                    }}
                  >
                    Sure
                  </PromptAction>
                ),
              },
            ]}
          />
        </>
      );
      break;
    case "prefer":
      content = (
        <>
          <PromptText>How do you prefer?</PromptText>
          <Options
            items={[
              {
                key: "social",
                node: (
                  <PromptAction
                    onHoverChange={setOptionHovered}
                    onClick={() => setStep("social")}
                  >
                    Social Media
                  </PromptAction>
                ),
              },
              {
                key: "inPerson",
                node: (
                  <PromptAction
                    onHoverChange={setOptionHovered}
                    onClick={() => setStep("inPerson")}
                  >
                    In Person
                  </PromptAction>
                ),
              },
            ]}
          />
        </>
      );
      break;
    case "social":
      content = (
        <>
          <PullLabelSlot
            labelKey={socialLabel}
            idleText={SOCIAL_LABEL_HANDLES}
            activeText={SOCIAL_LABEL_BYE}
            isActive={socialLabel === "bye"}
          />
          <Options
            items={[
              {
                key: "linkedin",
                node: (
                  <PromptLink
                    href={connect.linkedInHref}
                    onHoverChange={setOptionHovered}
                  >
                    LinkedIn
                  </PromptLink>
                ),
              },
              {
                key: "github",
                node: (
                  <PromptLink
                    href={connect.githubHref}
                    onHoverChange={setOptionHovered}
                  >
                    Github
                  </PromptLink>
                ),
              },
              {
                key: "x",
                node: (
                  <PromptLink
                    href={connect.xHref}
                    onHoverChange={setOptionHovered}
                  >
                    X
                  </PromptLink>
                ),
              },
              {
                key: "medium",
                node: (
                  <PromptLink
                    href={connect.mediumHref}
                    onHoverChange={setOptionHovered}
                  >
                    Medium
                  </PromptLink>
                ),
              },
              {
                key: "email",
                node: (
                  <PromptLink
                    href={connect.emailHref}
                    onHoverChange={setOptionHovered}
                  >
                    Email
                  </PromptLink>
                ),
              },
            ]}
          />
        </>
      );
      break;
    case "inPerson":
      content = (
        <>
          <span className="connect-prompt-coffee-phrase">
            <PromptText>Cup of</PromptText>
            <AnimatedCoffeeIcon className="connect-prompt-coffee" size={18} />
            <PromptText>sometime in Seattle?</PromptText>
          </span>
          <Options
            items={[
              {
                key: "cool",
                node: (
                  <PromptAction
                    onHoverChange={setOptionHovered}
                    onClick={() => {
                      setMascotBlinkKey((key) => key + 1);
                      window.clearTimeout(winkNavigateTimeoutRef.current);
                      winkNavigateTimeoutRef.current = window.setTimeout(
                        () => {
                          setStep("phone");
                        },
                        mascotWinkTransition.duration * 1000,
                      );
                    }}
                  >
                    Cool
                  </PromptAction>
                ),
              },
              {
                key: "nah",
                node: (
                  <PromptAction
                    onHoverChange={setOptionHovered}
                    onClick={() => setStep("phone")}
                  >
                    Nah, something else?
                  </PromptAction>
                ),
              },
            ]}
          />
        </>
      );
      break;
    case "phone":
      content = (
        <>
          <PullLabelSlot
            labelKey={phoneLabel}
            idleText={PHONE_LABEL_CONTACT}
            activeText={PHONE_LABEL_SOON}
            isActive={phoneLabel === "soon"}
          />
          <Options
            items={[
              {
                key: "phone",
                node: (
                  <PromptLink
                    href={connect.phoneHref}
                    onHoverChange={setOptionHovered}
                  >
                    {connect.phoneDisplay}
                  </PromptLink>
                ),
              },
              {
                key: "email",
                node: (
                  <PromptLink
                    href={connect.emailHref}
                    onHoverChange={setOptionHovered}
                  >
                    Email
                  </PromptLink>
                ),
              },
            ]}
          />
        </>
      );
      break;
  }

  return (
    <div
      ref={rootRef}
      className={`connect-prompt${isInvite ? "" : " connect-prompt--follow-up"}`}
      aria-live="polite"
    >
      <div className="connect-prompt-main">
        <button
          type="button"
          className={`connect-prompt-reset${isInvite ? " is-invite" : ""}`}
          onClick={isInvite ? undefined : reset}
          disabled={isInvite}
          aria-hidden={isInvite ? true : undefined}
          aria-label={isInvite ? undefined : "Start over"}
          tabIndex={isInvite ? -1 : undefined}
          data-cuelume-press={isInvite ? undefined : "bloom"}
        >
          <MorphingArrowRight variant={isInvite ? "right" : "left"} />
          {/* <MorphingConnectIcon
            variant={isInvite ? "workflow" : "send-to-back"}
          /> */}
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="connect-prompt-step"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabContentBlurVariants}
            transition={tabContentTransition}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {MASCOT_ENABLED && mascotVisible ? (
          <ConnectMascot
            key="mascot"
            eyesTilted={optionHovered}
            blinkKey={mascotBlinkKey}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
