import { useEffect, useState } from "react";
import { sceneBus } from "../scene-bus";
import { useNexus } from "../store";

export function Intro() {
  const enabled = useNexus((s) => s.intro);
  const motion = useNexus((s) => s.motion);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduce) {
      sceneBus.intro = 1;
      setShow(false);
      return;
    }
    sceneBus.intro = 0;
    setShow(true);
    let alive = true;
    let timeline: { kill: () => void } | null = null;
    void import("gsap").then(({ default: gsap }) => {
      if (!alive) return;
      const mark = document.getElementById("nexus-mark");
      const tl = gsap.timeline({ onComplete: () => setShow(false) });
      timeline = tl;
      tl.to(sceneBus, { intro: 1, duration: 2.8, ease: "power2.inOut" });
      if (mark) {
        tl.fromTo(mark, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.15);
        tl.to(mark, { opacity: 0, duration: 0.45 }, 1.8);
      }
    });
    return () => {
      alive = false;
      timeline?.kill();
    };
  }, [enabled, motion]);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center">
      <button
        type="button"
        className="pointer-events-auto absolute top-4 right-4 min-h-11 rounded-xl border border-line bg-surface px-3 text-sm"
        onClick={() => {
          sceneBus.intro = 1;
          setShow(false);
        }}
      >
        Skip intro
      </button>
      <p id="nexus-mark" className="mt-16 text-3xl font-semibold tracking-[0.42em] text-fg">
        NEXUS
      </p>
    </div>
  );
}
