import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const BACKEND_URL = "https://feddataai-backend-1001804234114.us-central1.run.app/api/chat";

export async function POST(req: NextRequest) {
  const { conversationId, message } = await req.json();
  if (!message || !conversationId) {
    return NextResponse.json({ error: "Missing message or conversationId." }, { status: 400 });
  }

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
    // Forward request to backend with JWT and conversationId
    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ conversationId, message }),
    });
    const data = await backendRes.json();
    // Accept either {message} or {reply}, always generate a unique id for fallback
    const fallbackId = `ai-error-${Date.now()}`;
    return NextResponse.json({ message: data.message || { id: fallbackId, role: "ai", content: data.reply || data.error || "No response.", timestamp: new Date().toISOString() } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Backend error" }, { status: 500 });
  }
}
