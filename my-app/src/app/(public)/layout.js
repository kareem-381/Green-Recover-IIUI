import Link from "next/link"

export default function Public({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-black">
      <header>
        <nav>
          {/* Group 1: Brand Logo & Title */}
         <Link href="/Home" className="nav-brand">
            <img src="/iiui.png" alt="iiui-logo" />
            <span id="title">Green-Recover</span>
        </Link>

          {/* Group 2: Center Navigation Links */}
          <div className="nav-links">
              {/* 🎯 FIXED: Explicitly targets your new clean homepage folder location */}
              <Link href="/Home">Home</Link>
              <Link href="/Rules">Rules</Link>
              <Link href="/Help">Help</Link>
              <Link href="/About">About Us</Link> 
          </div>

          {/* Group 3: Right Authentication Buttons */}
          <div className="nav-actions">
            {/* FIXED: Matches your exact capitalized folder names */}
            <Link href="/Signin">
              <button className="hover:cursor-pointer bg-yellow-500">Sign In</button>
            </Link>
            <Link href="/Signup">
              <button className="hover:cursor-pointer bg-yellow-500">Sign Up</button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>

      <footer>
        <div>&copy; {new Date().getFullYear()} All Rights Reserved</div>
      </footer>
    </div>
  )
}