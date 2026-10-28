import { useEffect, useRef, useState } from "react";
import { approximateIntersections, approximateRoots, sampleExpression, splitSegments, yIntercept } from "../engine/graph";
import { formatNumber } from "../engine/evaluate";
import { useNexus } from "../store";
import { fieldClass, Panel } from "./panel";

const SERIES = ["--color-series-1", "--color-series-2", "--color-series-3", "--color-series-4", "--color-series-5"];

export default function GraphPanel() {
  const angle = useNexus((s) => s.angle);
  const functions = useNexus((s) => s.functions);
  const patch = useNexus((s) => s.patch);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const view = useRef({ cx: 0, cy: 0, scale: 42 });
  const [hover, setHover] = useState("Drag to pan. Scroll or pinch to zoom.");
  const redraw = useRef<() => void>(() => undefined);
  const [note, setNote] = useState("");
  const [range, setRange] = useState({ min: "-10", max: "10" });

  function saveFns(next: typeof functions) {
    patch({ functions: next });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame = 0;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }
      const styles = getComputedStyle(document.documentElement);
      const fg = styles.getPropertyValue("--color-fg").trim() || "#e7eefc";
      const muted = styles.getPropertyValue("--color-muted").trim() || "#93a4c8";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { cx, cy, scale } = view.current;
      const xmin = cx - width / 2 / scale;
      const xmax = cx + width / 2 / scale;
      const ymin = cy - height / 2 / scale;
      const ymax = cy + height / 2 / scale;
      const tx = (x: number) => (width / 2 + (x - cx) * scale) * dpr;
      const ty = (y: number) => (height / 2 - (y - cy) * scale) * dpr;
      const raw = 70 / scale;
      const pow = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-6)));
      const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10;
      ctx.font = `${11 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.lineWidth = dpr;
      ctx.fillStyle = muted;
      ctx.strokeStyle = "rgba(128,160,210,0.18)";
      for (let x = Math.ceil(xmin / step) * step; x <= xmax; x += step) {
        ctx.beginPath();
        ctx.moveTo(tx(x), 0);
        ctx.lineTo(tx(x), canvas.height);
        ctx.stroke();
        ctx.fillText(formatNumber(x, 4), tx(x) + 4, Math.min(canvas.height - 6, Math.max(14 * dpr, ty(0) + 14 * dpr)));
      }
      for (let y = Math.ceil(ymin / step) * step; y <= ymax; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, ty(y));
        ctx.lineTo(canvas.width, ty(y));
        ctx.stroke();
        if (Math.abs(y) > 1e-9) ctx.fillText(formatNumber(y, 4), 6, ty(y) - 4);
      }
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.moveTo(tx(0), 0);
      ctx.lineTo(tx(0), canvas.height);
      ctx.moveTo(0, ty(0));
      ctx.lineTo(canvas.width, ty(0));
      ctx.stroke();
      const notes: string[] = [];
      functions.forEach((fn, index) => {
        if (!fn.enabled) return;
        const color = styles.getPropertyValue(SERIES[index % SERIES.length]).trim() || "#22d3ee";
        const sampled = sampleExpression(fn.expression, angle, xmin, xmax, Math.min(900, Math.floor(width * 1.4)));
        if (sampled.error) {
          notes.push(`y${index + 1}: ${sampled.error}`);
          return;
        }
        const segments = splitSegments(sampled.points, (ymax - ymin) * 0.8);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        for (const segment of segments) {
          segment.forEach((point, i) => {
            const X = tx(point.x);
            const Y = ty(point.y);
            if (i === 0) ctx.moveTo(X, Y);
            else ctx.lineTo(X, Y);
          });
        }
        ctx.stroke();
        if (index === 0) {
          const roots = approximateRoots(fn.expression, angle, xmin, xmax);
          if (roots.length) notes.push(`Approx. x-intercepts of the first curve: ${roots.slice(0, 6).map((r) => formatNumber(r, 6)).join(", ")}`);
          const y0 = yIntercept(fn.expression, angle);
          if (y0 !== null && y0 >= ymin && y0 <= ymax) notes.push(`Approx. y-intercept: ${formatNumber(y0, 6)}`);
        }
      });
      const enabled = functions.filter((fn) => fn.enabled);
      if (enabled.length >= 2) {
        const hits = approximateIntersections(enabled[0].expression, enabled[1].expression, angle, xmin, xmax);
        if (hits.length) notes.push(`Approx. intersections of the first two curves: ${hits.slice(0, 5).map((r) => formatNumber(r, 5)).join(", ")}`);
      }
      setNote(notes.join(" · "));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    schedule();
    redraw.current = schedule;
    const observer = new ResizeObserver(schedule);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [angle, functions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pointers = new Map<number, PointerEvent>();
    let drag: { x: number; y: number } | null = null;
    const moveHover = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { cx, cy, scale } = view.current;
      const x = cx + (event.clientX - rect.left - rect.width / 2) / scale;
      const y = cy - (event.clientY - rect.top - rect.height / 2) / scale;
      setHover(`x = ${formatNumber(x, 6)}, y = ${formatNumber(y, 6)}`);
    };
    const onDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, event);
      drag = { x: event.clientX, y: event.clientY };
    };
    const onMove = (event: PointerEvent) => {
      moveHover(event);
      if (pointers.size === 2 && pointers.has(event.pointerId)) {
        const before = [...pointers.values()];
        const d0 = Math.hypot(before[0].clientX - before[1].clientX, before[0].clientY - before[1].clientY);
        pointers.set(event.pointerId, event);
        const after = [...pointers.values()];
        const d1 = Math.hypot(after[0].clientX - after[1].clientX, after[0].clientY - after[1].clientY);
        if (d0) view.current.scale = clamp(view.current.scale * (d1 / d0), 2, 4000);
        redraw.current();
        return;
      }
      if (pointers.has(event.pointerId)) pointers.set(event.pointerId, event);
      if (!drag || pointers.size !== 1) return;
      view.current.cx -= (event.clientX - drag.x) / view.current.scale;
      view.current.cy += (event.clientY - drag.y) / view.current.scale;
      drag = { x: event.clientX, y: event.clientY };
      redraw.current();
    };
    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      drag = null;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      view.current.scale = clamp(view.current.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12), 2, 4000);
      redraw.current();
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  function applyRange() {
    const min = Number(range.min);
    const max = Number(range.max);
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    view.current.cx = (min + max) / 2;
    view.current.scale = canvas.clientWidth / (max - min);
    view.current.cy = 0;
    patch({ functions: [...functions] });
  }

  return (
    <Panel
      eyebrow="Graph"
      title="Functions of x"
      actions={
        <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={() => exportPng(canvasRef.current)}>
          Export PNG
        </button>
      }
    >
      <div className="space-y-2">
        {functions.map((fn, index) => (
          <div key={fn.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fn.enabled}
              aria-label={`Show function ${index + 1}`}
              onChange={(event) => saveFns(functions.map((item) => (item.id === fn.id ? { ...item, enabled: event.target.checked } : item)))}
            />
            <span className="font-mono text-sm text-muted">y =</span>
            <input
              className={fieldClass}
              aria-label={`Function ${index + 1}`}
              value={fn.expression}
              onChange={(event) => saveFns(functions.map((item) => (item.id === fn.id ? { ...item, expression: event.target.value } : item)))}
            />
            <button type="button" className="grid size-11 place-items-center rounded-xl border border-line" aria-label={`Remove function ${index + 1}`} onClick={() => saveFns(functions.filter((item) => item.id !== fn.id))}>
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <button
          type="button"
          className="min-h-11 rounded-xl border border-line px-3 text-sm"
          onClick={() => functions.length < 5 && saveFns([...functions, { id: `f${Date.now()}`, expression: "cos(x)", enabled: true }])}
        >
          Add function
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl border border-line px-3 text-sm"
          onClick={() => {
            view.current = { cx: 0, cy: 0, scale: 42 };
            patch({ functions: [...functions] });
          }}
        >
          Reset view
        </button>
        <label className="text-xs text-muted">
          xmin
          <input className={`${fieldClass} w-24`} value={range.min} onChange={(event) => setRange({ ...range, min: event.target.value })} />
        </label>
        <label className="text-xs text-muted">
          xmax
          <input className={`${fieldClass} w-24`} value={range.max} onChange={(event) => setRange({ ...range, max: event.target.value })} />
        </label>
        <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={applyRange}>
          Apply range
        </button>
      </div>
      <canvas ref={canvasRef} className="mt-3 h-[min(58vh,440px)] w-full touch-none rounded-xl bg-bg/40" />
      <p className="mt-2 text-sm text-muted">{hover}</p>
      <p className="text-sm text-muted">{note || "Intercepts and intersections are numerical approximations."}</p>
    </Panel>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function exportPng(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = "nexus-graph.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
