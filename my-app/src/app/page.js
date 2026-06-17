// src/app/page.js
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Bounces users straight into your login interface or dashboard automatically!
  redirect('/(public)'); 
}