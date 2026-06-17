// src/app/dashboard/admin/page.js
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboardPage() {
    const router = useRouter()
    const [allPosts, setAllPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    const [adminSearch, setAdminSearch] = useState("")
    const [adminGenderFilter, setAdminGenderFilter] = useState("all")

    const ALLOWED_ADMIN_EMAILS = [
        "abdulkareem.bscs4971@student.iiu.edu.pk",
        "abdulkareem7646767@gmail.com",
        "admin@iiu.edu.pk"
    ]

    useEffect(() => {
        const sessionToken = localStorage.getItem("iiui_user_logged")
        if (!sessionToken) {
            router.push("/Signin")
            return
        }

        const user = JSON.parse(sessionToken)

        if (!ALLOWED_ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
            alert("🔒 Access Denied: You do not have administrative security clearance.")
            router.push("/dashboard")
            return
        }

        setIsAdmin(true)

        async function loadMasterFeed() {
            try {
                const res = await fetch("/api/posts")
                const data = await res.json()
                if (data.success) {
                    setAllPosts(data.posts)
                }
            } catch (err) {
                console.error("Admin data array extraction error:", err)
            } finally {
                setLoading(false)
            }
        }

        loadMasterFeed()
    }, [router])

    const handleAdminDelete = async (id, title) => {
        const confirmOverride = window.confirm(`⚠️ ADMIN OVERRIDE: Are you absolutely sure you want to FORCE DELETE "${title}"?`)
        if (!confirmOverride) return

        try {
            const res = await fetch(`/api/posts/${id}/delete`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                alert("🛡️ Admin Override Success: Post removed.")
                setAllPosts(prev => prev.filter(post => post.id !== id))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleToggleBan = async (studentEmail, currentStatus) => {
        const targetAction = currentStatus === 'banned' ? 'active' : 'banned'
        const confirmBan = window.confirm(`Change access status to [${targetAction.toUpperCase()}]?`)
        if (!confirmBan) return

        try {
            const res = await fetch("/api/admin/ban", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: studentEmail, action: targetAction })
            })
            const data = await res.json()
            if (data.success) {
                alert(`🛡️ Status updated to ${targetAction}!`)
                setAllPosts(prev => prev.map(post => {
                    if (post.email?.toLowerCase().trim() === studentEmail.toLowerCase().trim()) {
                        return { ...post, status: targetAction }
                    }
                    return post
                }))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const filteredAdminPosts = allPosts.filter((post) => {
        const searchString = adminSearch ? adminSearch.toLowerCase().trim() : ""

        // Supports both lowercase 'full_name' and uppercase 'FULL_NAME' keys seamlessly
        const studentName = (post.full_name || post.FULL_NAME || "").toLowerCase()
        const studentReg = (post.reg_number || post.REG_NUMBER || "").toLowerCase()
        const studentEmail = (post.email || post.EMAIL || "").toLowerCase().trim()
        const postGender = (post.gender || post.GENDER || "").toLowerCase().trim()

        const matchesUserCredentials =
            searchString === "" ||
            studentName.includes(searchString) ||
            studentReg.includes(searchString) ||
            studentEmail.includes(searchString)

        const matchesGenderSegment =
            adminGenderFilter === "all" ||
            postGender === adminGenderFilter.toLowerCase().trim()

        return matchesUserCredentials && matchesGenderSegment
    })
    if (loading || !isAdmin) {
        return <div className="text-center py-20 text-red-700 font-bold text-lg animate-pulse">🛡️ Verifying Security Clearance...</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-red-950/40 border border-red-700/60 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-center text-white">
                <div>
                    <h2 className="text-2xl font-black text-black m-0">🛡️ Central Moderation Command</h2>
                </div>
                <Link href="/dashboard" className="bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl no-underline">Return to Dashboard</Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center shadow-lg">
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-slate-400 text-xs font-black uppercase tracking-wider block">Search User Details</label>
                    <input
                        type="text"
                        placeholder="Filter by Student Name, Reg Number, or Email address..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-sm border border-transparent focus:border-red-500/40 outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-black uppercase tracking-wider block">Campus Segment</label>
                    <select
                        value={adminGenderFilter}
                        onChange={(e) => setAdminGenderFilter(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer border border-transparent"
                    >
                        <option value="all">🌐 All Campus Segments</option>
                        <option value="male">👨 Male Campus Records</option>
                        <option value="female">👩 Female Campus Records</option>
                    </select>
                </div>
            </div>

            {filteredAdminPosts.length === 0 ? (
                <div className="text-center text-slate-500 py-16 bg-white border border-dashed border-slate-200 rounded-2xl">🔍 No matching student entries found.</div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse m-0">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-black uppercase p-4">
                                <th className="p-4">Type</th>
                                <th className="p-4">Campus Seg</th>
                                <th className="p-4">Student Credentials</th>
                                <th className="p-4">Category & Location</th>
                                <th className="p-4">Description</th>
                                <th className="p-4 text-right">Moderation Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {filteredAdminPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50/80">
                                    <td className="p-4 font-bold uppercase">{post.type}</td>
                                    <td className="p-4 text-xs font-bold text-slate-500">{post.gender}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{post.full_name}</div>
                                        <div className="text-red-600 font-semibold text-xs">{post.reg_number}</div>
                                        <div className="text-slate-400 text-xs mb-2">{post.email}</div>
                                        <button
                                            onClick={() => handleToggleBan(post.email, post.status)}
                                            className={`border-none text-[10px] font-black px-2.5 py-1 rounded-md cursor-pointer ${post.status === 'banned' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {post.status === 'banned' ? "✅ Unban Account" : "🛑 Ban Student"}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold">{post.category}</div>
                                        <div className="text-emerald-700 text-xs font-medium">📍 {post.location}</div>
                                    </td>
                                    <td className="p-4 max-w-xs"><p className="line-clamp-2 text-xs m-0">{post.description}</p></td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleAdminDelete(post.id, post.category)} className="bg-red-600 text-white font-extrabold text-xs py-1.5 px-3.5 rounded-lg border-none cursor-pointer">💥 Force Purge</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}