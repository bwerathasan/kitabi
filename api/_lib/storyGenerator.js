/**
 * storyGenerator.js — True Story Engine
 *
 * Uses Google Gemini to generate a completely unique 16-page Arabic story
 * guided by a deterministic Story DNA object.
 *
 * Every order gets a structurally different story — not a template variation
 * but a genuinely different narrative with different structure, tone, pacing,
 * conflict, twist, and emotional arc.
 *
 * Returns:
 * {
 *   title:        string              — Arabic title ("و...")
 *   pages:        string[16]          — Arabic story text per page
 *   page_events:  string[16]          — English image scene descriptions per page
 *   cover_event:  string              — English cover image scene description
 *   dna_summary:  string              — human-readable DNA summary for logging
 *   dna:          object              — DNA dimension IDs
 * }
 */

import { buildStoryDNA, summarizeDNA } from './storyDNA.js'

// ---------------------------------------------------------------------------
// Gemini API
// ---------------------------------------------------------------------------
const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

async function callGemini(systemPrompt, apiKey) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature:       0.92,
        topP:              0.95,
        maxOutputTokens:   8192,
        responseMimeType:  'application/json',
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned empty response')

  try {
    return JSON.parse(text)
  } catch {
    // Try to extract JSON from the response if it's wrapped in markdown
    const match = text.match(/```(?:json)?\s*([\s\S]+?)```/)
    if (match) return JSON.parse(match[1])
    throw new Error('Gemini response is not valid JSON')
  }
}

// ---------------------------------------------------------------------------
// Theme setting descriptions
// ---------------------------------------------------------------------------
const THEME_SETTINGS = {
  jungle:  'a vast vibrant tropical jungle — ancient trees cathedral-tall, exotic birds, dense green, rivers, hidden clearings, living vines',
  space:   'the boundless cosmos — planets with rings, colorful nebulae, asteroid fields, alien worlds, starlight in every direction',
  ocean:   'the deep mysterious ocean — coral reefs exploding with color, underwater caves, glowing creatures, currents and kelp forests',
  forest:  'an ancient magical forest — enormous old oaks, enchanted clearings, misty paths, moss-covered stones, mystical creatures',
  desert:  'a vast golden desert — towering dunes, hidden oases, ancient ruins half-buried in sand, desert foxes, blazing stars at night',
  farm:    'a living farm in full season — golden fields, red barn, animals with personalities, the smell of earth and rain and harvest',
}

// Age label from age_group
const AGE_LABELS = {
  '2-4':  '3-year-old',
  '3-5':  '4-year-old',
  '4-6':  '5-year-old',
  '5-7':  '6-year-old',
  '6-8':  '7-year-old',
  '7-10': '8-year-old',
  '8-10': '9-year-old',
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------
function buildGenerationPrompt(order, dna) {
  const { child_name, gender, age_group, theme } = order
  const isMale   = gender === 'male' || gender === 'boy' || gender === 'ذكر'
  const pronoun  = isMale ? 'هو' : 'هي'
  const setting  = THEME_SETTINGS[theme] || THEME_SETTINGS.forest
  const ageLabel = AGE_LABELS[age_group] || '6-year-old'
  const genderLabel = isMale ? 'boy' : 'girl'

  // Build the structure flow as numbered instructions
  const structureFlow = dna.structure.flow
    .map((beat, i) => `  ${i + 1}. ${beat}`)
    .join('\n')

  return `You are a master Arabic children's book author with decades of experience writing stories that children love and parents find genuinely moving.

Write a complete 16-page Arabic storybook for a child named "${child_name}".

═══════════════════════════════════════════════
STORY DNA — follow every dimension with precision
═══════════════════════════════════════════════

GOAL (what ${child_name} must achieve):
"${dna.goal.en}"

EMOTIONAL TONE (the feeling that pervades every single page):
"${dna.tone.en}"

PACING STYLE (how the story moves through its 16 pages):
"${dna.pacing.en}"

TYPE OF CONFLICT (the nature of the core challenge):
"${dna.conflict.en}"

HELPER CHARACTER (the aid ${child_name} receives, if any):
"${dna.helper.en}"

PLOT TWIST (a surprise that recontextualizes the story):
"${dna.twist.en}"

ENDING TYPE (how the story closes emotionally):
"${dna.ending.en}"

NARRATIVE STYLE (how the story is structured):
"${dna.narrative.en}"

OPENING HOOK (exactly how page 1 begins):
"${dna.opening.en}"

═══════════════════════════════════════════════
STORY STRUCTURE: "${dna.structure.name}"
${dna.structure.description}
═══════════════════════════════════════════════
REQUIRED STORY BEATS (follow this arc across 16 pages):
${structureFlow}

═══════════════════════════════════════════════
CHARACTER + SETTING
═══════════════════════════════════════════════
Name: ${child_name}
Age: ${ageLabel} ${genderLabel}, pronoun in Arabic: ${pronoun}
Setting: ${setting}
Theme category: ${theme}

═══════════════════════════════════════════════
ABSOLUTE WRITING RULES
═══════════════════════════════════════════════
1. Each page: EXACTLY 3 sentences of Arabic. Short, vivid, poetic. No more, no less.
2. EVERY page must open with a different Arabic word — no two pages can start the same way.
3. Use "فجأة" (suddenly) MAXIMUM ONCE in the entire story. Vary how you introduce surprise.
4. Every page must visibly advance the plot OR deepen the emotional state — ZERO filler pages.
5. The tone "${dna.tone.id}" must be FELT, not stated. Show it in word choice and rhythm.
6. The conflict must feel REAL and personal — not abstract.
7. The twist must be EARNED. Lay subtle groundwork before pages 10-11.
8. Use ${child_name}'s name at most ONCE every 3 pages — use "هو"/"هي" and natural pronouns.
9. NEVER use these clichéd Arabic openings: "في يوم من الأيام" / "كان يا ما كان" / "في قديم الزمان"
10. Each page should feel like a DIFFERENT EMOTIONAL BEAT — vary the rhythm.
11. The story must feel like a unique book — NOT a variation of any known children's story.
12. Arabic must be formal but warm — Modern Standard Arabic that flows naturally when read aloud.

═══════════════════════════════════════════════
IMAGE DESCRIPTIONS (page_events and cover_event)
═══════════════════════════════════════════════
For each of the 16 pages AND the cover, write a SHORT English image scene description (20-30 words) that describes:
- The EXACT visual scene on that specific page (NOT a generic theme scene)
- ${child_name}'s precise position, action, and facial expression
- Specific environment details (time of day, weather, lighting, key objects)
- Any other characters present and what they are doing
- The emotional energy of the scene visually

The cover_event should show ${child_name} in the most iconic moment of the story, in the setting.

═══════════════════════════════════════════════
OUTPUT FORMAT — Return ONLY valid JSON, no other text
═══════════════════════════════════════════════
{
  "title": "و[an evocative Arabic story title — the adventure name after 'و']",
  "pages": [
    "Arabic text for page 1 — exactly 3 sentences",
    "Arabic text for page 2 — exactly 3 sentences",
    "Arabic text for page 3 — exactly 3 sentences",
    "Arabic text for page 4 — exactly 3 sentences",
    "Arabic text for page 5 — exactly 3 sentences",
    "Arabic text for page 6 — exactly 3 sentences",
    "Arabic text for page 7 — exactly 3 sentences",
    "Arabic text for page 8 — exactly 3 sentences",
    "Arabic text for page 9 — exactly 3 sentences",
    "Arabic text for page 10 — exactly 3 sentences",
    "Arabic text for page 11 — exactly 3 sentences",
    "Arabic text for page 12 — exactly 3 sentences",
    "Arabic text for page 13 — exactly 3 sentences",
    "Arabic text for page 14 — exactly 3 sentences",
    "Arabic text for page 15 — exactly 3 sentences",
    "Arabic text for page 16 — exactly 3 sentences"
  ],
  "page_events": [
    "Specific English image description for page 1",
    "Specific English image description for page 2",
    "Specific English image description for page 3",
    "Specific English image description for page 4",
    "Specific English image description for page 5",
    "Specific English image description for page 6",
    "Specific English image description for page 7",
    "Specific English image description for page 8",
    "Specific English image description for page 9",
    "Specific English image description for page 10",
    "Specific English image description for page 11",
    "Specific English image description for page 12",
    "Specific English image description for page 13",
    "Specific English image description for page 14",
    "Specific English image description for page 15",
    "Specific English image description for page 16"
  ],
  "cover_event": "English image description for the book cover — the most iconic story moment"
}`
}

// ---------------------------------------------------------------------------
// Validation — ensures Gemini returned the right structure
// ---------------------------------------------------------------------------
function validateStoryResult(result, childName) {
  if (!result || typeof result !== 'object') {
    throw new Error('Story result is not an object')
  }
  if (!Array.isArray(result.pages) || result.pages.length !== 16) {
    throw new Error(`Expected 16 pages, got ${result.pages?.length ?? 'none'}`)
  }
  if (!Array.isArray(result.page_events) || result.page_events.length !== 16) {
    throw new Error(`Expected 16 page_events, got ${result.page_events?.length ?? 'none'}`)
  }
  if (!result.title || typeof result.title !== 'string') {
    result.title = `ومغامرة ${childName}`
  }
  if (!result.cover_event || typeof result.cover_event !== 'string') {
    result.cover_event = result.page_events[0] || `${childName} standing at the entrance of the adventure world, full of wonder`
  }
  // Ensure all pages are strings
  result.pages = result.pages.map((p, i) =>
    (typeof p === 'string' && p.trim()) ? p.trim() : `صفحة ${i + 1}`
  )
  result.page_events = result.page_events.map((e, i) =>
    (typeof e === 'string' && e.trim()) ? e.trim() : `${childName} in an adventure scene, page ${i + 1}`
  )
  return result
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generates a complete unique story for an order using Gemini + Story DNA.
 *
 * @param {object} order — { id, child_name, gender, age_group, theme }
 * @returns {Promise<{title, pages, page_events, cover_event, dna, dna_summary}>}
 */
export async function generateStory(order) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not configured')

  const dna     = buildStoryDNA(order.id, order.theme)
  const summary = summarizeDNA(dna)
  const prompt  = buildGenerationPrompt(order, dna)

  console.log(`[story-gen] order=${order.id} | ${summary}`)

  let raw
  try {
    raw = await callGemini(prompt, apiKey)
  } catch (err) {
    throw new Error(`Gemini story generation failed: ${err.message}`)
  }

  const validated = validateStoryResult(raw, order.child_name)

  return {
    title:       validated.title,
    pages:       validated.pages,
    page_events: validated.page_events,
    cover_event: validated.cover_event,
    dna_summary: summary,
    dna: {
      goal:      dna.goal.id,
      tone:      dna.tone.id,
      pacing:    dna.pacing.id,
      conflict:  dna.conflict.id,
      helper:    dna.helper.id,
      twist:     dna.twist.id,
      ending:    dna.ending.id,
      narrative: dna.narrative.id,
      opening:   dna.opening.id,
      structure: dna.structure.id,
    },
  }
}
