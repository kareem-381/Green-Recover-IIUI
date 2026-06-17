// src/app/dashboard/posts/[id]/page.js
"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function PostDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPostDetails() {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        if (data.success) {
          setPost(data.post)
        } else {
          alert(data.message)
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Failed to load item parameters:", err)
      } finally {
        setLoading(false)
      }
    }

    const sessionToken = localStorage.getItem("iiui_user_logged")
    if (!sessionToken) {
      router.push("/Signin")
    } else {
      fetchPostDetails()
    }
  }, [id, router])

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-600 font-bold text-lg animate-pulse">
        🔄 Loading secure campus records...
      </div>
    )
  }

  if (!post) return null

  const whatsappLink = `https://wa.me/${post.cell_number ? post.cell_number.replace(/[^0-9]/g, "").replace(/^0/, "92") : ""}`

  return (
    <div className="max-w-4xl mx-auto my-6 p-4">
      <Link href="/dashboard" className="text-[#14532d] font-bold text-sm no-underline flex items-center gap-1 mb-6 hover:underline">
        ⬅ Back to Feed Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Media Asset (Fixed min-h-75) */}
        <div className="bg-slate-900 flex justify-center items-center min-h-75 p-4 relative">
          {post.image_path ? (
            <img src={post.image_path} alt={post.category} className="w-full h-full max-h-112.5 object-contain rounded-lg" />
          ) : (
            <div className="text-slate-500 text-sm italic text-center">
              📸 No reference image attached by the author.
            </div>
          )}
          <span className={`absolute top-4 left-4 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider text-white ${
            post.type === 'lost' ? 'bg-red-600' : 'bg-emerald-600'
          }`}>
            {post.type === 'lost' ? "🔴 Lost Report" : "🟢 Found Declaration"}
          </span>
        </div>

        {/* Right Side: Information Matrix */}
        <div className="p-8 flex flex-col justify-between space-y-6 bg-slate-50/50">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">
                {post.category}
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                {post.type === 'lost' ? 'Missing' : 'Found'} {post.category}
              </h2>
            </div>

            <div className="space-y-2 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <p className="m-0"><strong>📍 Location:</strong> {post.location}</p>
              <p className="m-0 mt-1.5"><strong>⏱️ Reported Time:</strong> {post.time_found}</p>
              <p className="m-0 mt-3 pt-3 border-t border-slate-100 text-slate-600 italic">
                "{post.description}"
              </p>
            </div>

            <div className="space-y-2 bg-[#0c1a12] border border-[#14532d] rounded-xl p-4 text-white">
              <span className="text-[#84cc16] text-[11px] uppercase font-black tracking-wider block border-b border-[#14532d]/60 pb-1.5 mb-2">
                Reporter Verified Credentials
              </span>
              <p className="text-sm m-0"><strong>Name:</strong> {post.full_name}</p>
              <p className="text-sm m-0 mt-1"><strong>Reg Number:</strong> {post.reg_number}</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-700 font-bold m-0 mb-1">Direct Verified Cell Number:</p>
              <span className="text-emerald-800 text-base font-black select-all">{post.cell_number}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Fixed duplicate text-center conflicts below */}
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-3 px-4 rounded-xl text-xs no-underline block shadow-sm">
                💬 Chat on WhatsApp
              </a>
              <a href={`tel:${post.cell_number}`} className="bg-[#14532d] hover:bg-[#0c1a12] text-white text-center font-bold py-3 px-4 rounded-xl text-xs no-underline block shadow-sm">
                📞 Call Direct Line
              </a>
            </div>

            <a href={`mailto:${post.email}?subject=Green-Recover: Update regarding your ${post.category}&body=Assalam-o-Alaikum ${post.full_name},`} className="w-full text-center block bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors no-underline shadow-xs">
              ✉ Send Official Student Email
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}