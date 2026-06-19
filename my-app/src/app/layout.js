// src/app/layout.js
import "./globals.css";
export const metadata = {
  title: "Green Recover | IIUI Lost & Found Portal",
  description: "The official centralized lost and found web utility portal for the International Islamic University Islamabad community.",
  keywords: ["IIUI", "Green Recover", "Lost and Found IIUI", "Islamic University lost and found Porta", "IIUI Lost & Found"],
  openGraph: {
    title: "Green Recover IIUI",
    description: "Report missing items or broadcast found objects safely within the campus network.",
    url: "https://green-recover-iiui.vercel.app/Home",
    type: "website",
  },
  // 🎯 GOOGLE SEARCH CONSOLE HANDSHAKE COMPLETED
  verification: {
    google: "h6g0TbbVeOUd9DYKgI5bv3UV5WSc7mMilOLqVRlwyQM",
  },
};
<meta name="google-site-verification" content="h6g0TbbVeOUd9DYKgI5bv3UV5WSc7mMilOLqVRlwyQM" />

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}