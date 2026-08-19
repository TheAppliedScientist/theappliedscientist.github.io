"use client";

import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";

export type EvidenceTab = { label: string; content: ReactNode };

export default function EvidenceDrawer({ title, trigger, children, tabs }: {
  title: string;
  trigger: string;
  children?: ReactNode;
  tabs?: EvidenceTab[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [activeTab, setActiveTab] = useState(0);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button ref={triggerRef} type="button" className="evidence-trigger"
        onClick={() => dialogRef.current?.showModal()}>
        <span>{trigger}</span>
        <span aria-hidden="true">Open evidence ↗</span>
      </button>
      <dialog ref={dialogRef} className="evidence-dialog" aria-labelledby={titleId}
        onClose={() => triggerRef.current?.focus()}
        onClick={(event) => { if (event.target === dialogRef.current) close(); }}>
        <div className="evidence-sheet">
          <header className="evidence-head">
            <div>
              <p className="eyebrow">Supporting evidence</p>
              <h2 id={titleId}>{title}</h2>
            </div>
            <button type="button" className="evidence-close" onClick={close} aria-label="Close evidence">
              <span aria-hidden="true">×</span>
            </button>
          </header>
          {tabs?.length ? (
            <>
              <div className="evidence-tabs" role="tablist" aria-label={title}>
                {tabs.map((tab, index) => (
                  <button type="button" role="tab" aria-selected={activeTab === index}
                    key={tab.label} onClick={() => setActiveTab(index)}>{tab.label}</button>
                ))}
              </div>
              <div className="evidence-content" role="tabpanel">{tabs[activeTab]?.content}</div>
            </>
          ) : <div className="evidence-content">{children}</div>}
        </div>
      </dialog>
    </>
  );
}
