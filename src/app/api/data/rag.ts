import { NextResponse, NextRequest } from "next/server";
import { GoogleAuth } from "google-auth-library";
import fetch from "node-fetch";

const RAG_RESOURCE = "projects/opm2025-ai/locations/us-central1/ragCorpora/568579452955521200";
const VERTEX_RAG_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/${RAG_RESOURCE}:query`;

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {}

  const prompt = body.prompt || "Summarize the most important OPM data relevant to the user's question, citing sources where possible.";
  const userMessage = body.userMessage || "";

  // Authenticate with Google
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  // Build the RAG query
  const queryBody = {
    query: `${prompt}\n\nUser question: ${userMessage}`,
    // You can add more fields here if needed (e.g., topK, filters)
  };

  // Call Vertex AI RAG
  const response = await fetch(VERTEX_RAG_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken.token || accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryBody),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    return NextResponse.json({ error: "Vertex AI RAG did not return valid JSON." }, { status: 500 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: data.error || "Vertex AI RAG error." }, { status: response.status });
  }

  // Return the RAG answer (adjust this based on actual Vertex AI RAG response structure)
  return NextResponse.json({
    message: {
      id: `rag-ai-${Date.now()}`,
      role: "ai",
      content: data.result || data.answer || JSON.stringify(data),
      timestamp: new Date().toISOString(),
    },
    raw: data,
  });
}