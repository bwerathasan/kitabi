/**
 * /api/services/imageProvider.js
 *
 * Image generation abstraction layer.
 *
 * generateImageWithReference(prompt, referenceBuffer) — PRIORITY ORDER:
 *   1. REPLICATE_API_KEY  → Replicate FLUX + PuLID (fofr/flux-pulid)
 *                           Real face identity encoding — strongest character consistency.
 *                           Requires referenceBuffer (portrait of the child).
 *   2. GOOGLE_AI_API_KEY  → Google Nano Banana reference path (visual in-context)
 *   3. Fallback           → generateImage(prompt) text-only
 *
 * generateImage(prompt) — PRIORITY ORDER (text-only, used for reference portrait):
 *   1. GOOGLE_AI_API_KEY  → Google Nano Banana (gemini-2.5-flash-image)
 *   2. TOGETHER_API_KEY   → Together AI FLUX.1-schnell
 *   3. OPENAI_API_KEY     → OpenAI DALL-E 3
 *
 * Both functions return Promise<Buffer> (JPEG image bytes).
 */

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * generateImageWithReference(prompt, referenceBuffer)
 *
 * Gemini path: sends the reference portrait as inlineData in the first part,
 * then asks the model to draw the SAME character in the new scene described
 * by `prompt`. This preserves hair color, hair type, skin tone, and face
 * structure much more reliably than text-only prompts.
 *
 * FLUX / DALL-E path: reference images are not supported — falls back to
 * generateImage(prompt) silently. Behavior is unchanged from before.
 *
 * @param {string} prompt         - Full scene prompt (identity_lock + event)
 * @param {Buffer|null} referenceBuffer - JPEG buffer of the reference portrait
 */
export async function generateImageWithReference(prompt, referenceBuffer) {
  // Priority 1: Replicate PuLID — real face identity encoding via mathematical embedding.
  // Dramatically more reliable than visual in-context hints for hair/eye/skin consistency.
  if (process.env.REPLICATE_API_KEY && referenceBuffer) {
    return await withRetry(
      () => generateWithReplicatePuLID(prompt, referenceBuffer),
      'Replicate PuLID'
    )
  }
  // Priority 2: Gemini with reference image — visual in-context conditioning
  if (process.env.GOOGLE_AI_API_KEY && referenceBuffer) {
    return await withRetry(
      () => generateWithNanoBananaReference(prompt, referenceBuffer),
      'Nano Banana (ref)'
    )
  }
  // Priority 3: text-only fallback — unchanged behavior
  return await generateImage(prompt)
}

export async function generateImage(prompt) {
  const STYLE_LOCK =
    "cinematic children's book illustration, soft warm lighting, magical atmosphere, " +
    "highly detailed, expressive character, premium storybook style, rich colors, " +
    "consistent character design, " +
    "NO text, NO letters, NO words, NO typography, NO signs, NO labels, NO captions, purely visual"

  const fullPrompt = prompt.includes('storybook style')
    ? prompt
    : `${prompt}, ${STYLE_LOCK}`

  if (process.env.GOOGLE_AI_API_KEY) {
    return await withRetry(() => generateWithNanoBanana(fullPrompt), 'Nano Banana')
  }
  if (process.env.TOGETHER_API_KEY) {
    return await withRetry(() => generateWithTogether(fullPrompt), 'Together AI')
  }
  if (process.env.OPENAI_API_KEY) {
    return await withRetry(() => generateWithDallE(fullPrompt), 'DALL-E 3')
  }
  throw new Error(
    'No image API key configured. Set GOOGLE_AI_API_KEY (needs billing), ' +
    'TOGETHER_API_KEY, or OPENAI_API_KEY in Vercel env vars.'
  )
}

// ---------------------------------------------------------------------------
// Retry wrapper — one retry on failure
// ---------------------------------------------------------------------------
async function withRetry(fn, label) {
  try {
    return await fn()
  } catch (err) {
    console.warn(`${label} attempt 1 failed: ${err.message}. Retrying...`)
    try {
      return await fn()
    } catch (err2) {
      throw new Error(`${label} failed after 2 attempts: ${err2.message}`)
    }
  }
}

// ---------------------------------------------------------------------------
// Provider 0: Replicate FLUX + PuLID  (fofr/flux-pulid)
//
// PuLID extracts a mathematical face embedding from the reference portrait
// and conditions every generation on that embedding — not just a visual hint.
// This is the only approach in this stack that can reliably lock hair color,
// skin tone, and face structure across all 17 pages.
//
// Requires: REPLICATE_API_KEY + a referenceBuffer (from the reference portrait step).
// Only called from generateImageWithReference — never from generateImage.
// ---------------------------------------------------------------------------
async function generateWithReplicatePuLID(prompt, referenceBuffer) {
  const key          = process.env.REPLICATE_API_KEY
  const referenceB64 = `data:image/jpeg;base64,${referenceBuffer.toString('base64')}`

  // Start prediction — Prefer: wait asks Replicate to return synchronously if done in time
  const createRes = await fetch(
    'https://api.replicate.com/v1/models/fofr/flux-pulid/predictions',
    {
      method:  'POST',
      headers: {
        'Authorization': `Token ${key}`,
        'Content-Type':  'application/json',
        'Prefer':        'wait=60',
      },
      body: JSON.stringify({
        input: {
          prompt,
          main_face_image:     referenceB64,
          id_weight:           1.0,    // identity lock strength (0–3); 1.0 = balanced quality + consistency
          width:               768,
          height:              1024,   // portrait — book page ratio
          num_outputs:         1,
          output_format:       'jpg',
          output_quality:      90,
          num_inference_steps: 25,
          guidance_scale:      4.0,
        },
      }),
    }
  )

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Replicate PuLID ${createRes.status}: ${err.slice(0, 300)}`)
  }

  let prediction = await createRes.json()

  // If Prefer: wait didn't complete it, poll until done
  if (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
    prediction = await pollReplicatePrediction(prediction.id, key)
  }

  if (prediction.status === 'failed') {
    throw new Error(`Replicate PuLID failed: ${prediction.error || 'unknown error'}`)
  }

  const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
  if (!outputUrl) {
    throw new Error(`Replicate PuLID: no output URL — prediction ${prediction.id}`)
  }

  const imgRes = await fetch(outputUrl)
  if (!imgRes.ok) throw new Error(`Replicate PuLID: fetch output failed ${imgRes.status}`)

  return Buffer.from(await imgRes.arrayBuffer())
}

async function pollReplicatePrediction(predictionId, key, maxWaitMs = 120000) {
  const url       = `https://api.replicate.com/v1/predictions/${predictionId}`
  const deadline  = Date.now() + maxWaitMs

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 3000))   // poll every 3 seconds

    const res = await fetch(url, {
      headers: { 'Authorization': `Token ${key}` },
    })
    if (!res.ok) throw new Error(`Replicate poll ${res.status}: ${await res.text().then(t => t.slice(0, 200))}`)

    const prediction = await res.json()
    if (prediction.status === 'succeeded' || prediction.status === 'failed') return prediction
    // status is 'starting' or 'processing' — keep polling
  }

  throw new Error(`Replicate PuLID prediction ${predictionId} timed out after ${maxWaitMs / 1000}s`)
}

// ---------------------------------------------------------------------------
// Provider 1: Google Nano Banana (gemini-2.5-flash-image)
//
// REQUIRES: billing enabled at https://ai.dev/projects
// The free tier has limit=0 for all image generation models.
//
// Model confirmed available: gemini-2.5-flash-image (displayName: "Nano Banana")
// Also available: nano-banana-pro-preview (displayName: "Nano Banana Pro")
// ---------------------------------------------------------------------------
async function generateWithNanoBanana(prompt) {
  const key = process.env.GOOGLE_AI_API_KEY

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role:  'user',
            parts: [{ text: `Generate an illustration: ${prompt}` }],
          },
        ],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    // Surface billing requirement clearly
    if (err.includes('limit: 0') || err.includes('quota')) {
      throw new Error(
        `Google Nano Banana: billing not enabled on this API key. ` +
        `Enable billing at https://ai.dev/projects then retry. Raw: ${err.slice(0, 200)}`
      )
    }
    throw new Error(`Google Nano Banana ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json()

  // Response: { candidates: [{ content: { parts: [{ inlineData: { mimeType, data } }] } }] }
  const parts    = data?.candidates?.[0]?.content?.parts ?? []
  const imgPart  = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'))

  if (!imgPart) {
    throw new Error(
      `Nano Banana: no image part in response. Parts: ${JSON.stringify(parts).slice(0, 300)}`
    )
  }

  return Buffer.from(imgPart.inlineData.data, 'base64')
}

// ---------------------------------------------------------------------------
// Provider 1b: Google Nano Banana — reference-image path
//
// Sends the reference portrait as inlineData in the user turn alongside the
// scene prompt. The model conditions on actual pixels, making hair color,
// skin tone, and face structure dramatically more reliable than text alone.
// ---------------------------------------------------------------------------
async function generateWithNanoBananaReference(prompt, referenceBuffer) {
  const key          = process.env.GOOGLE_AI_API_KEY
  const referenceB64 = referenceBuffer.toString('base64')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role:  'user',
            parts: [
              {
                // Reference portrait — face/hair/skin/eyes clearly visible
                inline_data: {
                  mime_type: 'image/jpeg',
                  data:      referenceB64,
                },
              },
              {
                text:
                  `This image is the REFERENCE PORTRAIT of the child character. ` +
                  `Their exact hair color, hair type, skin tone, eye color, and face structure ` +
                  `must be preserved precisely in the new scene. ` +
                  `Now draw this EXACT SAME child character in a completely new scene: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    if (err.includes('limit: 0') || err.includes('quota')) {
      throw new Error(
        `Google Nano Banana: billing not enabled on this API key. ` +
        `Enable billing at https://ai.dev/projects then retry. Raw: ${err.slice(0, 200)}`
      )
    }
    throw new Error(`Google Nano Banana (ref) ${res.status}: ${err.slice(0, 300)}`)
  }

  const data    = await res.json()
  const parts   = data?.candidates?.[0]?.content?.parts ?? []
  const imgPart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'))

  if (!imgPart) {
    throw new Error(
      `Nano Banana (ref): no image part in response. Parts: ${JSON.stringify(parts).slice(0, 300)}`
    )
  }

  return Buffer.from(imgPart.inlineData.data, 'base64')
}

// ---------------------------------------------------------------------------
// Provider 2: Together AI — FLUX.1-schnell
// Sign up free at https://api.together.ai
// Free tier uses FLUX.1-schnell-Free (watermarked, lower res)
// Paid tier: FLUX.1-schnell (no watermark, 768×1024, fast)
// ---------------------------------------------------------------------------
async function generateWithTogether(prompt) {
  // Use paid schnell if available, otherwise free version
  const model = 'black-forest-labs/FLUX.1-schnell'

  const res = await fetch('https://api.together.xyz/v1/images/generations', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      width:           768,
      height:          1024,   // portrait — book page ratio
      steps:           4,
      n:               1,
      response_format: 'b64_json',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Together AI ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json()
  const b64  = data?.data?.[0]?.b64_json
  if (!b64) {
    throw new Error(`Together AI: no image in response — ${JSON.stringify(data).slice(0, 200)}`)
  }
  return Buffer.from(b64, 'base64')
}

// ---------------------------------------------------------------------------
// Provider 3: OpenAI DALL-E 3 (fallback)
// ---------------------------------------------------------------------------
async function generateWithDallE(prompt) {
  const safePrompt = prompt.length > 3900 ? prompt.slice(0, 3900) : prompt

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:           'dall-e-3',
      prompt:          safePrompt,
      n:               1,
      size:            '1024x1792',  // portrait
      quality:         'standard',
      response_format: 'b64_json',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DALL-E 3 ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json()
  const b64  = data?.data?.[0]?.b64_json
  if (!b64) {
    throw new Error(`DALL-E 3: no image in response — ${JSON.stringify(data).slice(0, 200)}`)
  }
  return Buffer.from(b64, 'base64')
}
