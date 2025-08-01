import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const BACKEND_URL = "https://feddataai-backend-1001804234114.us-central1.run.app/api/chat";

// Map state names/abbreviations to a prompt for the AI backend
function getPromptForState(state: string) {
  return `List the top 3 most interesting, surprising, or unique facts about the latest available OPM data for the state of ${state}. Use clear bullet points or numbering. For each fact, provide a reference to the real OPM data source (such as a table, dataset, or official report) as a link or citation.`;
}

export async function POST(req: NextRequest) {
  const { state } = await req.json();
  if (!state) {
    return NextResponse.json({ error: "Missing state." }, { status: 400 });
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
    // Use a synthetic conversationId for state summaries
    const conversationId = `opm-map-${state}`;
    const message = getPromptForState(state);
    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ conversationId, message }),
    });
    const data = await backendRes.json();
    const summary = data.message?.content || data.reply || data.error || "No summary available.";
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Backend error" }, { status: 500 });
  }
}
