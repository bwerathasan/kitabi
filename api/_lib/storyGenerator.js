/**
 * storyGenerator.js — True Story Engine v2
 *
 * Uses Google Gemini to generate a completely unique 16-page Arabic story
 * guided by:
 *   - A concrete PLOT BLUEPRINT (one of 5 per theme) — specific premise,
 *     setting variant, inciting incident, characters, world rules
 *   - 10 cross-cutting DNA dimensions — tone, pacing, conflict, etc.
 *
 * The blueprint is the primary variation driver — it forces a completely
 * different story concept even before the DNA dimensions are applied.
 */

import { buildStoryDNA, summarizeDNA, THEME_BLUEPRINTS } from './storyDNA.js'
import { buildEventChain } from './eventPools.js'

// ---------------------------------------------------------------------------
// Gemini API
// ---------------------------------------------------------------------------
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

async function callGemini(prompt, apiKey) {
  let res
  try {
    res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:      0.85,   // safe: <1.0 required for stable JSON-mode responses
          topP:             0.95,
          // topK removed: not needed and can cause 500s on some Gemini versions
          maxOutputTokens:  8192,
          responseMimeType: 'application/json',
        },
      }),
    })
  } catch (fetchErr) {
    throw new Error(`Gemini network error: ${fetchErr.message}`)
  }

  if (!res.ok) {
    let errBody = ''
    try { errBody = await res.text() } catch {}
    console.error(`[gemini] HTTP ${res.status} — body: ${errBody.slice(0, 300)}`)
    throw new Error(`Gemini API ${res.status}: ${errBody.slice(0, 300)}`)
  }

  let data
  try {
    data = await res.json()
  } catch (parseErr) {
    console.error('[gemini] Failed to parse response as JSON:', parseErr.message)
    throw new Error(`Gemini response parse failed: ${parseErr.message}`)
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    const finishReason = data?.candidates?.[0]?.finishReason
    const safetyRatings = JSON.stringify(data?.candidates?.[0]?.safetyRatings ?? [])
    console.error(`[gemini] Empty text. finishReason=${finishReason} safety=${safetyRatings}`)
    throw new Error(`Gemini returned empty text (finishReason: ${finishReason})`)
  }

  try {
    return JSON.parse(text)
  } catch {
    console.error('[gemini] JSON.parse failed — raw text prefix:', text.slice(0, 200))
    const match = text.match(/```(?:json)?\s*([\s\S]+?)```/)
    if (match) {
      try { return JSON.parse(match[1]) } catch {}
    }
    throw new Error('Gemini response is not valid JSON')
  }
}

// ---------------------------------------------------------------------------
// Age label
// ---------------------------------------------------------------------------
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
// Banned openings — grows over time as Gemini develops habits
// ---------------------------------------------------------------------------
const BANNED_OPENINGS = [
  'في يوم من الأيام',
  'كان يا ما كان',
  'في قديم الزمان',
  'ذات يوم',
  'في صباح',
  'استيقظ',
  'فتح عينيه',
  'قرر أن',
  'كان هناك',
  'عاش',
]

// ---------------------------------------------------------------------------
// Opening style library — 18 different ways to begin a story
// Injected into the prompt to show Gemini concrete alternatives
// ---------------------------------------------------------------------------
const OPENING_STYLES = [
  'Begin mid-action — drop the reader straight into something already happening',
  'Begin with a sensation — what the child hears/smells/feels before they understand where they are',
  'Begin with an observation — the child notices something wrong before anything is said',
  'Begin with a single unexpected detail that makes the world feel immediately alive',
  'Begin with a question the child is already holding as the story opens',
  'Begin with a contrast — something is different from how it was yesterday',
  'Begin at the moment of decision — the child is standing at a threshold',
  'Begin with the world behaving wrongly in a small, specific way',
  'Begin with an arrival — something or someone has just appeared',
  'Begin at the end of something else — the previous story has just finished',
  'Begin in the middle of a conversation already in progress',
  'Begin with a memory that turns out to be relevant right now',
  'Begin with a physical sensation that demands to be followed',
  'Begin with silence — a specific, loaded silence',
  'Begin with something the child cannot explain but refuses to ignore',
  'Begin with the world holding its breath',
  'Begin with an object that is out of place',
  'Begin with the last ordinary moment before everything changes',
]

// ---------------------------------------------------------------------------
// Prompt builder — blueprint-driven
// ---------------------------------------------------------------------------
function buildGenerationPrompt(order, dna, eventChain) {
  const { child_name, gender, age_group, theme } = order
  const isMale      = gender === 'male' || gender === 'boy' || gender === 'ذكر'
  const pronoun     = isMale ? 'هو' : 'هي'
  const ageLabel    = AGE_LABELS[age_group] || '6-year-old'
  const genderLabel = isMale ? 'boy' : 'girl'
  const bp          = dna.blueprint

  // Select opening style using the blueprint id as additional entropy
  const openingStyleIndex = Math.abs(
    bp.id.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)
  ) % OPENING_STYLES.length
  const openingStyle = OPENING_STYLES[openingStyleIndex]

  // Cast list from blueprint + secondary
  const castList = [
    ...bp.supporting_cast,
    dna.secondary,
  ].map((c, i) => `  ${i + 1}. ${c}`).join('\n')

  // Structure flow
  const structureFlow = dna.structure.flow
    .map((beat, i) => `  ${i + 1}. ${beat}`)
    .join('\n')

  // Banned openings list
  const bannedList = BANNED_OPENINGS.map(b => `"${b}"`).join(', ')

  return `You are a master Arabic children's book author. Your stories are celebrated for being genuinely DIFFERENT from each other — no two feel alike, even when set in the same world.

Write a complete, unique 16-page Arabic storybook for ${child_name}.

════════════════════════════════════════════
THIS STORY'S SPECIFIC BLUEPRINT
(this is NOT a generic theme story — it is this exact story)
════════════════════════════════════════════

STORY PREMISE:
"${bp.premise}"

THE STORY BEGINS WITH THIS EXACT INCITING INCIDENT:
"${bp.inciting_incident}"

${child_name}'s ROLE IN THIS SPECIFIC STORY:
"${bp.protagonist_role}"

THE SPECIFIC SETTING (not generic — use these exact visual details):
"${bp.setting_variant}"

THE WORLD RULE UNIQUE TO THIS STORY:
"${bp.world_detail}"

THE CHARACTERS IN THIS STORY:
${castList}

THE SPECIFIC CHALLENGE:
"${bp.core_challenge}"

════════════════════════════════════════════
STORY DNA — CROSS-CUTTING DIMENSIONS
════════════════════════════════════════════

EMOTIONAL TONE (felt on every page, not stated):
"${dna.tone.en}"

PACING STYLE (how pages flow):
"${dna.pacing.en}"

TYPE OF CONFLICT (the nature of the core challenge):
"${dna.conflict.en}"

HELPER DYNAMIC:
"${dna.helper.en}"

PLOT TWIST (lay groundwork from page 6 onward, deliver by page 12):
"${dna.twist.en}"

ENDING TYPE:
"${dna.ending.en}"

NARRATIVE STRUCTURE STYLE:
"${dna.narrative.en}"

OVERARCHING GOAL:
"${dna.goal.en}"

════════════════════════════════════════════
STORY STRUCTURE: "${dna.structure.name}"
${dna.structure.description}
════════════════════════════════════════════
REQUIRED STORY BEATS (follow this arc across 16 pages):
${structureFlow}

════════════════════════════════════════════
MANDATORY EVENT CHAIN — THIS STORY'S SPECIFIC SEQUENCE
(These events MUST happen in the specified page ranges. Build story beats around them.)
════════════════════════════════════════════

PAGES 1–2 (OPENING EVENT):
"${eventChain.start}"

PAGES 3–5 (FIRST CHALLENGE):
"${eventChain.mid_a}"

PAGES 6–8 (COMPLICATION):
"${eventChain.mid_b}"

PAGES 9–11 (TURNING POINT):
"${eventChain.mid_c}"

PAGES 15–16 (RESOLUTION):
"${eventChain.end}"

Each event is MANDATORY — the story must visibly enact it within the specified pages.
Pages 12–14 are yours to use as build-up toward the resolution.
These events COMBINE with the blueprint above — they do not replace it.

════════════════════════════════════════════
CHARACTER
════════════════════════════════════════════
Name: ${child_name}
Age: ${ageLabel} ${genderLabel}
Arabic pronoun: ${pronoun}
Theme world: ${theme}

════════════════════════════════════════════
OPENING STYLE INSTRUCTION (CRITICAL)
════════════════════════════════════════════
Page 1 must use this specific opening approach:
"${openingStyle}"

ABSOLUTELY BANNED opening words/phrases (these make stories sound identical):
${bannedList}

════════════════════════════════════════════
ABSOLUTE WRITING RULES — ALL MUST BE FOLLOWED
════════════════════════════════════════════
1. Each page: EXACTLY 3 sentences. Short, vivid, specific. No exceptions.
2. EVERY page must open with a DIFFERENT Arabic word — zero repetition across 16 pages.
3. "فجأة" (suddenly) is allowed MAXIMUM ONCE in the entire story. Find other ways to convey surprise.
4. Every page must visibly advance the plot OR deepen the emotional state — zero filler pages.
5. The tone "${dna.tone.id}" must be FELT through word choice and sentence rhythm — never stated.
6. The conflict must feel REAL and personal — not abstract or generic.
7. The twist must be EARNED — lay three subtle seeds before delivering it.
8. Use ${child_name}'s name at most ONCE every 3 pages — use pronouns naturally in between.
9. The blueprint's world rule must be used as an active story element at least TWICE.
10. Each supporting character must appear in at least 2 different pages doing something specific.
11. The inciting incident from the blueprint must happen on page 1 or 2 — this is non-negotiable.
12. The story must feel UNLIKE any known children's book — no templates, no formulas.
13. Arabic must be Modern Standard Arabic — formal but warm, beautiful when read aloud.
14. The story must be SELF-CONSISTENT — what happens on page 3 must still be true on page 14.

════════════════════════════════════════════
IMAGE DESCRIPTIONS
════════════════════════════════════════════
For each of the 16 pages AND the cover, write a SHORT English image description (20-30 words):
- The EXACT scene on that specific page — not a generic theme illustration
- ${child_name}'s precise position, action, and facial expression
- Specific environment details matching the blueprint setting
- Other characters present and what they are doing
- The emotional energy of the scene

The cover_event shows ${child_name} in the single most iconic moment of THIS specific story.

════════════════════════════════════════════
OUTPUT — Return ONLY valid JSON, nothing else
════════════════════════════════════════════
{
  "title": "و[evocative Arabic story title — the specific adventure name after 'و']",
  "pages": [
    "Arabic text page 1 — exactly 3 sentences",
    "Arabic text page 2 — exactly 3 sentences",
    "Arabic text page 3 — exactly 3 sentences",
    "Arabic text page 4 — exactly 3 sentences",
    "Arabic text page 5 — exactly 3 sentences",
    "Arabic text page 6 — exactly 3 sentences",
    "Arabic text page 7 — exactly 3 sentences",
    "Arabic text page 8 — exactly 3 sentences",
    "Arabic text page 9 — exactly 3 sentences",
    "Arabic text page 10 — exactly 3 sentences",
    "Arabic text page 11 — exactly 3 sentences",
    "Arabic text page 12 — exactly 3 sentences",
    "Arabic text page 13 — exactly 3 sentences",
    "Arabic text page 14 — exactly 3 sentences",
    "Arabic text page 15 — exactly 3 sentences",
    "Arabic text page 16 — exactly 3 sentences"
  ],
  "page_events": [
    "English scene description page 1",
    "English scene description page 2",
    "English scene description page 3",
    "English scene description page 4",
    "English scene description page 5",
    "English scene description page 6",
    "English scene description page 7",
    "English scene description page 8",
    "English scene description page 9",
    "English scene description page 10",
    "English scene description page 11",
    "English scene description page 12",
    "English scene description page 13",
    "English scene description page 14",
    "English scene description page 15",
    "English scene description page 16"
  ],
  "cover_event": "English cover image description — the most iconic moment of THIS specific story"
}`
}

// ---------------------------------------------------------------------------
// Validation
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
    result.cover_event = result.page_events[0] || `${childName} at the heart of the adventure, wide-eyed and determined`
  }
  result.pages = result.pages.map((p, i) =>
    (typeof p === 'string' && p.trim()) ? p.trim() : `صفحة ${i + 1}`
  )
  result.page_events = result.page_events.map((e, i) =>
    (typeof e === 'string' && e.trim()) ? e.trim() : `${childName} in the adventure, page ${i + 1}`
  )
  return result
}

// ---------------------------------------------------------------------------
// Anti-repeat blueprint selection
// ---------------------------------------------------------------------------

/**
 * Queries Supabase for the last 5 blueprint IDs used for this theme.
 * If the current blueprint was used recently, cycles through the theme's
 * other blueprints to pick a fresher one.
 *
 * Falls back silently to the original DNA if anything fails.
 */
async function selectFreshBlueprint(dna, theme) {
  const supabaseUrl = process.env.SUPABASE_URL
  const anonKey     = process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return dna  // no env vars — skip silently

  let recentBlueprints = []
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/orders?theme=eq.${encodeURIComponent(theme)}&select=story_json&order=created_at.desc&limit=5`,
      { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } }
    )
    if (res.ok) {
      const rows = await res.json()
      recentBlueprints = rows
        .map(r => r.story_json?.dna?.blueprint)
        .filter(Boolean)
    }
  } catch (err) {
    console.warn('[story-gen] anti-repeat query failed (non-fatal):', err.message)
    return dna
  }

  if (recentBlueprints.length === 0) return dna
  if (!recentBlueprints.includes(dna.blueprint.id)) {
    console.log(`[story-gen] ANTI-REPEAT: blueprint ${dna.blueprint.id} is fresh ✓`)
    return dna
  }

  // Current blueprint was used recently — try alternatives
  const allBlueprints = THEME_BLUEPRINTS[theme] || THEME_BLUEPRINTS.forest
  const alternatives  = allBlueprints.filter(bp => !recentBlueprints.includes(bp.id))

  if (alternatives.length === 0) {
    console.warn(`[story-gen] ANTI-REPEAT: all blueprints used recently for theme=${theme}, proceeding with original`)
    return dna
  }

  // Pick from alternatives — use a time-based offset for freshness
  const freshBlueprint = alternatives[Date.now() % alternatives.length]
  console.log(`[story-gen] ANTI-REPEAT: swapped ${dna.blueprint.id} → ${freshBlueprint.id} (was in last 5)`)

  return { ...dna, blueprint: freshBlueprint }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generates a complete unique story for an order using Gemini + blueprint DNA.
 *
 * @param {object} order — { id, child_name, gender, age_group, theme }
 * @returns {Promise<{title, pages, page_events, cover_event, dna, dna_summary}>}
 */
export async function generateStory(order) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not configured')

  // Build DNA then apply anti-repeat blueprint selection
  let dna = buildStoryDNA(order.id, order.theme)
  dna = await selectFreshBlueprint(dna, order.theme)

  // Build event chain — uses orderId + blueprintId for extra entropy
  const eventChain = buildEventChain(order.id, dna.blueprint.id, order.theme)

  const summary = summarizeDNA(dna)
  const prompt  = buildGenerationPrompt(order, dna, eventChain)

  // Prominent debug log — shows exactly which blueprint + events were chosen
  console.log(`[story-gen] ═══════════════════════════════════`)
  console.log(`[story-gen] ORDER:     ${order.id}`)
  console.log(`[story-gen] CHILD:     ${order.child_name} (${order.gender}, ${order.age_group})`)
  console.log(`[story-gen] THEME:     ${order.theme}`)
  console.log(`[story-gen] BLUEPRINT: ${dna.blueprint.id}`)
  console.log(`[story-gen] PREMISE:   ${dna.blueprint.premise.slice(0, 80)}...`)
  console.log(`[story-gen] STRUCTURE: ${dna.structure.id} — ${dna.structure.name}`)
  console.log(`[story-gen] TONE:      ${dna.tone.id}`)
  console.log(`[story-gen] CONFLICT:  ${dna.conflict.id}`)
  console.log(`[story-gen] TWIST:     ${dna.twist.id}`)
  console.log(`[story-gen] SECONDARY: ${dna.secondary.slice(0, 50)}`)
  console.log(`[story-gen] FULL DNA:  ${summary}`)
  console.log(`[story-gen] EVENTS:    ${eventChain.summary}`)
  console.log(`[story-gen] ═══════════════════════════════════`)

  let raw
  try {
    raw = await callGemini(prompt, apiKey)
  } catch (err) {
    throw new Error(`Gemini story generation failed: ${err.message}`)
  }

  const validated = validateStoryResult(raw, order.child_name)

  console.log(`[story-gen] TITLE:     ${validated.title}`)
  console.log(`[story-gen] ✓ Story generated successfully`)

  return {
    title:       validated.title,
    pages:       validated.pages,
    page_events: validated.page_events,
    cover_event: validated.cover_event,
    dna_summary: summary,
    dna: {
      blueprint:  dna.blueprint.id,
      structure:  dna.structure.id,
      goal:       dna.goal.id,
      tone:       dna.tone.id,
      pacing:     dna.pacing.id,
      conflict:   dna.conflict.id,
      helper:     dna.helper.id,
      twist:      dna.twist.id,
      ending:     dna.ending.id,
      narrative:  dna.narrative.id,
      opening:    dna.opening.id,
      events: {
        start: eventChain.start,
        mid_a: eventChain.mid_a,
        mid_b: eventChain.mid_b,
        mid_c: eventChain.mid_c,
        end:   eventChain.end,
      },
    },
  }
}
