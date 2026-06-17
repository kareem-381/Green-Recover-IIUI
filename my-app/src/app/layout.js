// src/app/layout.js
import "./globals.css"; // Links your global styling sheets

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}