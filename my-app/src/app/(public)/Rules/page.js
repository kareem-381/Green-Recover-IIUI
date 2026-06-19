// src/app/(public)/rules/page.js
import styles from "./rules.module.css";

export default function Rules() {
  return (
    <div className={styles.rulesContainer}>
      <div className={styles.rulesCard}>
        <h2>Green Recover — Official Rules & Code of Conduct</h2>
        <p className={styles.subtitle}>
          All students and users of the IIUI Lost & Found network must strictly adhere to the campus platform regulations below.
        </p>
        
        <hr className={styles.divider} />

        {/* 1. Instant Public Ingestion & Post-Moderation */}
        <div className={styles.ruleSection}>
          <h3>1. Instant Public Ingestion & Post-Moderation</h3>
          <p>
            When you submit a report through our lost or found submission channels, your entry is 
            <strong> immediately published live </strong> to the active campus feed and broadcasted across your 
            respective network. To maintain community safety, System Administrators retain full authority to 
            audit live listings and permanently delete any content that violates campus guidelines.
          </p>
        </div>

        {/* 2. Strict Segment Isolation & Privacy Policy */}
        <div className={styles.ruleSection}>
          <h3>2. Segment Isolation & Targeted Routing</h3>
          <p>
            To optimize student privacy and ensure completely safe communication, Green Recover runs on 
            <strong> separate, independent routing loops for male and female campus sectors</strong>. Posts, 
            contact information, and WhatsApp automation alerts are entirely locked within your respective 
            academic domain segment, preventing cross-channel visibility or unauthorized interactions.
          </p>
        </div>

        {/* 3. Prohibited Media & Account Misconduct */}
        <div className={styles.ruleSection}>
          <h3>3. Content Integrity & Penalties</h3>
          <p>
            Submitting fraudulent items, spamming fake claims, or uploading unauthorized media to the public feed 
            is strictly illegal. Violators face an immediate <strong>permanent account ban</strong>, immediate 
            escalation to IIUI Security Authorities, and a mandatory fine of <strong>10,000 PKR</strong> for serious institutional misconduct.
          </p>
        </div>

        {/* 4. Storage Limits */}
        <div className={styles.ruleSection}>
          <h3>4. 8-Day Automated Record Limit</h3>
          <p>
            Lost and found listings are tracked and maintained in the active database for a maximum of 
            <strong> 8 days </strong> from the date of publishing. Unclaimed or unresolved listings will be 
            automatically archived by our background cleanup routines to keep the live feed accurate and performant.
          </p>
        </div>

        {/* 5. Safety Disclaimer */}
        <div className={styles.ruleSection}>
          <h3>5. Security Screening Disclaimer</h3>
          <p>
            Certain reported items may undergo mandatory security screening or processing by campus authorities 
            upon recovery. While Green Recover facilitates secure peer-to-peer tracking, the platform is not 
            liable for the physical condition or handling of items post-inspection.
          </p>
        </div>

      </div>
    </div>
  );
}