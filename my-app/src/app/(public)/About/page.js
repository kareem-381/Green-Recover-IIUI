export default function AboutUs() {
  return (
    // Outer flex wrapper
    <div className="min-h-[calc(100vh-150px)] w-full flex justify-center items-center px-5 py-10 box-border"> 
      
      {/* 1. Fixed max-w arbitrary value to use canonical sizing */}
      <div className="max-w-212.5 w-full bg-[#0c1a12] rounded-2xl p-10 border border-[#14532d] shadow-[0px_12px_30px_#1a2e05] box-border">
        
        <section className="w-full">
          {/* Main Title */}
          <h2 className="text-center text-[#f0fdf4] text-3xl font-semibold mb-3">
            About Our Platform
          </h2>
          
          {/* 2. Fixed h-[1px] to h-px, and bg-gradient-to-r to bg-linear-to-r */}
          <hr className="border-0 h-px bg-linear-to-r from-transparent via-[#4ade80] to-transparent mb-8" />

          {/* 3. Replaced all px-[10px] with the canonical px-2.5 */}
          <p className="text-[#bbf7d0] text-base leading-relaxed mb-5 text-justify px-2.5">
            The <strong className="text-[#84cc16] font-semibold">Green Recover</strong> portal is a dedicated platform designed to help students, 
            faculty, and staff recover lost belongings within the <strong className="text-[#84cc16] font-semibold">International Islamic University Islamabad (IIUI)</strong> campus.
          </p>
          
          <p className="text-[#bbf7d0] text-base leading-relaxed mb-5 text-justify px-2.5">
            Our goal is to provide a simple, secure, and efficient way for individuals to report lost items and list 
            found belongings, ensuring a smooth, organized, and honest process of returning items to their rightful owners.
          </p>
          
          <p className="text-[#bbf7d0] text-base leading-relaxed mb-5 text-justify px-2.5">
            Whether you have misplaced something during a busy day or found an unattended item in a campus block, cafeteria, 
            or library, this system enables you to instantly update the necessary details and securely connect with the concerned individuals.
          </p>
          
          <p className="text-[#bbf7d0] text-base leading-relaxed mb-5 text-justify px-2.5">
            We believe in fostering a responsible, cooperative, and helpful campus community where everyone plays a part 
            in ensuring lost items find their way back home safely.
          </p>
          
          {/* 4. Fixed closing paragraph spacing to use canonical px-2.5 as well */}
          <p className="text-center text-[#84cc16] text-lg font-medium mt-6 mb-0 px-2.5">
            Let's work together to make IIUI a more connected, secure, and supportive environment for everyone!
          </p>
        </section>
        
      </div>
    </div>
  );
}