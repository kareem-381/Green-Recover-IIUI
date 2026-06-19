// src/app/dashboard/post-found/page.js
"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PostFoundItem() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    regNumber: "",
    iiuiEmail: "",
    cellNumber: "",
    category: "ID Card",
    location: "",
    timeFound: "",
    description: "",
    itemImage: null,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, itemImage: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const sessionToken = typeof window !== "undefined" ? localStorage.getItem("iiui_user_logged") : null;
      const userObj = sessionToken ? JSON.parse(sessionToken) : null;
      const userGender = userObj?.gender || "Male"; 

      let base64ImageString = "";

      // 🎯 THE BASE64 STREAM PIPELINE: Convert binary file to text before shipping
      if (formData.itemImage) {
        base64ImageString = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(formData.itemImage);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      // Pack form data fields into a fluid structural network layout payload
      const dataPayload = new FormData();
      dataPayload.append("fullName", formData.fullName);
      dataPayload.append("regNumber", formData.regNumber);
      dataPayload.append("iiuiEmail", formData.iiuiEmail);
      dataPayload.append("cellNumber", formData.cellNumber);
      dataPayload.append("gender", userGender); 
      dataPayload.append("category", formData.category);
      dataPayload.append("location", formData.location);
      dataPayload.append("timeFound", formData.timeFound);
      dataPayload.append("description", formData.description);
      
      // 🎯 Send image payload purely as safe text data
      dataPayload.append("imageBase64", base64ImageString); 

      const res = await fetch("/api/posts/found", {
        method: "POST",
        body: dataPayload,
      });
      const data = await res.json();

      if (data.success) {
        alert("Broadcast announcement securely saved and dispatched!");
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Database rejection: " + data.message);
      }
    } catch (err) {
      console.error("Transmission error:", err);
      alert("Failed to communicate with database gateway router.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🎯 RESPONSIVE FIX: Replaced padding rules to embrace edge constraints dynamically
    <div className="min-h-[calc(100vh-150px)] w-full flex justify-center items-center px-4 py-6 md:py-10">

      {/* 🎯 RESPONSIVE FIX: Swapped w-125 layout box constraint to w-full max-w-lg */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#0c1a12] rounded-xl p-5 md:p-8 box-border shadow-2xl border border-[#14532d]">

        <h2 className="text-center text-[#f0fdf4] text-xl md:text-[25px] font-medium mb-4">
          Broadcast Found Item
        </h2>

        {/* Strict Security Administration Warning Banner */}
        <div className="bg-red-950/40 border border-red-700/60 rounded-lg p-3.5 mb-6 text-center text-xs text-red-300 leading-relaxed">
          <strong>⚠️ NOTICE:</strong> Your post will be publicly broadcasted. If any illegal, fake, or inappropriate content is uploaded, you will be <strong>completely banned</strong> from Green-Recover and held strictly accountable in front of the <strong>IIUI Administration</strong>.
        </div>

        {/* --- SECTION 1: FINDER PERSONAL INFORMATION --- */}
        <div className="border-b border-[#14532d]/40 mb-5 pb-2">
          <span className="text-[#84cc16] text-xs uppercase font-bold tracking-wider">Finder Details</span>
        </div>

        {/* Form Fields - 🎯 FIXED: All ml-5 and w-100 structures completely removed for fluid flex blocks */}
        <div className="space-y-4">
          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Registration Number</label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber}
              onChange={handleChange}
              placeholder="e.g., 1234-FBAS/BSCS/S23"
              required
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">IIUI Email Address</label>
            <input
              type="email"
              name="iiuiEmail"
              value={formData.iiuiEmail}
              onChange={handleChange}
              placeholder="yourname@iiu.edu.pk"
              required
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Cell Number</label>
            <input
              type="tel"
              name="cellNumber"
              value={formData.cellNumber}
              onChange={handleChange}
              placeholder="e.g., 03XXXXXXXXX"
              required
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm"
            />
          </div>

          {/* --- SECTION 2: FOUND ITEM INFORMATION --- */}
          <div className="border-b border-[#14532d]/40 pt-2 pb-2">
            <span className="text-[#84cc16] text-xs uppercase font-bold tracking-wider">Item Details</span>
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="bg-[#14532d] w-full px-4 py-2.5 rounded-[10px] text-[#bbf7d0] border-none outline-none cursor-pointer text-sm"
            >
              <option value="ID Card">ID Card / Degree / Documents</option>
              <option value="Wallet">Wallet / Cash</option>
              <option value="Keys">Keys / Keychain</option>
              <option value="Electronics">Mobile / Laptop / Charger</option>
              <option value="Other">Other Personal Belongings</option>
            </select>
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Location Found</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Central Library, Iqra Block Room 102"
              required
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Time Found</label>
            <input
              type="text"
              name="timeFound"
              value={formData.timeFound}
              onChange={handleChange}
              placeholder="e.g., Today around 11:30 AM"
              required
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mention color, brand or unique identifiers..."
              required
              rows={3}
              className="bg-[#14532d] w-full px-4 py-2 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none text-sm resize-none block"
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#4ade80] mb-1.25 block font-medium">Upload Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-[#bbf7d0] file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-none file:text-xs file:font-semibold file:bg-[#14532d] file:text-[#4ade80] file:hover:opacity-80 file:cursor-pointer block"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-[#84cc16] w-full py-2.5 rounded-[15px] text-[#1a2e05] text-base md:text-lg font-bold border-none cursor-pointer hover:opacity-85 transition-opacity duration-200 ease-in-out block disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing Broadcast..." : "Broadcast Announcement"}
        </button>

      </form>
    </div>
  )
}