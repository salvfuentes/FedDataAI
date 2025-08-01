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
