"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ConnectExcitement, type ExcitementExitMode } from "@/components/ConnectExcitement/ConnectExcitement";
import { Icon } from "@/components/Icon/Icon";
import { MorphingConnectIcon } from "@/components/MorphingConnectIcon/MorphingConnectIcon";
import { connect, type HomeTab } from "@/data/home";
import {
  PHONE_WAVE_EMOJI,
  excitementSmokeTransition,
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

const PHONE_LABEL_CONTACT = "Here's my number and email.";
const PHONE_LABEL_SOON = `I'll see you soon my fren ${PHONE_WAVE_EMOJI}`;
const PHONE_LABEL_DELAY_MS = 1500;

function PromptText({ children }: { children: ReactNode }) {
  return <span className="connect-prompt-text">{children}</span>;
}

function PromptAction({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: {
  children: ReactNode;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <button
      type="button"
      className="connect-prompt-action"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
}

function PromptLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className="connect-prompt-action"
      href={href}
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

function PhoneLabelSlot({ phoneLabel }: { phoneLabel: PhoneLabel }) {
  const visibleText =
    phoneLabel === "soon" ? PHONE_LABEL_SOON : PHONE_LABEL_CONTACT;

  return (
    <span className="connect-prompt-phone-label">
      <span
        className="connect-prompt-phone-label-sizer connect-prompt-text"
        aria-hidden="true"
      >
        {PHONE_LABEL_CONTACT}
      </span>
      <span
        className="connect-prompt-phone-label-sizer connect-prompt-text"
        aria-hidden="true"
      >
        {PHONE_LABEL_SOON}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <WordPullText
          key={phoneLabel}
          text={visibleText}
          animateEntrance={phoneLabel === "soon"}
        />
      </AnimatePresence>
    </span>
  );
}

export function ConnectPrompt({ activeTab }: { activeTab: HomeTab }) {
  const [step, setStep] = useState<ConnectStep>("invite");
  const [phoneLabel, setPhoneLabel] = useState<PhoneLabel>("contact");
  const [yesHovered, setYesHovered] = useState(false);
  const [burstExitMode, setBurstExitMode] =
    useState<ExcitementExitMode>("reverse");
  const isInvite = step === "invite";
  const previousTabRef = useRef(activeTab);
  const rootRef = useRef<HTMLDivElement>(null);
  const smokingRef = useRef(false);
  const smokeTimeoutRef = useRef(0);

  const reset = () => {
    smokingRef.current = false;
    setYesHovered(false);
    setBurstExitMode("reverse");
    setStep("invite");
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(smokeTimeoutRef.current);
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
    }, PHONE_LABEL_DELAY_MS);

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
            <PromptText>Wanna Connect?</PromptText>
          </span>
          <Options
            items={[
              {
                key: "yes",
                node: (
                  <PromptAction
                    onMouseEnter={() => {
                      if (
                        smokingRef.current ||
                        !window.matchMedia("(hover: hover)").matches
                      ) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(true);
                    }}
                    onMouseLeave={() => {
                      if (smokingRef.current) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(false);
                    }}
                    onFocus={() => {
                      if (smokingRef.current) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(true);
                    }}
                    onBlur={() => {
                      if (smokingRef.current) {
                        return;
                      }
                      setBurstExitMode("reverse");
                      setYesHovered(false);
                    }}
                    onClick={() => {
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
                    Yes
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
                  <PromptAction onClick={() => setStep("social")}>
                    Social Media
                  </PromptAction>
                ),
              },
              {
                key: "inPerson",
                node: (
                  <PromptAction onClick={() => setStep("inPerson")}>
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
          <PromptText>My handles:</PromptText>
          <Options
            items={[
              {
                key: "linkedin",
                node: (
                  <PromptLink href={connect.linkedInHref}>LinkedIn</PromptLink>
                ),
              },
              {
                key: "github",
                node: (
                  <PromptLink href={connect.githubHref}>Github</PromptLink>
                ),
              },
              {
                key: "x",
                node: <PromptLink href={connect.xHref}>X</PromptLink>,
              },
              {
                key: "email",
                node: <PromptLink href={connect.emailHref}>Email</PromptLink>,
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
            <Icon name="coffee" className="connect-prompt-coffee" size={18} />
            <PromptText>sometime in Seattle?</PromptText>
          </span>
          <Options
            items={[
              {
                key: "cool",
                node: (
                  <PromptAction onClick={() => setStep("phone")}>
                    Cool
                  </PromptAction>
                ),
              },
              {
                key: "nah",
                node: (
                  <PromptAction onClick={() => setStep("phone")}>
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
          <PhoneLabelSlot phoneLabel={phoneLabel} />
          <Options
            items={[
              {
                key: "phone",
                node: (
                  <PromptLink href={connect.phoneHref}>
                    {connect.phoneDisplay}
                  </PromptLink>
                ),
              },
              {
                key: "email",
                node: <PromptLink href={connect.emailHref}>Email</PromptLink>,
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
      <button
        type="button"
        className={`connect-prompt-reset${isInvite ? " is-invite" : ""}`}
        onClick={isInvite ? undefined : reset}
        disabled={isInvite}
        aria-hidden={isInvite ? true : undefined}
        aria-label={isInvite ? undefined : "Start over"}
        tabIndex={isInvite ? -1 : undefined}
      >
        <MorphingConnectIcon
          variant={isInvite ? "workflow" : "send-to-back"}
        />
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
  );
}
