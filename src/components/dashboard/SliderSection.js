"use client";

import { useState } from "react";

export default function SliderSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink-800 px-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-left text-[11px] font-medium uppercase tracking-widest text-ink-300 hover:text-white"
      >
        {title}
        <span className="text-base leading-none text-ink-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="space-y-4 pb-5">{children}</div>}
    </div>
  );
}
