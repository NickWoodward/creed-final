import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { SplitText } from "gsap/SplitText";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SplitTarget = Element | Element[] | NodeListOf<Element> | string;

type SplitTextConfig = {
  type: "chars" | "words" | "lines" | "chars,words" | "words,lines" | string;

  autoSplit?: boolean;
  mask?: "chars" | "words" | "lines";

  charsClass?: string;
  wordsClass?: string;
  linesClass?: string;

  onSplit: (splitText: SplitText) => gsap.core.Tween;
};

export function splitText(target: SplitTarget, config: SplitTextConfig) {
  let animation: gsap.core.Tween | undefined;
  let onSplit = config.onSplit;

  config.onSplit = (self) => {
    let parent;
    let startTime;
    if (animation) {
      parent = animation.parent;
      startTime = animation.startTime();
      animation.kill();
    }
    animation = onSplit && onSplit(self);
    parent && parent.add(animation, startTime || 0);

    return animation;
  };

  SplitText.create(target, config);
  return animation!;
}

type CreateAnimation = (
  self: SplitText
) => gsap.core.Tween | gsap.core.Timeline;

export type SplitTextWithAnimate = SplitText & {
  animate?: (
    create: CreateAnimation
  ) => gsap.core.Tween | gsap.core.Timeline | undefined;
};

type SplitTextAnimationConfig = {
  type: "chars" | "words" | "lines" | "chars,words" | "words,lines" | string;

  autoSplit?: boolean;
  mask?: "chars" | "words" | "lines";

  charsClass?: string;
  wordsClass?: string;
  linesClass?: string;

  onSplit?: (splitText: SplitText) => gsap.core.Tween;
};

export function SplitTextAnimator(
  target: SplitTarget,
  config: SplitTextAnimationConfig
) {
  const originalOnSplit = config.onSplit;
  const subscribers: Array<(self: SplitText) => void> = [];

  const customSplitText: SplitTextWithAnimate = SplitText.create(target, {
    ...config,
    autoSplit: true,
    onSplit(self) {
      subscribers.forEach((f) => f(self));
      originalOnSplit && originalOnSplit(self);
    },
  });

  // create is the animation provided to the animate call
  customSplitText.animate = (create: CreateAnimation) => {
    let animation: gsap.core.Tween | gsap.core.Timeline | undefined;

    const onSplit = (self: SplitText) => {
      let parent;
      let startTime;
      if (animation) {
        parent = animation.parent;
        startTime = animation.startTime();
        animation.kill();
      }
      animation = create && create(self);
      parent && parent.add(animation, startTime || 0);
    };
    subscribers.push(onSplit);
    onSplit(customSplitText);
    return animation;
  };

  return customSplitText;
}

export function getSamePageAnchor(link: HTMLAnchorElement) {
  if (
    link.protocol !== window.location.protocol ||
    link.host !== window.location.host ||
    link.pathname !== window.location.pathname ||
    link.search !== window.location.search
  ) {
    return false;
  }

  return link.hash;
}
