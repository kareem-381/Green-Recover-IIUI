// src/app/dashboard/post-lost/page.js
"use client"
import { useRouter } from "next/navigation" 
import { useState } from "react"

export default function PostLostItem() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    regNumber: "",
    iiuiEmail: "",
    cellNumber: "",
    category: "ID Card",
    lostLocation: "",
    timeLost: "",
    description: "",
    rewardOffered: "",
    itemImage: null, 
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, itemImage: e.target.files[0] })
    }
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  console.log("Submitting Lost Item state snapshot:", formData)

  try {
    const sessionToken = typeof window !== "undefined" ? localStorage.getItem("iiui_user_logged") : null
    const userObj = sessionToken ? JSON.parse(sessionToken) : null
    const userGender = userObj?.gender || "Male"

    const cleanDescription = formData.description || ""
    const finalDescription = formData.rewardOffered
      ? `${cleanDescription} | 🎁 Reward: ${formData.rewardOffered}`
      : cleanDescription

    let imageBase64String = "";

    // Convert image to a safe text string if it exists
    if (formData.itemImage) {
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)//ss
          reader.onerror = (error) => reject(error)
        })
      }
      imageBase64String = await convertToBase64(formData.itemImage)
    }

    // 🎯 THE FIX: Go back to FormData so Next.js gets its "multipart/form-data" Content-Type!
    const dataPayload = new FormData()
    dataPayload.append("fullName", formData.fullName || "")
    dataPayload.append("regNumber", formData.regNumber || "")
    dataPayload.append("iiuiEmail", formData.iiuiEmail || "")
    dataPayload.append("cellNumber", formData.cellNumber || "")
    dataPayload.append("gender", userGender)
    dataPayload.append("category", formData.category || "ID Card")
    dataPayload.append("location", formData.lostLocation || "")
    dataPayload.append("timeLost", formData.timeLost || "")
    dataPayload.append("description", finalDescription)
    
    // We append the raw TEXT string instead of the actual file! 
    dataPayload.append("imageBase64", imageBase64String)

    // DO NOT manually set any Headers here. Let the browser append the dynamic multi-part boundary automatically.
    const res = await fetch("/api/posts/lost", {
      method: "POST",
      body: dataPayload,
    })

    const data = await res.json()

    if (data.success) {
      alert("Lost item report broadcasted successfully!")
      router.push("/dashboard")
      router.refresh()
    } else {
      alert("Database rejection: " + data.message)
    }
  } catch (err) {
    console.error("🔥 Frontend Transmission Route Error:", err)
    alert("Failed to write report payload to server gateway.")
  }
}
  return (
    <div className="min-h-[calc(100vh-150px)] w-full flex justify-center items-center py-10">
      <form onSubmit={handleSubmit} className="h-auto w-125 bg-[#0c1a12] rounded-xl p-7.5 box-border shadow-2xl border border-[#14532d]">
        <h2 className="text-center text-[#f0fdf4] text-[25px] font-medium mb-4">
          Report Lost Item
        </h2>

        <div className="bg-red-950/40 border border-red-700/60 rounded-lg p-3.5 mb-6 text-center text-xs text-red-300 leading-relaxed mx-5">
          <strong>⚠️ NOTICE:</strong> Spamming, submitting false reports, or listing items not belonging to you will result in an immediate <strong>account ban</strong> and disciplinary investigation by <strong>IIUI Security Authorities</strong>.
        </div>

        <div className="border-b border-[#14532d]/40 mb-5 pb-2 mx-5">
          <span className="text-[#84cc16] text-xs uppercase font-bold tracking-wider">Owner Details</span>
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Full Name</p>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Registration Number</p>
          <input
            type="text"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            placeholder="e.g., 1234-FBAS/BSCS/S23"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">IIUI Email Address</p>
          <input
            type="email"
            name="iiuiEmail"
            value={formData.iiuiEmail}
            onChange={handleChange}
            placeholder="yourname@iiu.edu.pk"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Cell Number</p>
          <input
            type="tel"
            name="cellNumber"
            value={formData.cellNumber}
            onChange={handleChange}
            placeholder="e.g., 03XXXXXXXXX"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        <div className="border-b border-[#14532d]/40 mb-5 pt-2 pb-2 mx-5">
          <span className="text-[#84cc16] text-xs uppercase font-bold tracking-wider">Missing Item Details</span>
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Category</p>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="bg-[#14532d] w-100 ml-5 px-3.75 py-2 rounded-[10px] text-[#bbf7d0] border-none outline-none mb-3.75 cursor-pointer"
          >
            <option value="ID Card">ID Card / Degree / Documents</option>
            <option value="Wallet">Wallet / Cash</option>
            <option value="Keys">Keys / Keychain</option>
            <option value="Electronics">Mobile / Laptop / Charger</option>
            <option value="Other">Other Personal Belongings</option>
          </select>
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Where did you lose it?</p>
          <input
            type="text"
            name="lostLocation"
            value={formData.lostLocation}
            onChange={handleChange}
            placeholder="e.g., Football Ground, Faculty Block 2, Masjid"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Estimated Time Lost</p>
          <input
            type="text"
            name="timeLost"
            value={formData.timeLost}
            onChange={handleChange}
            placeholder="e.g., Yesterday afternoon during OS lab session"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Item Description</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe features like stickers, color casing, unique scratches, content inside..."
            required
            rows={3}
            className="bg-[#14532d] w-100 ml-5 pl-5 pr-2.5 py-2.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75 resize-none block"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Reward (Optional)</p>
          <input
            type="text"
            name="rewardOffered"
            value={formData.rewardOffered}
            onChange={handleChange}
            placeholder="e.g., Treat in Cafeteria, Cash reward, or leave empty"
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-4"
          />
        </div>

        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Upload Reference Image (Optional)</p>
          <input
            type="file"
            name="itemImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-100 ml-5 text-sm text-[#bbf7d0] file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-none file:text-xs file:font-semibold file:bg-[#14532d] file:text-[#4ade80] file:hover:opacity-80 file:cursor-pointer mb-5 block"
          />
        </div>

        <button
          type="submit"
          className="mt-3.75 bg-[#84cc16] w-100 ml-5 py-2.5 rounded-[15px] text-[#1a2e05] text-lg font-medium border-none cursor-pointer hover:opacity-85 transition-opacity duration-200 ease-in-out block"
        >
          Publish Lost Item SOS
        </button>
      </form>
    </div>
  )
}