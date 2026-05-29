"use client";

import { ReactNode, useContext } from "react";
import { ModalContext } from "./FeatureCardsClient";

export function MoreToDiscoverItem({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const setOpenId = useContext(ModalContext);
  return (
    <button
      type="button"
      onClick={() => setOpenId?.(id)}
      className={className}
    >
      {children}
    </button>
  );
}
