/**
 * API client — connects to /api/main (consolidated serverless endpoint)
 */

const BASE = '/api/main'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function _handleResponse(res) {
  if (res.ok) return res.json()

  let detail = 'حدث خطأ، يرجى المحاولة مجدداً'
  try {
    const body = await res.json()
    if (body.detail) detail = String(body.detail)
  } catch (_) { /* ignore parse failure */ }

  throw new Error(detail)
}

// ---------------------------------------------------------------------------
// createOrder
//
// POST /api/main { action: "create_order", ...fields }
// Response 201: { order_id, status, created_at }
// ---------------------------------------------------------------------------

export async function createOrder(form) {
  // Build appearance object — only include fields the parent filled in
  const appearance = {}
  if (form.skinTone)  appearance.skin_tone  = form.skinTone
  if (form.hairColor) appearance.hair_color = form.hairColor
  if (form.hairType)  appearance.hair_type  = form.hairType
  if (form.eyeColor)  appearance.eye_color  = form.eyeColor

  const payload = {
    action:         'create_order',
    child_name:     form.childName.trim(),
    age_group:      form.ageGroup,
    gender:         form.gender,
    theme:          form.theme,
    customer_email: form.email.trim().toLowerCase(),
    style_preset:   'watercolor',
    appearance:     Object.keys(appearance).length > 0 ? appearance : null,
    parent_name:    form.parentName?.trim()  || null,
    phone:          form.phone?.trim()       || null,
    city:           form.city?.trim()        || null,
    address:        form.address?.trim()     || null,
  }

  const res = await fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })

  return _handleResponse(res)   // { order_id, status, created_at }
}

// ---------------------------------------------------------------------------
// generateOrder
//
// POST /api/main { action: "generate_order", id }
// Runs the full synchronous pipeline (story → illustrations → PDF).
// Typically takes 2–5 minutes.
// Response 200: { order_id, status, pdf_url, book_url, images, story_title }
// ---------------------------------------------------------------------------

export async function generateOrder(orderId) {
  const res = await fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ action: 'generate_order', id: orderId }),
  })

  return _handleResponse(res)
}

// ---------------------------------------------------------------------------
// confirmOrder
//
// POST /api/main { action: "confirm_order", id, parent_name, phone, city, address }
// Saves shipping info + triggers both notification emails.
// ---------------------------------------------------------------------------

export async function confirmOrder(orderId, { parentName, phone, city, address }) {
  const res = await fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      action:      'confirm_order',
      id:          orderId,
      parent_name: parentName?.trim() || null,
      phone:       phone?.trim()      || null,
      city:        city?.trim()       || null,
      address:     address?.trim()    || null,
    }),
  })
  return _handleResponse(res)
}

// ---------------------------------------------------------------------------
// getOrder
//
// GET /api/main?action=get_order&id=<id>
// Response 200: full order record
// ---------------------------------------------------------------------------

export async function getOrder(orderId) {
  const res = await fetch(`${BASE}?action=get_order&id=${orderId}`)
  return _handleResponse(res)
}
