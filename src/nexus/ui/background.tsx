import { useEffect, useState, type ComponentType } from "react";
import { sceneBus } from "../scene-bus";
import { useNexus, type Graphics } from "../store";

type SceneProps = { quality: "high" | "low" };

export function Background() {
  const graphics = useNexus((s) => s.graphics);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [failed, setFailed] = useState(false);
  const [quality, setQuality] = useState<"high" | "low" | "off">("low");

  useEffect(() => {
    const next = resolveQuality(graphics);
    setQuality(next);
    if (next === "off" || !hasWebGL()) {
      setFailed(!hasWebGL() && graphics !== "off");
      return;
    }
    let alive = true;
    import("./scene")
      .then((mod) => {
        if (alive) setScene(() => mod.NexusScene);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [graphics]);

  if (quality === "off" || failed || !Scene) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Scene quality={quality} />
    </div>
  );
}

function resolveQuality(graphics: Graphics): "high" | "low" | "off" {
  if (graphics === "off") return "off";
  if (graphics === "high") return "high";
  if (graphics === "low") return "low";
  const cores = navigator.hardwareConcurrency || 4;
  if (cores < 4 || window.innerWidth < 760 || sceneBus.reduced) return "low";
  return "high";
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
