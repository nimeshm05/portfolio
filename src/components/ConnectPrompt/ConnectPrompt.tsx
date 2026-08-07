"use client";

import { Fragment, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import { MorphingConnectIcon } from "@/components/MorphingConnectIcon/MorphingConnectIcon";
import { connect } from "@/data/home";
import {
  tabContentBlurVariants,
  tabContentTransition,
} from "@/motion/tabContent";
import "./ConnectPrompt.css";

type ConnectStep = "invite" | "prefer" | "social" | "inPerson" | "phone";

function PromptText({ children }: { children: ReactNode }) {
  return <span className="connect-prompt-text">{children}</span>;
}

function PromptAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className="connect-prompt-action" onClick={onClick}>
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

export function ConnectPrompt() {
  const [step, setStep] = useState<ConnectStep>("invite");
  const isInvite = step === "invite";

  const reset = () => {
    setStep("invite");
  };

  let content: ReactNode;

  switch (step) {
    case "invite":
      content = (
        <>
          <PromptText>Wanna Connect?</PromptText>
          <Options
            items={[
              {
                key: "yes",
                node: (
                  <PromptAction onClick={() => setStep("prefer")}>
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
          <PromptText>Here&apos;s my number. Text me.</PromptText>
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
            ]}
          />
        </>
      );
      break;
  }

  return (
    <div className="connect-prompt" aria-live="polite">
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
