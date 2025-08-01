import { Button } from "@/components/ui/button";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181c2a] to-[#2e225a] relative overflow-x-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#f3cfff] rounded-br-3xl z-0" style={{filter:'blur(8px)', opacity:0.5}} />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#f3cfff] rounded-tl-3xl z-0" style={{filter:'blur(8px)', opacity:0.5}} />
      <nav className="w-full flex items-center justify-between px-8 py-6 z-10">
        <div className="text-2xl font-bold text-white tracking-tight">FedDataAI.com</div>
        <div className="flex gap-6">
          <a href="/chat" className="text-[#bca6f7] font-semibold hover:underline">Chat</a>
          <a href="/filter" className="text-[#bca6f7] font-semibold hover:underline">Filter</a>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center flex-1 w-full z-10">
        <div className="max-w-2xl w-full text-center mt-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            AI-Powered Research for Government & Public Sector
          </h1>
          <p className="text-lg md:text-xl text-[#bca6f7] mb-8 font-medium">
            FedDataAI is your secure, modern platform for searching, analyzing, and chatting with government data using advanced AI. Automate research, extract insights, and collaborate—all in one place.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#a084ee] to-[#6c4cff] text-white text-lg font-semibold shadow-xl border-none hover:from-[#bca6f7] hover:to-[#a084ee] transition">
                Start for free
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <Link href="/chat">
                <Button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#a084ee] to-[#6c4cff] text-white text-lg font-semibold shadow-xl border-none hover:from-[#bca6f7] hover:to-[#a084ee] transition">
                  Go to Chat
                </Button>
              </Link>
            </div>
          </SignedIn>
        </div>
        {/* Features row */}
        <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-4xl z-10">
          <div className="bg-[#23284a] rounded-2xl p-6 flex-1 min-w-[220px] shadow-lg border border-[#3a3f5a]">
            <div className="text-xl font-bold text-white mb-2">Secure Data Search</div>
            <div className="text-[#bca6f7]">Instantly search and filter across government datasets with privacy-first AI.</div>
          </div>
          <div className="bg-[#23284a] rounded-2xl p-6 flex-1 min-w-[220px] shadow-lg border border-[#3a3f5a]">
            <div className="text-xl font-bold text-white mb-2">AI Chat & Analysis</div>
            <div className="text-[#bca6f7]">Chat with your data, summarize reports, and extract insights using advanced language models.</div>
          </div>
          <div className="bg-[#23284a] rounded-2xl p-6 flex-1 min-w-[220px] shadow-lg border border-[#3a3f5a]">
            <div className="text-xl font-bold text-white mb-2">Collaboration Tools</div>
            <div className="text-[#bca6f7]">Share findings, manage projects, and work securely with your team.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
