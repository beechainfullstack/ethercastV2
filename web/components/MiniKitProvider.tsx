"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

type Props = {
  children: ReactNode;
};

export function MiniKitProvider({ children }: Props) {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    if (!appId) {
      console.warn("NEXT_PUBLIC_APP_ID is not set; MiniKit will not be initialized.");
      return;
    }

    MiniKit.init({
      app_id: appId
    });
  }, []);

  return <>{children}</>;
}
