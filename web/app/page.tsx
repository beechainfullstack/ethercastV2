"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

type Status =
  | "waiting"
  | "not-in-world-app"
  | "awaiting-world-app"
  | "open-from-world-app"
  | "verifying-backend"
  | "verified-on-chain"
  | "verification-not-completed"
  | "verification-failed"
  | "error";

export default function Page() {
  const [status, setStatus] = useState<Status>("waiting");
  const [details, setDetails] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const action = "ethercast-presence";

  async function handleVerify() {
    if (isBusy) return;

    setDetails(null);

    if (!MiniKit.isInstalled()) {
      setStatus("not-in-world-app");
      setDetails("open this mini app from within World App to continue.");
      return;
    }

    setIsBusy(true);
    setStatus("awaiting-world-app");

    try {
      const result = await MiniKit.commands
        .verify({
          action,
          signal: undefined
        })
        .catch((err: unknown) => {
          console.error("MiniKit verify error:", err);
          return null;
        });

      if (!result || (result as any).status !== "success") {
        setStatus("verification-not-completed");
        setDetails("verification was rejected, cancelled, or did not complete.");
        return;
      }

      const payload = (result as any).payload;
      setStatus("verifying-backend");

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          payload,
          action,
          signal: undefined
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Backend verification failed:", body);
        setStatus("verification-failed");
        setDetails("backend could not validate the proof.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data?.onChain === "ok") {
        setStatus("verified-on-chain");
        setDetails("presence etched on world chain.");
      } else if (data?.onChain === "skipped") {
        setStatus("verification-failed");
        setDetails("proof verified, but on-chain write not configured.");
      } else {
        setStatus("verification-failed");
        setDetails("verification succeeded but on-chain result is unknown.");
      }
    } catch (err) {
      console.error("Unexpected verify flow error:", err);
      setStatus("error");
      setDetails("something went wrong.");
    } finally {
      setIsBusy(false);
    }
  }

  function renderStatusLabel() {
    switch (status) {
      case "waiting":
        return "waiting";
      case "not-in-world-app":
        return "open from world app to continue";
      case "awaiting-world-app":
        return "awaiting world app";
      case "open-from-world-app":
        return "open from world app to continue";
      case "verifying-backend":
        return "verifying proof in the backend";
      case "verified-on-chain":
        return "verified on world chain";
      case "verification-not-completed":
        return "verification not completed";
      case "verification-failed":
        return "verification failed";
      case "error":
      default:
        return "something went wrong";
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-10 bg-ink text-accent">
      <section className="max-w-xl w-full flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl tracking-widest font-medium">
            a small door into the world below
          </h1>
          <p className="text-sm text-muted">
            this app listens for a single proof that you exist.
          </p>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isBusy}
          className="mt-6 px-8 py-3 border border-accent/40 rounded-full text-sm uppercase tracking-widest hover:bg-accent/5 disabled:opacity-40 transition-colors"
        >
          verify presence
        </button>

        <div className="mt-8 w-full text-left border-t border-accent/10 pt-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-muted">
              status
            </span>
            <span className="font-mono text-[0.7rem]">
              {renderStatusLabel()}
            </span>
          </div>
          {details && (
            <p className="text-[0.7rem] text-muted leading-relaxed">
              {details}
            </p>
          )}
        </div>
      </section>

      <footer className="w-full flex items-center justify-between text-[0.6rem] text-muted font-mono tracking-widerish uppercase">
        <span>worldchain mini app</span>
        <span>proof or nothing</span>
      </footer>
    </main>
  );
}
