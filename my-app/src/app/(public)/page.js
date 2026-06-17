import Link from "next/link"

export default function Home() {
  return (
    <div id="home-container">

      {/* Islamic Rules Section */}
      <section className="islamic-section">
        <p className="islamic-title">Ahkām al-Luqatah (Rules Regarding Lost and Found Items in Islam)</p>
        <p className="islamic-arabic">احکام اللقطہ</p>
        <ul>
          <li>If a person finds something and does not pick it up, there will be no sin on him. However, if he finds it at a place where there is the fear that if he does not pick it up, someone else will pick it and will not return it to its owner, then it becomes <strong>Waajib</strong> on this person to pick it up and return it to its owner.</li>
          <li>Once a person finds a lost item and picks it up, it becomes his responsibility to search for its owner and to return it to him.</li>
        </ul>
      </section>

      {/* Main App Description */}
      <main id="main-section">
        <h1 id="main-heading">Green Recover</h1>
        <p>At Green Recover, we understand that people often misplace their belongings for various reasons—whether due to forgetfulness or temporary distractions. The value of lost items can range from small everyday objects to essential belongings like keys, mobile phones, or important documents, which can disrupt daily life.</p>
        <p>To make it easier for students, faculty, and staff to recover their lost items, Green Recover provides a centralized platform where individuals can report lost belongings or list found items. This initiative fosters a responsible and helpful community, ensuring that misplaced items are returned to their rightful owners efficiently.</p>
        <p>Please note that certain items may undergo security checks or disinfection procedures as a precautionary measure. While we strive to keep items safe, we cannot guarantee their condition after these procedures.</p>
        <p>However, not everyone knows how to handle the situation when they lose something. Panic and uncertainty often lead to confusion, making it harder to recover lost belongings.</p>
      </main>

      {/* Instructional Article Guide */}
      <article>
        <h2>What to do if you lose an item?</h2>
        <p className="article-intro">If you've lost something, follow these steps to improve your chances of finding it:</p>
        <ol>
          <li>
            <strong>Stay Calm</strong> – Take a deep breath and avoid panicking. Trust the process and keep a positive mindset while searching.
          </li>
          <li>
            <strong>Double-Check</strong> – Carefully search your pockets, backpack, and immediate surroundings. There is a high chance it is right nearby.
          </li>
          <li>
            <strong>Ask Around</strong> – Talk to classmates, lab partners, or department staff. Your peers at IIUI might have noticed or safely picked up your item.
          </li>
          <li>
            <strong>Retrace Your Steps</strong> – Try to recall the exact campus blocks, classrooms, or cafeterias you visited last and walk back through them.
          </li>
          <li>
            <strong>Look Nearby</strong> – Studies suggest that misplaced belongings are frequently recovered within a 1.5-meter radius of where they were last placed.
          </li>
          <li>
            <strong>Report It on Green Recover</strong> – If you still cannot find your belonging, log into the <strong>Green Recover Portal</strong> immediately to submit a lost item report or search through recent campus findings.
          </li>
        </ol>

        <p id="last-para">Our website is designed to be intuitive and user-friendly, ensuring a smooth experience for searching and reporting lost items. Together, we can help lost items find their way home!</p>
      </article>

    </div>
  )
}