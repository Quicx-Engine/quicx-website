"use client";

import { useState } from "react";
import { DocsSidebar } from "@/components/site/docs/DocsSidebar";
import { DocsTopbar } from "@/components/site/docs/DocsTopbar";
import { DocsTOCSlot } from "@/components/site/docs/DocsTOCSlot";
import { DocsPager } from "@/components/site/docs/DocsPager";
import { nav } from "@/components/site/docs/sections";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-quicx-bg">
      <DocsTopbar onMenuToggle={() => setSidebarOpen(true)} />

      <DocsSidebar groups={nav} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pt-14 lg:pl-[272px]">
        <div className="mx-auto flex w-full max-w-[1100px] gap-12 px-5 sm:px-8 lg:px-12 xl:gap-16">
          <main id="main" className="min-w-0 max-w-[760px] flex-1 pb-20 pt-10 lg:pt-14">
            {children}
            <DocsPager groups={nav} />
          </main>

          <aside className="hidden w-[208px] shrink-0 pt-14 xl:block">
            <DocsTOCSlot />
          </aside>
        </div>
      </div>
    </div>
  );
}
