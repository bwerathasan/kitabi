/**
 * /api/main — consolidated serverless endpoint
 *
 * Replaces 9 separate route files to stay within Vercel Hobby plan's
 * 12-function limit.
 *
 * Routing:
 *   GET  ?action=book&id=<id>    → render interactive book HTML
 *   GET  ?action=get_order&id=<id> → return order JSON
 *   POST { action: "create_order",  ...fields }
 *   POST { action: "generate_order", id }
 *   POST { action: "confirm_order",  id, parent_name, phone, city, address }
 */

import { generateStory }           from './_lib/storyGenerator.js'
import { generateImage }            from './_lib/imageProvider.js'
import { generateStructuredPrompts } from './_lib/imagePrompts.js'
import { buildAndUploadPDF }        from './_lib/pdfPipeline.js'
import { sendCustomerEmail, sendAdminEmail } from './_lib/emailSender.js'
import { generateHTML }             from './_lib/bookRenderer.js'

export const config = { maxDuration: 300 }

// ---------------------------------------------------------------------------
// CORS helper
// ---------------------------------------------------------------------------
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

// ---------------------------------------------------------------------------
// Supabase helpers
// ---------------------------------------------------------------------------
function supaHeaders(key) {
  return {
    'apikey':        key,
    'Authorization': `Bearer ${key}`,
    'Content-Type':  'application/json',
  }
}

async function supabasePatch(url, anonKey, id, body) {
  return fetch(`${url}/rest/v1/orders?id=eq.${id}`, {
    method:  'PATCH',
    headers: { ...supaHeaders(anonKey), 'Prefer': 'return=minimal' },
    body:    JSON.stringify(body),
  })
}

async function fetchOrder(supabaseUrl, anonKey, id, select = '*') {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${id}&select=${select}`,
    { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } }
  )
  if (!res.ok) return null
  const rows = await res.json()
  return rows?.[0] ?? null
}

// ---------------------------------------------------------------------------
// Image generation + upload (used inside generate_order)
// ---------------------------------------------------------------------------
async function uploadImageToSupabase(buffer, storagePath, supabaseUrl, serviceKey) {
  const res = await fetch(`${supabaseUrl}/storage/v1/object/book-images/${storagePath}`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type':  'image/jpeg',
      'x-upsert':      'true',
    },
    body: buffer,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Storage upload failed (${storagePath}): ${res.status} ${err}`)
  }
  return `${supabaseUrl}/storage/v1/object/public/book-images/${storagePath}`
}

async function generateAndStoreImage(label, storagePath, prompt, supabaseUrl, serviceKey) {
  try {
    console.log(`[${label}] generating image...`)
    const buffer = await generateImage(prompt)
    console.log(`[${label}] uploading ${buffer.length} bytes...`)
    const url = await uploadImageToSupabase(buffer, storagePath, supabaseUrl, serviceKey)
    console.log(`[${label}] done → ${url}`)
    return { label, url, error: null }
  } catch (err) {
    console.error(`[${label}] FAILED: ${err.message}`)
    return { label, url: null, error: err.message }
  }
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

// ── GET book viewer ──────────────────────────────────────────────────────────
async function handleBook(req, res, id, supabaseUrl, anonKey) {
  if (!id) return res.status(400).send('Missing id')

  const order = await fetchOrder(supabaseUrl, anonKey, id, 'id,child_name,gender,age_group,theme,story_json')
  if (!order) return res.status(404).send('Order not found')

  const baseUrl = `${supabaseUrl}/storage/v1/object/public/book-images/${id}`
  const html    = generateHTML(order, baseUrl)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300')
  return res.status(200).send(html)
}

// ── GET order ────────────────────────────────────────────────────────────────
async function handleGetOrder(req, res, id, supabaseUrl, anonKey) {
  if (!id) return res.status(400).json({ detail: 'Missing id' })

  const order = await fetchOrder(supabaseUrl, anonKey, id,
    'id,child_name,age_group,gender,theme,status,pdf_url,story_json,created_at'
  )
  if (!order) return res.status(404).json({ detail: 'Order not found' })
  return res.status(200).json(order)
}

// ── POST create_order ─────────────────────────────────────────────────────────
async function handleCreateOrder(body, res, supabaseUrl, anonKey) {
  const { child_name, age_group, gender, theme, customer_email, style_preset, appearance,
          parent_name, phone, city, address } = body

  if (!child_name || !age_group || !gender || !theme || !customer_email) {
    return res.status(400).json({
      detail: 'بيانات ناقصة: ' + JSON.stringify({ child_name, age_group, gender, theme, customer_email }),
    })
  }

  const payload = {
    child_name,
    age_group,
    gender,
    theme,
    customer_email,
    style_preset:  style_preset || 'watercolor',
    status:        'pending',
    appearance:    appearance   || null,
    parent_name:   parent_name  || null,
    phone:         phone        || null,
    city:          city         || null,
    address:       address      || null,
  }

  const supaRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method:  'POST',
    headers: { ...supaHeaders(anonKey), 'Prefer': 'return=representation' },
    body:    JSON.stringify(payload),
  })

  const text = await supaRes.text()
  console.log('[create_order] Supabase response:', supaRes.status, text)

  if (!supaRes.ok) {
    return res.status(500).json({ detail: `Supabase error ${supaRes.status}: ${text}` })
  }

  const rows = JSON.parse(text)
  const row  = Array.isArray(rows) ? rows[0] : rows
  return res.status(201).json({ order_id: row.id, status: row.status, created_at: row.created_at })
}

// ── POST generate_order ───────────────────────────────────────────────────────
async function handleGenerateOrder(body, req, res, supabaseUrl, anonKey, serviceKey) {
  const { id } = body
  if (!id) return res.status(400).json({ detail: 'Missing id' })

  console.log('[generate_order] called for order:', id)

  // 1. Mark as generating
  const patchRes = await supabasePatch(supabaseUrl, anonKey, id, { status: 'generating' })
  if (!patchRes.ok) {
    const t = await patchRes.text()
    console.error('[generate_order] PATCH error:', patchRes.status, t)
    return res.status(500).json({ detail: `Supabase error: ${t}` })
  }

  // 2. Fetch order data
  const order = await fetchOrder(supabaseUrl, anonKey, id, 'id,child_name,gender,age_group,theme')
  if (!order) return res.status(404).json({ detail: 'Order not found' })

  // 3. Generate story
  let storyJson = null
  try {
    console.log(`[generate_order] generating story for ${id} (${order.child_name}, ${order.theme})`)
    storyJson = await generateStory(order)
    console.log(`[generate_order] story generated — DNA: ${storyJson.dna_summary}`)
    console.log(`[generate_order] title: ${storyJson.title}`)

    const storyPatch = await supabasePatch(supabaseUrl, anonKey, id, { story_json: storyJson })
    if (!storyPatch.ok) {
      console.warn(`[generate_order] story_json PATCH failed (${storyPatch.status}) — column may not exist. Using fallback.`)
      storyJson = null
    } else {
      console.log(`[generate_order] story_json stored for ${id}`)
    }
  } catch (err) {
    console.warn(`[generate_order] story generation failed (non-fatal): ${err.message}`)
    storyJson = null
  }

  // 4. Generate image prompts
  let promptData = null
  try {
    const orderForPrompts = { ...order, story_json: storyJson }
    promptData = await generateStructuredPrompts(orderForPrompts)
  } catch (err) {
    console.warn('[generate_order] prompt generation failed (non-fatal):', err.message)
  }

  // 5. Generate all images in parallel
  let imageResult = null
  if (promptData?.cover_prompt && promptData?.page_prompts?.length) {
    const jobs = [
      { label: 'cover',  storagePath: `${id}/cover.jpg`,  prompt: promptData.cover_prompt },
      ...promptData.page_prompts.map(p => ({
        label:       `page-${p.page_number}`,
        storagePath: `${id}/page-${p.page_number}.jpg`,
        prompt:      p.prompt,
      })),
    ]

    console.log(`[generate_order] generating ${jobs.length} images in parallel`)
    const results = await Promise.all(
      jobs.map(j => generateAndStoreImage(j.label, j.storagePath, j.prompt, supabaseUrl, serviceKey))
    )

    const coverResult  = results.find(r => r.label === 'cover')
    const pageResults  = results
      .filter(r => r.label.startsWith('page-'))
      .sort((a, b) => parseInt(a.label.replace('page-', '')) - parseInt(b.label.replace('page-', '')))
    const failed          = results.filter(r => r.error).map(r => r.label)
    const total_generated = results.filter(r => r.url).length

    const page_image_map = {}
    pageResults.forEach(r => {
      page_image_map[parseInt(r.label.replace('page-', ''), 10)] = r.url
    })

    imageResult = {
      order_id: id,
      cover:    coverResult?.url ?? null,
      pages:    pageResults.map(r => r.url),
      page_image_map,
      failed,
      total_generated,
      total_expected: jobs.length,
      complete: total_generated === jobs.length,
    }
    console.log(`[generate_order] images: ${total_generated}/${jobs.length}${failed.length ? ' | failed: ' + failed.join(', ') : ''}`)
  } else {
    console.warn('[generate_order] no prompt data — skipping image generation')
  }

  // 6. Generate PDF
  let pdfUrl = null
  try {
    const orderForPdf = { ...order, story_json: storyJson }
    pdfUrl = await buildAndUploadPDF(id, orderForPdf, supabaseUrl, anonKey, serviceKey)
  } catch (err) {
    console.warn('[generate_order] PDF generation failed (non-fatal):', err.message)
  }

  // 7. Mark as complete (non-fatal — work is already done even if this fails)
  try {
    await supabasePatch(supabaseUrl, anonKey, id, { status: 'complete' })
  } catch (err) {
    console.error('[generate_order] status=complete PATCH threw (non-fatal):', err.message)
  }

  const host     = req.headers['x-forwarded-host'] || req.headers.host || 'frontend-eight-sage-42.vercel.app'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const bookUrl  = `${protocol}://${host}/api/main?action=book&id=${id}`

  console.log('[generate_order] complete, book url:', bookUrl)

  return res.status(200).json({
    order_id:    id,
    status:      'complete',
    pdf_url:     pdfUrl ?? bookUrl,
    book_url:    bookUrl,
    images:      imageResult ?? null,
    story_title: storyJson?.title ?? null,
    story_dna:   storyJson?.dna   ?? null,
  })
}

// ── POST confirm_order ────────────────────────────────────────────────────────
async function handleConfirmOrder(body, res, supabaseUrl, anonKey) {
  const { id, parent_name, phone, city, address } = body
  if (!id) return res.status(400).json({ detail: 'Missing id' })

  // Save shipping info
  const patch = await supabasePatch(supabaseUrl, anonKey, id, {
    parent_name: parent_name || null,
    phone:       phone       || null,
    city:        city        || null,
    address:     address     || null,
  })

  if (!patch.ok) {
    const t = await patch.text()
    console.error('[confirm_order] PATCH error:', patch.status, t)
    return res.status(500).json({ detail: 'Could not save shipping info' })
  }

  console.log('[confirm_order] shipping info saved for order', id)

  // Send emails (both non-fatal)
  try {
    const custResult = await sendCustomerEmail(id, supabaseUrl, anonKey)
    console.log('[confirm_order] customer email:', JSON.stringify(custResult))
  } catch (err) {
    console.warn('[confirm_order] customer email failed (non-fatal):', err.message)
  }

  try {
    const adminResult = await sendAdminEmail(id, supabaseUrl, anonKey)
    console.log('[confirm_order] admin email:', JSON.stringify(adminResult))
  } catch (err) {
    console.warn('[confirm_order] admin email failed (non-fatal):', err.message)
  }

  return res.status(200).json({ confirmed: true, order_id: id })
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const SUPABASE_URL = process.env.SUPABASE_URL
  const ANON_KEY     = process.env.SUPABASE_ANON_KEY
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY || ANON_KEY

  if (!SUPABASE_URL || !ANON_KEY) {
    return res.status(500).json({ detail: 'Missing Supabase env vars' })
  }

  try {
    // ── GET requests ───────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const action = req.query.action
      const id     = req.query.id

      if (action === 'book')      return await handleBook(req, res, id, SUPABASE_URL, ANON_KEY)
      if (action === 'get_order') return await handleGetOrder(req, res, id, SUPABASE_URL, ANON_KEY)

      return res.status(400).json({ detail: 'Unknown action. Use action=book or action=get_order' })
    }

    // ── POST requests ──────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const body   = req.body || {}
      const action = body.action

      if (action === 'create_order')   return await handleCreateOrder(body, res, SUPABASE_URL, ANON_KEY)
      if (action === 'generate_order') return await handleGenerateOrder(body, req, res, SUPABASE_URL, ANON_KEY, SERVICE_KEY)
      if (action === 'confirm_order')  return await handleConfirmOrder(body, res, SUPABASE_URL, ANON_KEY)

      return res.status(400).json({ detail: `Unknown action: ${action}` })
    }

    return res.status(405).json({ detail: 'Method not allowed' })

  } catch (err) {
    // Global safety net — no uncaught error should ever produce a raw Vercel 500
    console.error('[main] Unhandled error:', err.message, err.stack?.slice(0, 500))
    if (!res.headersSent) {
      return res.status(500).json({ detail: `Server error: ${err.message}` })
    }
  }
}
