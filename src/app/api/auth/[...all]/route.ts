import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = async (req: NextRequest) => {
  try {
    return await handlers.GET(req);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("BetterAuth GET error:", error);
    return NextResponse.json(
      { message: error?.message || String(err), code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return await handlers.POST(req);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("BetterAuth POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal authentication error", code: "AUTH_ERROR" },
      { status: 500 }
    );
  }
};
