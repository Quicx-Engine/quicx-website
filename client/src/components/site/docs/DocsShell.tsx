"use client";

import { useState } from "react";
import { DocsSidebar } from "@/components/site/docs/DocsSidebar";
import { DocsTopbar } from "@/components/site/docs/DocsTopbar";
import { DocsTOCSlot } from "@/components/site/docs/DocsTOCSlot";
import { nav } from "@/components/site/docs/sections";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-quicx-bg">
      <DocsTopbar onMenuToggle={() => setSidebarOpen(true)} />

      <DocsSidebar
        groups={nav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="mt-[52px] flex min-h-[calc(100vh-52px)] lg:ml-[260px]">
        <main className="min-w-0 flex-1 max-w-[820px] px-4 py-8 sm:px-8 lg:px-12 lg:py-14">
          {children}
        </main>

        <div className="hidden xl:block w-[200px] shrink-0 px-5 py-14">
          <DocsTOCSlot />
        </div>
      </div>
    </div>
  );
}
