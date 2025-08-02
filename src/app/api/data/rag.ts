export async function POST(req: NextRequest) {
  // Clerk authentication
  const auth = getAuth(req);
  if (!auth.userId || !auth.sessionId || !auth.getToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = await auth.getToken();
  if (!token) {
    return NextResponse.json({ error: "No auth token" }, { status: 401 });
  }

  // Accept ragEngine (corpus) and prompt from POST body
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {}
  const ragEngine = body.ragEngine || body.corpus || "opmdata"; // default to opmdata
  const prompt = body.prompt || "";

  try {
    // Forward request to backend with JWT, ragEngine, and prompt
    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        corpus: ragEngine,
        prompt,
        ...body, // pass through any other fields
      }),
    });
    const data = await backendRes.json();
    if (!backendRes.ok) {
      return NextResponse.json({ error: data.error || "Backend error" }, { status: backendRes.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Backend error" }, { status: 500 });
  }
}
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const BACKEND_URL = "https://feddataai-backend-1001804234114.us-central1.run.app/api/data";

export async function GET(req: NextRequest) {
  // Clerk authentication
  const auth = getAuth(req);
  if (!auth.userId || !auth.sessionId || !auth.getToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = await auth.getToken();
  if (!token) {
    return NextResponse.json({ error: "No auth token" }, { status: 401 });
  }

  try {
    // Forward request to backend with JWT
    const backendRes = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!backendRes.ok) {
      const err = await backendRes.text();
      return NextResponse.json({ error: err || "Backend error" }, { status: backendRes.status });
    }
    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Backend error" }, { status: 500 });
  }
}
