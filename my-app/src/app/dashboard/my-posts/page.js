// src/app/dashboard/my-posts/page.js
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function MyPostsPage() {
    const router = useRouter()
    const [myPosts, setMyPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        // 1. Pull verified session profile credentials
        const sessionToken = localStorage.getItem("iiui_user_logged")
        if (!sessionToken) {
            router.push("/Signin")
            return
        }

        const user = JSON.parse(sessionToken)
        setCurrentUser(user)

        // 2. Fetch all posts and filter out only the entries matching active student's email
        async function loadMyFeed() {
            try {
                const res = await fetch("/api/posts")
                const data = await res.json()
                if (data.success) {
                    const userSpecificPosts = data.posts.filter(
                        (post) => post.email?.toLowerCase() === user.email?.toLowerCase()
                    )
                    setMyPosts(userSpecificPosts)
                }
            } catch (err) {
                console.error("Failed to compile user historical parameters:", err)
            } finally {
                setLoading(false)
            }
        }

        loadMyFeed()
    }, [router])

    // 🗑️ Remove post from UI state and call backend database purge
    const handlePurgePost = async (id) => {
        const confirmAction = window.confirm("Are you sure you want to delete this report? Once removed, it will clear off the live campus feed.")
        if (!confirmAction) return

        try {
            const res = await fetch(`/api/posts/${id}/delete`, {
                method: "DELETE"
            })
            const data = await res.json()

            if (data.success) {
                alert("Report status marked as resolved and deleted cleanly!")
                // Filter out deleted items from local view state instantly
                setMyPosts(prev => prev.filter(post => post.id !== id))
            } else {
                alert("Deletion failure: " + data.message)
            }
        } catch (err) {
            console.error("Failed to execute purge matrix payload request:", err)
        }
    }

    if (loading) {
        return (
            <div className="text-center py-20 text-slate-600 font-bold text-lg animate-pulse">
                🔄 Compiling your personal history folders...
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

            {/* HEADER CONTROLS NAVIGATION LINK BANNER */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight m-0">My Active Announcements</h2>
                    <p className="text-sm text-slate-500 m-0 mt-1">Manage, delete, or mark your posted items as resolved.</p>
                </div>
                <Link href="/dashboard" className="text-[#14532d] font-bold text-sm no-underline hover:underline">
                    ⬅ Back to Main Feed
                </Link>
            </div>

            {myPosts.length === 0 ? (
                <div className="text-center text-slate-500 py-16 font-medium bg-white border border-dashed border-slate-200 rounded-2xl shadow-xs">
                    📦 You haven't filed any reports yet, bro. Any items you report will show up right here!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPosts.map((post) => (
                        <div key={post.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between transform transition-all duration-200 hover:shadow-md">

                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${post.type === 'lost' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                        {post.type === 'lost' ? "🔴 Lost" : "🟢 Found"}
                                    </span>
                                    <span className="text-slate-400 text-xs font-bold">{post.category}</span>
                                </div>

                                <div>
                                    <h4 className="text-slate-800 font-bold text-base m-0 line-clamp-1">Missing {post.category}</h4>
                                    <p className="text-slate-400 text-xs m-0 mt-0.5">📍 Location: {post.location}</p>
                                </div>

                                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed m-0 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    {post.description}
                                </p>
                            </div>

                            {/* DANGEROUS MANAGEMENT PURGE ZONE CONSOLE */}
                            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-between items-center gap-3">
                                <Link href={`/dashboard/posts/${post.id}`} className="text-xs font-bold text-slate-500 no-underline hover:text-[#14532d] transition-colors">
                                    🔍 View Details
                                </Link>

                                <button
                                    onClick={() => handlePurgePost(post.id)}
                                    className="bg-red-500 hover:bg-red-600 border-none text-white font-bold text-xs py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                                >
                                    🗑️ Resolve & Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}