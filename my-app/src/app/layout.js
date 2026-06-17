// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata = {
  title: "Green Recover | Lost and Found",
  description: "Reconnecting Lost items with their owners on Campus",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* No global bg-slate-50 here anymore! */}
      <body className="min-h-screen flex flex-col m-0 p-0">
        {children}
      </body>
    </html>
  )
}