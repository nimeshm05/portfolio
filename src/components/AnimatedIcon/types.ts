export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

export type AnimatedIconComponentProps = {
  size?: number;
  className?: string;
};
