import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { SplitText } from "gsap/SplitText";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SplitTarget = Element | Element[] | NodeListOf<Element> | string;

type SplitTextAnimationConfig = {
  type: "chars" | "words" | "lines" | "chars,words" | "words,lines" | string;

  autoSplit?: boolean;
  mask?: "chars" | "words" | "lines";

  charsClass?: string;
  wordsClass?: string;
  linesClass?: string;

  onSplit: (splitText: SplitText) => gsap.core.Tween;
};

export function splitText(
  target: SplitTarget,
  config: SplitTextAnimationConfig
) {
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
