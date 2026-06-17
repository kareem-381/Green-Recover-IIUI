// src/app/page.js
import { redirect } from "next/navigation";

export default function RootPage() {
  // 🎯 NEXT.JS STANDARD: Instantly routes incoming domain visitors directly 
  // into the matching layout engine without parent folder coupling!
  redirect("/Home");
}