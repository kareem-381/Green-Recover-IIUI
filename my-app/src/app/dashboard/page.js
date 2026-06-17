// src/app/dashboard/page.js
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardHome() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [category, setCategory] = useState("all")
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch("/api/posts")
        const data = await res.json()
        if (data.success) {
          setPosts(data.posts)
        }
      } catch (err) {
        console.error("Failed to load live database feed:", err)
      }
    }

    const sessionToken = localStorage.getItem("iiui_user_logged")
    if (sessionToken) {
      setCurrentUser(JSON.parse(sessionToken))
    } else {
      router.push("/Signin")
    }

    loadFeed()
  }, [router])

  // 🔥 GENDER PRIVACY FIREWALL & FILTER MATCH ENGINE
  // src/app/dashboard/page.js

// 🔥 CRASH-PROOFED CAMPUS FILTER MATCH ENGINE
const filteredPosts = posts.filter((post) => {
  // 1. Gender Privacy Firewall Check
  if (currentUser && post.gender?.toLowerCase() !== currentUser.gender?.toLowerCase()) {
    return false
  }

  // 2. 🎯 FIX: Fallback safely to category since "title" column doesn't exist in your SQL schema
  const itemTitle = post.category || "Uncategorized Item";
  const itemDescription = post.description || "";
  const currentSearchTerm = search ? search.toLowerCase() : "";

  // 3. Safe string matching logic execution
  const matchesSearch = 
    itemTitle.toLowerCase().includes(currentSearchTerm) || 
    itemDescription.toLowerCase().includes(currentSearchTerm);
    
  const matchesType = filterType === "all" || post.type === filterType
  const matchesCategory = category === "all" || post.category === category

  return matchesSearch && matchesType && matchesCategory
})

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* HEADER BANNER WITH CONDITIONAL ADMIN LINK PORTAL */}
      <div className="bg-linear-to-r from-[#0c1a12] to-[#14532d] rounded-2xl p-6 md:p-8 shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Campus Feed</h1>
          <p className="text-[#bbf7d0]/80 text-sm md:text-base mt-2 max-w-2xl m-0">
            Welcome <span className="text-[#84cc16] font-bold">{currentUser?.full_name || "Student"}</span>!
            You are viewing the <span className="underline decoration-[#84cc16] font-bold">{currentUser?.gender} Campus Feed.</span>
          </p>
        </div>

        {/* 🛡️ SECURITY CONTROL GATEWAY: Only renders link if matching your whitelisted admin emails */}
        {currentUser && [
          "admin@iiu.edu.pk",
          "security@iiu.edu.pk",
          "abdulkareem7646767@gmail.com",
          "abdulkareem.bscs4971@student.iiu.edu.pk"
        ].includes(currentUser.email?.toLowerCase()) && (
          <Link
            href="/dashboard/admin"
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all duration-200 no-underline shadow-md flex items-center gap-1.5 self-end md:self-auto hover:scale-105 transform"
          >
            🛡️ Launch Admin Console
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* FILTERS SIDEBAR */}
        <div className="bg-[#0c1a12] border border-[#14532d] rounded-2xl p-6 space-y-6 lg:sticky lg:top-6 shadow-xl">
          <div className="border-b border-[#14532d]/40 pb-3">
            <h3 className="text-[#f0fdf4] text-lg font-bold tracking-wide">Filter Dashboard</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[#4ade80] text-xs uppercase font-extrabold tracking-wider block">Search</label>
            <input
              type="text"
              placeholder="Search item keys, wallets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#14532d] px-4 py-2.5 rounded-xl text-[#bbf7d0] text-sm placeholder-[#bbf7d0]/40 border border-transparent focus:border-[#4ade80]/30 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#4ade80] text-xs uppercase font-extrabold tracking-wider block">Item Status</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#14532d] px-4 py-2.5 rounded-xl text-[#bbf7d0] text-sm outline-none cursor-pointer border border-transparent"
            >
              <option value="all">All Declarations</option>
              <option value="lost">🔴 Lost Reports</option>
              <option value="found">🟢 Found Declarations</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[#4ade80] text-xs uppercase font-extrabold tracking-wider block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#14532d] px-4 py-2.5 rounded-xl text-[#bbf7d0] text-sm outline-none cursor-pointer border border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="ID Card">ID Cards / Documents</option>
              <option value="Wallet">Wallets / Currency</option>
              <option value="Keys">Keys / Keychains</option>
              <option value="Electronics">Electronics / Gadgets</option>
              <option value="Other">Other Items</option>
            </select>
          </div>
        </div>

        {/* LIVE SECURE CARDS FEED GRID */}
        <div className="lg:col-span-3">
          {filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-10 font-medium bg-[#0c1a12]/10 border border-dashed border-slate-200 rounded-2xl">
              No live announcements found on your campus segment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                return (
                  <div key={post.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">

                    {post.image_path && (
                      <div className="w-full h-48 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                        <img src={post.image_path} alt={post.category} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${post.type === 'lost' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                            {post.type === 'lost' ? "🔴 Lost" : "🟢 Found"}
                          </span>
                          <span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                            {post.category}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-slate-800 text-lg font-bold tracking-tight line-clamp-1">
                            {post.type === 'lost' ? 'Missing' : 'Found'} {post.category}
                          </h3>
                          <p className="text-emerald-700 text-xs flex items-center gap-1 font-medium bg-emerald-50/50 py-1 px-2 rounded-md w-fit">
                            📍 {post.location}
                          </p>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      </div>

                      <div className="pt-4">
                        <Link
                          href={`/dashboard/posts/${post.id}`}
                          className="w-full text-center block bg-[#14532d] hover:bg-[#0c1a12] text-[#4ade80] font-bold text-xs py-3 px-4 rounded-xl transition-colors duration-200 no-underline shadow-xs"
                        >
                          🔍 View Details & Contact
                        </Link>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-3.5 flex justify-between items-center text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-full bg-[#14532d] text-[#bbf7d0] font-bold text-[10px] flex justify-center items-center uppercase">
                          {post.full_name?.charAt(0)}
                        </div>
                        <span>{post.full_name}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] italic">{post.time_found}</span>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}