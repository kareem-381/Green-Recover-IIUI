// src/app/(public)/help/page.js
export default function HelpSection() {
  return (
    // Main Container - 🎯 RESPONSIVE FIX: Fluid screen-edge padding
    <div className="min-h-[calc(100vh-150px)] w-full flex justify-center items-center px-4 py-6 md:py-10 box-border">
      
      {/* Help Card Wrapper - 🎯 RESPONSIVE FIX: Replaced max-w-212.5 with a fluid max-w-4xl */}
      <div className="max-w-4xl w-full bg-[#0c1a12] rounded-2xl p-5 md:p-10 border border-[#14532d] shadow-[0px_12px_30px_#1a2e05] box-border">
        
        <section className="w-full">
          {/* Header - 🎯 RESPONSIVE FIX: Text scales elegantly down on small phones */}
          <h2 className="text-center text-[#f0fdf4] text-xl md:text-3xl font-semibold mb-3">
            Help & Frequently Asked Questions
          </h2>
          
          {/* Glowing Fading Divider Line */}
          <hr className="border-0 h-px bg-linear-to-r from-transparent via-[#4ade80] to-transparent mb-8" />

          {/* 📢 UPDATED NOTIFICATION: WHATSAPP DIRECT BROADCAST */}
          <div className="bg-[#060f0a] border-l-4 border-[#84cc16] p-4 md:p-5 rounded-xl mb-8 flex flex-col gap-2">
            <h3 className="text-[#84cc16] font-semibold text-base md:text-lg flex items-center gap-2">
              <span>📢</span> Instant WhatsApp Group Broadcasting
            </h3>
            <p className="text-[#bbf7d0] text-xs md:text-sm leading-relaxed text-justify">
              To guarantee the fastest possible recovery, the exact second you submit an item report, our system bypassing traditional delays and **instantly broadcasts** the alert details into the official **Green Recover WhatsApp Group network** tailored directly to your specific campus sector (Male/Female groups). This alerts your peer network in real-time.
            </p>
          </div>

          {/* FAQ Accordion Grid */}
          <div className="flex flex-col gap-6">
            
            {/* Question 1 */}
            <div className="border-b border-[#14532d]/40 pb-4">
              <h4 className="text-[#4ade80] font-medium text-base md:text-lg mb-2">
                Q: How do I report an item I lost or found on campus?
              </h4>
              <p className="text-[#bbf7d0] text-sm md:text-base leading-relaxed text-justify md:px-2.5">
                Simply log into your student account, choose either the <strong>"Report Lost Item"</strong> or <strong>"Broadcast Found Item"</strong> submission page, fill out the descriptive attributes, drop a reference image, and select your campus location block. 
              </p>
            </div>

            {/* Question 2 - 🎯 UPDATED: Explains Instant Posting and Post-Moderation */}
            <div className="border-b border-[#14532d]/40 pb-4">
              <h4 className="text-[#4ade80] font-medium text-base md:text-lg mb-2">
                Q: Does my post require administrator approval before going live?
              </h4>
              <p className="text-[#bbf7d0] text-sm md:text-base leading-relaxed text-justify md:px-2.5">
                No. To ensure rapid notification, all listings are **ingested and published publicly to the campus feed immediately**. However, system administrators actively monitor the live feed post-publishing and retain full authorization to delete fraudulent, inappropriate, or rule-breaking listings.
              </p>
            </div>

            {/* Question 3 - 🎯 UPDATED: Details Segmented Privacy Control */}
            <div className="border-b border-[#14532d]/40 pb-4">
              <h4 className="text-[#4ade80] font-medium text-base md:text-lg mb-2">
                Q: How does the system protect student privacy and prevent harassment?
              </h4>
              <p className="text-[#bbf7d0] text-sm md:text-base leading-relaxed text-justify md:px-2.5">
                Green Recover utilizes strict **Dynamic Segment Routing**. Based on your logged-in profile metrics, data streams and contact numbers are entirely isolated within separate male and female campus network loops. This architecture completely prevents cross-gender tracking data leakage and unwanted cross-channel interactions.
              </p>
            </div>

            {/* Question 4 */}
            <div className="pb-2">
              <h4 className="text-[#4ade80] font-medium text-base md:text-lg mb-2">
                Q: For how long will my item stay in the active system database?
              </h4>
              <p className="text-[#bbf7d0] text-sm md:text-base leading-relaxed text-justify md:px-2.5">
                All live lost and found entries are tracked on our active platform dashboard for a maximum duration of <strong>8 days</strong>. If an item remains unresolved past this holding window, background automated routines will archive the dataset records cleanly.
              </p>
            </div>

          </div>

        </section>
        
      </div>
    </div>
  );
}