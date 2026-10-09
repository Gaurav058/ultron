import { NextResponse } from "next/server";
import { SecurityChecker } from "@/core/tools/securityChecker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, userConsent } = body;

    if (!userConsent) {
      return NextResponse.json(
        { error: "Explicit user consent is mandatory before querying external verification." },
        { status: 403 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password input string is required." }, { status: 400 });
    }

    const result = await SecurityChecker.checkPasswordKAnonymity(password, {
      userConfirmed: true,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to execute breach verification" },
      { status: 500 }
    );
  }
}
