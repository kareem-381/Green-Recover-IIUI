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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, itemImage: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Found Item Form Submitted:", formData);
    
    try {
      // 1. Grab the logged-in student's token safely inside the try block
      const sessionToken = typeof window !== "undefined" ? localStorage.getItem("iiui_user_logged") : null;
      const userObj = sessionToken ? JSON.parse(sessionToken) : null;
      
      // 2. Define userGender clearly here
      const userGender = userObj?.gender || "Male"; 

      // 3. Pack your form fields into a network data payload
      const dataPayload = new FormData();
      dataPayload.append("fullName", formData.fullName);
      dataPayload.append("regNumber", formData.regNumber);
      dataPayload.append("iiuiEmail", formData.iiuiEmail);
      dataPayload.append("cellNumber", formData.cellNumber);
      
      // 4. Safely append it (userGender is guaranteed to be defined right above!)
      dataPayload.append("gender", userGender); 

      dataPayload.append("category", formData.category);
      dataPayload.append("location", formData.location);
      dataPayload.append("timeFound", formData.timeFound);
      dataPayload.append("description", formData.description);
      
      if (formData.itemImage) {
        dataPayload.append("itemImage", formData.itemImage);
      }

      // 5. Transmit the data payload to your running MySQL API route
      const res = await fetch("/api/posts/found", {
        method: "POST",
        body: dataPayload,
      });
      const data = await res.json();

      if (data.success) {
        alert("Broadcast announcement securely saved to local MySQL!");
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Database rejection: " + data.message);
      }
    } catch (err) {
      console.error("Transmission error:", err);
      alert("Failed to communicate with database gateway router.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] w-full flex justify-center items-center py-10">

      {/* Form Card Container - Cleared Warnings */}
      <form onSubmit={handleSubmit} className="h-auto w-125 bg-[#0c1a12] rounded-xl p-7.5 box-border shadow-2xl border border-[#14532d]">

        <h2 className="text-center text-[#f0fdf4] text-[25px] font-medium mb-4">
          Broadcast Found Item
        </h2>

        {/* Strict Security Administration Warning Banner */}
        <div className="bg-red-950/40 border border-red-700/60 rounded-lg p-3.5 mb-6 text-center text-xs text-red-300 leading-relaxed mx-5">
          <strong>⚠️ NOTICE:</strong> Your post will be publicly broadcasted. If any illegal, fake, or inappropriate content is uploaded, you will be <strong>completely banned</strong> from Green-Recover and held strictly accountable in front of the <strong>IIUI Administration</strong>.
        </div>

        {/* --- SECTION 1: FINDER PERSONAL INFORMATION --- */}
        <div className="border-b border-[#14532d]/40 mb-5 pb-2 mx-5">
          <span className="text-[#84cc16] text-xs uppercase font-bold tracking-wider">Finder Details</span>
        </div>

        {/* Full Name */}
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

        {/* Registration Number */}
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

        {/* IIUI Email */}
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

        {/* Cell Number */}
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

        {/* --- SECTION 2: FOUND ITEM INFORMATION --- */}
        <div className="border-b border-[#14532d]/40 mb-5 pt-2 pb-2 mx-5">
          <span className="text-[#84cc16] text-xs uppercase font-bold tracking-wider">Item Details</span>
        </div>

        {/* Category Dropdown */}
        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Category</p>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="bg-[#14532d] w-100 ml-5 px-3.75 py-2 rounded-[10px] text-[#bbf7d0] border-none outline-none mb-3.75 cursor-pointer appearance-none"
          >
            <option value="ID Card">ID Card / Degree / Documents</option>
            <option value="Wallet">Wallet / Cash</option>
            <option value="Keys">Keys / Keychain</option>
            <option value="Electronics">Mobile / Laptop / Charger</option>
            <option value="Other">Other Personal Belongings</option>
          </select>
        </div>

        {/* Location Found */}
        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Location Found</p>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Central Library, Iqra Block Room 102"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        {/* Time Found */}
        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Time Found</p>
          <input
            type="text"
            name="timeFound"
            value={formData.timeFound}
            onChange={handleChange}
            placeholder="e.g., Today around 11:30 AM"
            required
            className="bg-[#14532d] w-100 ml-5 pl-5 py-1.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75"
          />
        </div>

        {/* Description */}
        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Description</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mention color, brand or unique identifiers..."
            required
            rows={3}
            className="bg-[#14532d] w-100 ml-5 pl-5 pr-2.5 py-2.5 rounded-[10px] text-[#bbf7d0] placeholder-[#bbf7d0]/30 border-none outline-none mb-3.75 resize-none block"
          />
        </div>

        {/* Choose File (Image) */}
        <div>
          <p className="ml-6.25 text-base text-[#4ade80] mb-1.25">Upload Item Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-100 ml-5 text-sm text-[#bbf7d0] file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-none file:text-xs file:font-semibold file:bg-[#14532d] file:text-[#4ade80] file:hover:opacity-80 file:cursor-pointer mb-5 block"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-3.75 bg-[#84cc16] w-100 ml-5 py-2.5 rounded-[15px] text-[#1a2e05] text-lg font-medium border-none cursor-pointer hover:opacity-85 transition-opacity duration-200 ease-in-out block"
        >
          Broadcast Announcement
        </button>

      </form>
    </div>
  )
}