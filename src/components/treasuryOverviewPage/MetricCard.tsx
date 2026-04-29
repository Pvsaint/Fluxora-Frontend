import { Metric } from "./Metric";

export default function MetricCard({ icon, label, value, desc }: Metric) {
  return (
    <div
      className="flex flex-col rounded-xl p-6 h-full"
      style={{ backgroundColor: "var(--color-surface-default)", border: "1px solid var(--color-border-default)" }}
      role="group"
      aria-label={label}
    >
      <div className="flex items-center justify-center w-10 h-10 text-3xl leading-none mb-4 shrink-0" style={{ color: "var(--color-text-secondary)" }}>
        {icon}
      </div>

      <div className="font-medium text-sm leading-5 mb-2" style={{ color: "var(--color-text-primary)" }}>
        {label}
      </div>

      <div className="text-2xl font-semibold leading-8 mb-2" style={{ color: "var(--color-text-vivid)" }}>
        {value}
      </div>

      <p className="text-sm leading-5 mt-auto" style={{ color: "var(--color-text-secondary)" }}>
        {desc}
      </p>
    </div>
  );
}
