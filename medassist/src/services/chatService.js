import { STREAM_INITIAL_DELAY_MS, STREAM_TICK_MS } from '../constants';

// ---------------------------------------------------------------------------
// Medical response library — keyword-matched, educational content only.
// ---------------------------------------------------------------------------

const RESPONSES = {
  diabetes: `**Type 2 Diabetes — Overview**

Type 2 diabetes is a metabolic disorder in which the body becomes resistant to insulin or fails to produce enough of it, causing blood glucose levels to remain elevated.

**Common symptoms:**
- Frequent urination and excessive thirst
- Unexplained fatigue or weight loss
- Blurred vision and slow-healing wounds
- Numbness or tingling in hands and feet

**Management strategies:**
- Regular blood glucose monitoring
- Low-glycemic diet (vegetables, whole grains, lean proteins)
- At least 150 minutes of moderate aerobic exercise per week
- Medications such as metformin or GLP-1 receptor agonists if prescribed

\`\`\`
ADA target ranges
  Fasting glucose:       80–130 mg/dL
  Post-meal (2 hr):     <180 mg/dL
  HbA1c:                <7.0%
\`\`\`

**Disclaimer:** This information is educational only. Please consult a licensed healthcare provider for diagnosis and personalised treatment.`,

  hypertension: `**High Blood Pressure (Hypertension) — Overview**

Hypertension is a chronic condition where the force of blood against artery walls is persistently elevated (≥130/80 mmHg per ACC/AHA guidelines), increasing the risk of heart disease and stroke.

**Lifestyle modifications:**
- Reduce sodium intake to <2,300 mg per day
- Follow the DASH diet (rich in fruits, vegetables, and whole grains)
- Exercise at least 30 minutes most days of the week
- Limit alcohol and avoid smoking
- Practise stress-reduction techniques (mindfulness, deep breathing)

**First-line medications:**
ACE inhibitors, ARBs, calcium channel blockers, and thiazide diuretics are commonly prescribed based on individual profiles.

\`\`\`
Blood pressure categories (ACC/AHA)
  Normal:         <120/80 mmHg
  Elevated:       120–129/<80 mmHg
  Stage 1 HTN:   130–139 / 80–89 mmHg
  Stage 2 HTN:   ≥140/≥90 mmHg
\`\`\`

**Disclaimer:** Do not alter your medication regimen without consulting your physician.`,

  mri_ct: `**MRI vs. CT Scan — Key Differences**

Both are advanced diagnostic imaging modalities, but they use different technologies and excel in different clinical scenarios.

**MRI (Magnetic Resonance Imaging)**
- Uses magnetic fields and radio waves — *no ionising radiation*
- Best for soft tissues: brain, spinal cord, joints, ligaments
- Scan time: 20–90 minutes
- Optional contrast agent: gadolinium

**CT (Computed Tomography)**
- Uses X-rays (low-dose ionising radiation)
- Best for bones, lungs, abdomen, trauma, and suspected bleeding
- Scan time: 5–30 minutes (much faster)
- Optional contrast agent: iodine-based dye

\`\`\`
Quick reference
  Brain tumour / MS / stroke imaging  →  MRI preferred
  Trauma / chest / abdomen workup     →  CT preferred
  Musculoskeletal / ligament tear      →  MRI preferred
  Kidney stone / appendicitis          →  CT preferred
\`\`\`

**Disclaimer:** Your physician will determine the most appropriate study based on your clinical presentation.`,

  antibiotics: `**Antibiotic Use — What You Should Know**

Antibiotics are medications that kill or inhibit bacteria. They are *not* effective against viral infections such as the common cold or influenza.

**Key principles for safe use:**
- **Complete the full course** even if you feel better early — stopping prematurely promotes resistance
- **Never share or reuse** antibiotics — prescriptions are tailored to the specific infection and patient
- **Do not request antibiotics for viral illnesses** — this is a leading driver of antibiotic resistance
- **Take as directed** — some should be taken with food to reduce GI side effects

**Common side effects:**
- Gastrointestinal upset (nausea, diarrhoea) — often reduced by taking with meals
- Allergic reactions — seek immediate care for rash, swelling, or breathing difficulty
- Yeast/fungal overgrowth — probiotics during and after a course may help

\`\`\`
Common antibiotic classes
  Penicillins:       amoxicillin, ampicillin
  Cephalosporins:    cephalexin, ceftriaxone
  Macrolides:        azithromycin, clarithromycin
  Fluoroquinolones:  ciprofloxacin, levofloxacin
  Tetracyclines:     doxycycline, minocycline
\`\`\`

**Disclaimer:** Only take antibiotics prescribed by a licensed healthcare provider for your specific condition.`,

  default: `Thank you for reaching out to MedAssist AI. I can provide general health information to help you better understand medical topics.

**How I can help:**
- Explaining medical conditions, symptoms, and terminology
- Describing how medications and treatments generally work
- Clarifying diagnostic procedures and what to expect
- Offering healthy lifestyle and preventive care guidance
- Helping you prepare questions for your doctor's appointment

**Please note:**
I am an AI assistant, not a substitute for professional medical advice, diagnosis, or treatment. For personal health concerns, always consult a qualified healthcare provider.

If you are experiencing a **medical emergency**, please call **911** (or your local emergency number) or go to the nearest emergency room immediately.

Feel free to ask me anything — I'm here to help!`,
};

function selectResponse(userMessage) {
  if (/diabet|blood sugar|insulin|glucose|hba1c/i.test(userMessage)) return RESPONSES.diabetes;
  if (/blood pressure|hypertens|systolic|diastolic|\bbp\b/i.test(userMessage)) return RESPONSES.hypertension;
  if (/\bmri\b|ct scan|imaging|x.?ray|\bscan\b/i.test(userMessage)) return RESPONSES.mri_ct;
  if (/antibiotic|amoxicillin|penicillin|infection|bacteria/i.test(userMessage)) return RESPONSES.antibiotics;
  return RESPONSES.default;
}

/**
 * Simulates streaming an AI response token by token.
 *
 * @param {string}   message    - The user's message.
 * @param {function} onChunk    - Called with the progressively growing response string.
 * @param {function} onComplete - Called with the full response string when done.
 * @returns {function} cancel   - Call to abort the stream mid-flight.
 */
export function streamResponse(message, onChunk, onComplete) {
  const response = selectResponse(message);
  let index = 0;
  let initialTimer;
  let tickInterval;

  initialTimer = setTimeout(() => {
    tickInterval = setInterval(() => {
      const chunkSize = Math.floor(Math.random() * 4) + 2; // 2–5 chars per tick
      index = Math.min(index + chunkSize, response.length);
      onChunk(response.slice(0, index));

      if (index >= response.length) {
        clearInterval(tickInterval);
        onComplete(response);
      }
    }, STREAM_TICK_MS);
  }, STREAM_INITIAL_DELAY_MS);

  return function cancel() {
    clearTimeout(initialTimer);
    clearInterval(tickInterval);
  };
}
