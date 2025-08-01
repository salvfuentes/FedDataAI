"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import AiIcon from "@/components/AiIcon";
import ReferenceTooltip from "@/components/ReferenceTooltip";
import ReferenceContent from "@/components/ReferenceContent";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  avatarUrl?: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch conversations with error handling
  useEffect(() => {
    fetch("/api/chats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load chats");
        return res.json();
      })
      .then((data) => {
        let chats = Array.isArray(data) ? data : (data.chats || []);
        if (chats.length === 0) {
          // Create a default chat if none exist
          const localId = Date.now().toString();
          const localChat = {
            id: localId,
            title: "Default Chat",
            lastMessage: "",
            updatedAt: new Date().toISOString(),
          };
          chats = [localChat];
        }
        setConversations(chats);
        setSelectedId(chats[0].id);
      })
      .catch(() => {
        // Fallback: create a default chat if backend fails
        const localId = Date.now().toString();
        const localChat = {
          id: localId,
          title: "Default Chat",
          lastMessage: "",
          updatedAt: new Date().toISOString(),
        };
        setConversations([localChat]);
        setSelectedId(localId);
      });
  }, []);

  // Fetch messages for selected conversation with error handling
  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/chats/${selectedId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load messages");
        return res.json();
      })
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]));
  }, [selectedId]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedId) return;
    setLoading(true);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      avatarUrl: user?.imageUrl || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedId, message: input }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to get AI response");
      }
      const data = await res.json();
      let aiMsg = data.message;
      if (!aiMsg || typeof aiMsg !== "object") {
        aiMsg = {
          id: `ai-error-${Date.now()}`,
          role: "ai",
          content: "No response from AI.",
          timestamp: new Date().toISOString(),
        };
      }
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: "ai",
          content: err?.message || "AI failed to respond.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Add new chat
  const addNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      title: "Default Chat",
      lastMessage: "",
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [newChat, ...prev]);
    setSelectedId(newId);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#181c2a] to-[#2e225a] relative overflow-x-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#f3cfff] rounded-br-3xl z-0" style={{filter:'blur(8px)', opacity:0.5}} />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#f3cfff] rounded-tl-3xl z-0" style={{filter:'blur(8px)', opacity:0.5}} />
      <nav className="w-full flex items-center justify-between px-8 py-6 z-10">
        <div className="text-2xl font-bold text-white tracking-tight">FedDataAI.com</div>
        <div className="flex gap-6">
          <a href="/chat" className="text-[#bca6f7] font-semibold hover:underline">Chat</a>
          <a href="/map" className="text-[#bca6f7] font-semibold hover:underline">Map</a>
        </div>
      </nav>
      <div className="flex flex-1 w-full z-10">
        {/* Sidebar */}
        <aside className="w-80 bg-[#4b3cfa] p-6 flex flex-col justify-between rounded-l-3xl min-h-[calc(100vh-64px)]" style={{ boxShadow: '0 8px 32px 0 rgba(75,60,250,0.12)', border: 'none' }}>
          <div style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
            <h2 className="text-lg font-bold mb-4 text-white" style={{border: 'none', outline: 'none'}}>Conversations</h2>
            <button
              className="mb-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full text-xs font-semibold hover:from-pink-600 hover:to-pink-500 transition shadow-lg border-none"
              style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}
              onClick={addNewChat}
            >
              + New Chat
            </button>
            <div className="overflow-y-auto max-h-72 pr-2" style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
              <ul className="space-y-2" style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
                {Array.isArray(conversations) && conversations.length === 0 && (
                  <li className="text-white/70 text-sm" style={{border: 'none', outline: 'none'}}>No conversations yet.</li>
                )}
                {Array.isArray(conversations) && conversations.length > 0 && conversations.map((conv: Conversation) => (
                  <li key={conv.id} style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
                    <div className="flex items-center gap-2">
                      <button
                        className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-colors shadow-lg border-none ${selectedId === conv.id ? "text-white font-bold" : (conv.title === 'Local Chat' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-[#a084ee] text-white hover:bg-[#6c4cff]')}`}
                        style={selectedId === conv.id
                          ? { background: '#7c3aed', color: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }
                          : { border: 'none !important', outline: 'none !important', boxShadow: 'none !important', background: 'none' }}
                        onClick={() => setSelectedId(conv.id)}
                      >
                        <div className="w-8 h-8 rounded-full bg-white text-[#4b3cfa] flex items-center justify-center font-bold shadow-md border-none" style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
                          {conv.title ? conv.title[0].toUpperCase() : "C"}
                        </div>
                        <div className="flex-1" style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
                          <div className="font-semibold" style={{border: 'none', outline: 'none'}}>{conv.title || `Chat ${conv.id}`}</div>
                          <div className="text-xs text-white/70 truncate" style={{border: 'none', outline: 'none'}}>{conv.lastMessage || ""}</div>
                        </div>
                        <div className="text-xs text-white/70" style={{border: 'none', outline: 'none'}}>{conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString() : ""}</div>
                      </button>
                      <button
                        className="ml-1 px-2 py-1 rounded-full text-xs font-semibold bg-[#d1cfff] text-[#4b3cfa] hover:bg-[#b3aaff] transition border-none"
                        style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}
                        onClick={() => {
                          const newTitle = prompt('Rename chat:', conv.title);
                          if (newTitle && newTitle.trim()) {
                            setConversations((prev) => prev.map((chat) =>
                              chat.id === conv.id ? { ...chat, title: newTitle } : chat
                            ));
                          }
                        }}
                      >
                        Rename
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 w-full" style={{border: 'none', outline: 'none', boxShadow: 'none', background: 'none'}}>
            <div className="w-12 h-12 flex items-center justify-center shadow-lg rounded-full bg-transparent" style={{border: 'none', outline: 'none', boxShadow: '0 4px 16px 0 rgba(75,60,250,0.10)', background: 'none'}}>
              <UserButton afterSignOutUrl="/" />
              <style jsx global>{`
                .cl-userButton-root, .cl-userButton-avatarBox, .cl-userButton-avatarBox *, .cl-userButton-root * {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                  border-radius: 9999px !important;
                  background: transparent !important;
                }
              `}</style>
            </div>
          </div>
        </aside>
        {/* Chat area */}
        <section className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="p-10 w-full max-w-4xl min-h-[600px] rounded-3xl bg-[#23284a] shadow-2xl border-none flex flex-col justify-between" style={{ boxShadow: '0 8px 32px 0 rgba(75,60,250,0.10)', border: 'none' }}>
            <SignedOut>
              <div className="flex flex-col items-center gap-4">
                <p className="mb-4 text-center text-[#bca6f7]">You must sign in to access the chat.</p>
                <SignInButton mode="modal" />
              </div>
            </SignedOut>
            <SignedIn>
              <div className="mb-6 space-y-4 max-h-96 overflow-y-auto border-none" style={{border: 'none'}}>
                {messages
                  .filter(
                    (msg) =>
                      msg &&
                      typeof msg === 'object' &&
                      (msg.role === 'user' || msg.role === 'ai') &&
                      typeof msg.id === 'string' &&
                      typeof msg.content === 'string' &&
                      typeof msg.timestamp === 'string'
                  )
                  .map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`} style={{border: 'none'}}>
                      {msg.role === "ai" && (
                        <span className="w-8 h-8 flex items-center justify-center">
                          <AiIcon className="w-8 h-8" />
                        </span>
                      )}
                      <div className={`p-3 rounded-2xl shadow-lg border-none ${msg.role === "user" ? "bg-gradient-to-r from-[#a084ee] to-[#6c4cff] text-white" : "bg-[#f3f3f3] text-[#222]"}`} style={{ border: 'none' }}>
                        {msg.role === "ai"
                          ? <ReferenceContent content={msg.content} />
                          : msg.content}
                        <div className="text-xs text-[#bca6f7] mt-1 text-right" style={{border: 'none'}}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
                      </div>
                      {msg.role === "user" && (
                        <img src={user?.imageUrl || '/default-avatar.png'} alt="You" className="w-8 h-8 rounded-full shadow-md border-none" style={{border: 'none'}} />
                      )}
                    </div>
                  ))}
                {messages.length === 0 && (
                  <div className="text-center text-[#bca6f7] border-none" style={{border: 'none'}}>No messages yet. Start the conversation!</div>
                )}
                {loading && <div className="p-3 rounded-lg bg-muted animate-pulse shadow-lg border-none text-[#bca6f7]" style={{border: 'none'}}>AI is thinking...</div>}
              </div>
              <form
                className="flex gap-2 mt-4 border-none" style={{border: 'none'}}
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading || !selectedId}
                  className="flex-1 rounded-2xl border-none shadow-lg bg-[#f3f3f3] text-[#222] appearance-none focus:outline-none"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                    appearance: 'none',
                    border: 'none',
                    boxShadow: '0 2px 8px 0 rgba(75,60,250,0.04)',
                  }}
                />
                <Button type="submit" disabled={loading || !input.trim() || !selectedId} className="rounded-2xl bg-gradient-to-r from-[#a084ee] to-[#6c4cff] text-white shadow-lg hover:from-[#bca6f7] hover:to-[#a084ee]" style={{border: 'none'}}>
                  Send
                </Button>
              </form>
            </SignedIn>
          </div>
        </section>
      </div>
    </main>
  );
}
