export default function HelpSection() {
  return (
    // Main Container
    <div className="min-h-[calc(100vh-150px)] w-full flex justify-center items-center px-5 py-10 box-border">
      
      {/* Help Card Wrapper */}
      <div className="max-w-212.5 w-full bg-[#0c1a12] rounded-2xl p-10 border border-[#14532d] shadow-[0px_12px_30px_#1a2e05] box-border">
        
        <section className="w-full">
          {/* Header */}
          <h2 className="text-center text-[#f0fdf4] text-3xl font-semibold mb-3">
            Help & Frequently Asked Questions
          </h2>
          
          {/* Glowing Fading Divider Line */}
          <hr className="border-0 h-px bg-linear-to-r from-transparent via-[#4ade80] to-transparent mb-8" />

          {/* 📢 CRITICAL NOTIFICATION: WHATSAPP BROADCAST */}
          <div className="bg-[#060f0a] border-l-4 border-[#84cc16] p-5 rounded-xl mb-8 flex flex-col gap-2">
            <h3 className="text-[#84cc16] font-semibold text-lg flex items-center gap-2">
              <span>📢</span> Automatic WhatsApp Broadcasting
            </h3>
            <p className="text-[#bbf7d0] text-sm leading-relaxed text-justify">
              To guarantee the fastest possible recovery, the moment a <strong>System Administrator</strong> approves your found item report, our system automatically broadcasts the details directly to the official <strong>Green Recover WhatsApp Channel</strong>! This alerts the entire IIUI campus instantly so the owner can claim it right away.
            </p>
          </div>

          {/* FAQ Accordion Grid */}
          <div className="flex flex-col gap-5">
            
            {/* Question 1 */}
            <div className="border-b border-[#14532d]/40 pb-4">
              <h4 className="text-[#4ade80] font-medium text-lg mb-2">
                Q: How do I report an item I found on campus?
              </h4>
              <p className="text-[#bbf7d0] text-base leading-relaxed text-justify px-2.5">
                Simply log into your student account, go to the <strong>"Post Lost & Found Item"</strong> portal, fill out the item description, upload an image, and select the campus block or cafeteria where you found it. 
              </p>
            </div>

            {/* Question 2 */}
            <div className="border-b border-[#14532d]/40 pb-4">
              <h4 className="text-[#4ade80] font-medium text-lg mb-2">
                Q: Why isn't my posted item showing up on the public feed?
              </h4>
              <p className="text-[#bbf7d0] text-base leading-relaxed text-justify px-2.5">
                Every submission goes into a private queue for mandatory <strong>Admin Verification</strong> to protect user safety and screen out inappropriate media. Once an admin reviews and approves your submission, it will go live immediately.
              </p>
            </div>

            {/* Question 3 */}
            <div className="border-b border-[#14532d]/40 pb-4">
              <h4 className="text-[#4ade80] font-medium text-lg mb-2">
                Q: How can I safely claim an item that belongs to me?
              </h4>
              <p className="text-[#bbf7d0] text-base leading-relaxed text-justify px-2.5">
                When you locate your missing item on the feed, use the integrated secure claim channel. You will be required to present valid university identification and explicit proof of ownership to the system administrator or finder before the item is handed over.
              </p>
            </div>

            {/* Question 4 */}
            <div className="pb-2">
              <h4 className="text-[#4ade80] font-medium text-lg mb-2">
                Q: For how long will my item stay in the system database?
              </h4>
              <p className="text-[#bbf7d0] text-base leading-relaxed text-justify px-2.5">
                All lost and found database listings are safely tracked on our platform for a maximum duration of <strong> 8 days</strong>. If an item remains completely unclaimed after this structural holding window, the record is automatically archived.
              </p>
            </div>

          </div>


        </section>
        
      </div>
    </div>
  );
}