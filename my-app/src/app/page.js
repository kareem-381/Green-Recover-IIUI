// src/app/page.js
import PublicLayout from "./(public)/layout";
import PublicHomePage from "./(public)/page";

export default function RootPage() {
  return (
    <PublicLayout>
      <PublicHomePage />
    </PublicLayout>
  );
}


// triggers files