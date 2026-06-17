import styles from "./rules.module.css";

export default function Rules() {
  return (
    <div className={styles.rulesContainer}>
      <div className={styles.rulesCard}>
        <h2>Green Recover — Official Rules & Code of Conduct</h2>
        <p className={styles.subtitle}>
          All students and users of the IIUI Lost & Found network must strictly adhere to the regulations below.
        </p>
        
        <hr className={styles.divider} />

        {/* 1. Mandatory Admin Verification */}
        <div className={styles.ruleSection}>
          <h3>1. Mandatory Admin Verification</h3>
          <p>
            When you submit a report through the "Post Lost & Found Item" form, a <strong>System Administrator </strong> 
             will review and verify the details. Your advertisement will only be officially posted on the public campus feed 
            after receiving formal administrative approval.
          </p>
        </div>

        {/* 2. Accountability & Media Policy */}
        <div className={styles.ruleSection}>
          <h3>2. Prohibited Media & Content Policy</h3>
          <p>
            If any male or female user is found uploading or submitting any form of illegal, unauthorized, 
            or explicit videos or images to the admin verification queue, they will face an immediate permanent 
            platform ban and a mandatory fine of <strong>10,000 PKR</strong> for serious misconduct.
          </p>
        </div>

        {/* 3. General Misuse & Illegal Activity */}
        <div className={styles.ruleSection}>
          <h3>3. Zero Tolerance for Illegal Activity</h3>
          <p>
            Any form of fraudulent activity, making fake claims on items that do not belong to you, or utilizing 
            the platform for harassment will not be tolerated. Severe offenses will be escalated directly to university 
            authorities and campus security.
          </p>
        </div>

        {/* 4. Storage Limits */}
        <div className={styles.ruleSection}>
          <h3>4. 8-Day Record Limit</h3>
          <p>
            Lost and found item listings are stored and tracked on the network for a maximum of <strong> 8 days </strong> 
            from the date of submission. Unclaimed items will be archived from the system database automatically after this period.
          </p>
        </div>

        {/* 5. Safety Disclaimer */}
        <div className={styles.ruleSection}>
          <h3>5. Security & Handling Disclaimer</h3>
          <p>
            Certain logged items may undergo mandatory security screening or disinfection procedures by campus security 
            as a precautionary measure. While we strive to facilitate safe returns, the network cannot guarantee 
            the item's condition post-inspection.
          </p>
        </div>

      </div>
    </div>
  );
}