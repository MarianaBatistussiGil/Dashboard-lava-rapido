export default function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`min-w-0 rounded-2xl border border-ink-800 bg-ink-900/60 p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-medium text-white">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
