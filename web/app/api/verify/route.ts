import { NextRequest, NextResponse } from "next/server";
import {
  verifyCloudProof,
  type ISuccessResult
} from "@worldcoin/minikit-js";
import { recordPresenceOnWorldChain } from "../../../../lib/worldchain";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<IRequestPayload> | null;

    if (!body || !body.payload || !body.action) {
      return NextResponse.json(
        { error: "invalid request body" },
        { status: 400 }
      );
    }

    const appId = process.env.APP_ID;
    if (!appId) {
      console.error("APP_ID env var is not set on server.");
      return NextResponse.json(
        { error: "server misconfigured" },
        { status: 500 }
      );
    }

    const verifyRes = await verifyCloudProof(body.payload, appId, body.action);

    if (!verifyRes.success) {
      return NextResponse.json(
        { verifyRes },
        { status: 400 }
      );
    }

    let onChain: "ok" | "skipped" | "failed" = "skipped";
    try {
      const nullifierHash =
        (body.payload as any)?.nullifier_hash ??
        (verifyRes as any)?.nullifier_hash;
      onChain = await recordPresenceOnWorldChain(nullifierHash);
    } catch (err) {
      console.error("On-chain side effect error:", err);
      onChain = "failed";
    }

    return NextResponse.json(
      { verifyRes, onChain },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected verify error:", err);
    return NextResponse.json(
      { error: "unable to verify proof" },
      { status: 500 }
    );
  }
}
