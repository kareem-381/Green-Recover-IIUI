// src/app/dashboard/layout.js
"use client"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  // 🚪 Secure Eviction and Correctly-Cased Redirect Handler
  const handleSignOut = () => {
    // Clear out the cached student profile session details
    localStorage.removeItem("iiui_user_logged");
    
    // 🔠 FIXED: Points explicitly to your capitalized folder route path!
    router.push("/Signin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-black">
      
      {/* 1. MAIN NAVBAR LAYOUT */}
      <header>
        <nav className="h-15 bg-[#1f2937] flex justify-between items-center px-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
          
          {/* Group 1: Logo + Text Alignment */}
          <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
            <img src="/iiui.png" alt="iiui-logo" className="h-11.25 w-auto" />
            <span id="title" className="text-[#f0f8ff] text-[22px] font-bold">
              Green-Recover
            </span>
          </Link>

          {/* Group 2: Center Navigation Links */}
          <div className="flex gap-8">
            <Link href="/dashboard" className="text-white no-underline text-[18px] font-medium hover:text-[#eab308] transition-colors duration-200">
              Home
            </Link>
            <Link href="/dashboard/post-found" className="text-white no-underline text-[18px] font-medium hover:text-[#eab308] transition-colors duration-200">
              Post Found Item
            </Link>
            <Link href="/dashboard/post-lost" className="text-white no-underline text-[18px] font-medium hover:text-[#eab308] transition-colors duration-200">
              Post Lost Item
            </Link>
            <Link href="/dashboard/my-posts" className="text-[#84cc16] no-underline text-[18px] font-black hover:text-[#eab308] transition-colors duration-200">
          My Reports
            </Link>
          </div>

          {/* Group 3: Right Action Buttons Wrapper */}
          <div className="flex gap-4">
            <button 
              onClick={handleSignOut}
              className="px-4 py-1.5 text-[#1e293b] bg-yellow-500 rounded-[10px] text-[16px] font-semibold border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>

        </nav>
      </header>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* 3. FOOTER LAYOUT STRUCTURE */}
      <footer>
        <div className="h-12.5 bg-[#1f2937] text-white flex font-bold justify-center items-center text-[14px]">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </div>
      </footer>
      
    </div>
  );
}