/**
 * PDF build + upload pipeline.
 * Extracted from api/orders/[id]/pdf.js for use by the consolidated /api/main endpoint.
 */

import PDFDocument       from 'pdfkit'
import { fileURLToPath } from 'url'
import { getStoryPages } from './storyPages.js'

// ---------------------------------------------------------------------------
// Layout constants — all values in points
// ---------------------------------------------------------------------------

const PAGE_W = 600
const PAGE_H = 600

const COVER_IMG_H    = 450
const COVER_STRIP_Y  = 454
const COVER_STRIP_H  = PAGE_H - COVER_STRIP_Y   // 146pt

const TEXT_TOP   = 24
const TEXT_BOTTOM = 225
const SEP_Y      = 234
const IMG_TOP    = 242
const IMG_BOTTOM = 594

const MARGIN = 26

const FONT_PATH = fileURLToPath(new URL('../fonts/cairo.woff', import.meta.url))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

async function uploadToSupabase(buffer, storagePath, supabaseUrl, serviceKey, contentType) {
  const res = await fetch(`${supabaseUrl}/storage/v1/object/book-images/${storagePath}`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type':  contentType,
      'x-upsert':      'true',
    },
    body: buffer,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Upload failed (${storagePath}): ${res.status} ${err}`)
  }
  return `${supabaseUrl}/storage/v1/object/public/book-images/${storagePath}`
}

// ---------------------------------------------------------------------------
// PDF builder
// ---------------------------------------------------------------------------

async function buildPDF(childName, theme, gender, baseImgUrl, orderId, storyJson = null) {
  const { title, pages } = getStoryPages(theme, childName, gender, orderId, storyJson)

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size:          [PAGE_W, PAGE_H],
      margin:        0,
      autoFirstPage: false,
      info: {
        Title:   `${childName} ${title}`,
        Subject: 'كتاب مصوّر مخصص — كِتابي',
      },
    })

    doc.registerFont('Cairo', FONT_PATH)

    const chunks = []
    doc.on('data',  c => chunks.push(c))
    doc.on('end',   () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    ;(async () => {
      // ── COVER PAGE ────────────────────────────────────────────────────────
      doc.addPage({ size: [PAGE_W, PAGE_H], margin: 0 })

      try {
        const coverBuf = await fetchBuffer(`${baseImgUrl}/cover.jpg`)
        doc.image(coverBuf, 0, 0, {
          width:  PAGE_W,
          height: COVER_IMG_H,
          cover:  [PAGE_W, COVER_IMG_H],
        })
      } catch {
        doc.rect(0, 0, PAGE_W, COVER_IMG_H).fill('#D4956A')
      }

      doc.rect(0, COVER_STRIP_Y, PAGE_W, COVER_STRIP_H).fill('#2D1A08')

      doc.font('Cairo').fontSize(28).fillColor('#FFFFFF')
      doc.text(childName, MARGIN, COVER_STRIP_Y + 18, {
        width:    PAGE_W - MARGIN * 2,
        height:   40,
        align:    'right',
        features: ['rtla', 'rtlm'],
      })

      doc.font('Cairo').fontSize(14).fillColor('#D4956A')
      doc.text(title, MARGIN, COVER_STRIP_Y + 62, {
        width:    PAGE_W - MARGIN * 2,
        height:   28,
        align:    'right',
        features: ['rtla', 'rtlm'],
      })

      doc.font('Cairo').fontSize(9).fillColor('#6B4020')
      doc.text('كِتابي', MARGIN, COVER_STRIP_Y + 116, {
        width: PAGE_W - MARGIN * 2,
        align: 'right',
        features: ['rtla', 'rtlm'],
      })

      // ── STORY PAGES 1–16 ──────────────────────────────────────────────────
      for (let i = 0; i < 16; i++) {
        const pageNum  = i + 1
        const pageText = pages[i] || ''

        doc.addPage({ size: [PAGE_W, PAGE_H], margin: 0 })
        doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FDFBF7')

        doc.font('Cairo').fontSize(9).fillColor('#B09070')
        doc.text(String(pageNum), 0, TEXT_TOP, {
          width: PAGE_W - MARGIN,
          align: 'right',
        })

        doc.font('Cairo').fontSize(13.5).fillColor('#1C1209').lineGap(5)
        doc.text(pageText, MARGIN, TEXT_TOP + 16, {
          width:    PAGE_W - MARGIN * 2,
          height:   TEXT_BOTTOM - TEXT_TOP - 20,
          align:    'right',
          features: ['rtla', 'rtlm'],
          ellipsis: true,
        })

        doc.moveTo(MARGIN, SEP_Y)
           .lineTo(PAGE_W - MARGIN, SEP_Y)
           .lineWidth(0.6)
           .stroke('#D4B896')

        const imgH = IMG_BOTTOM - IMG_TOP
        try {
          const imgBuf = await fetchBuffer(`${baseImgUrl}/page-${pageNum}.jpg`)
          doc.image(imgBuf, MARGIN, IMG_TOP, {
            width:  PAGE_W - MARGIN * 2,
            height: imgH,
            cover:  [PAGE_W - MARGIN * 2, imgH],
          })
        } catch {
          doc.rect(MARGIN, IMG_TOP, PAGE_W - MARGIN * 2, imgH).fill('#F0E8DC')
          doc.font('Cairo').fontSize(11).fillColor('#B09070')
          doc.text('...', MARGIN, IMG_TOP + imgH / 2 - 8, {
            width: PAGE_W - MARGIN * 2,
            align: 'center',
          })
        }
      }

      doc.end()
    })().catch(reject)
  })
}

// ---------------------------------------------------------------------------
// Exported pipeline function
// ---------------------------------------------------------------------------

/**
 * Build a PDF and upload it to Supabase Storage.
 * Patches the order row with pdf_url on success.
 *
 * @param {string}      orderId
 * @param {{ child_name, theme, gender, story_json }} order
 * @param {string}      supabaseUrl
 * @param {string}      anonKey
 * @param {string}      serviceKey
 * @returns {Promise<string>}  public PDF URL
 */
export async function buildAndUploadPDF(orderId, order, supabaseUrl, anonKey, serviceKey) {
  const { child_name, theme, gender, story_json } = order
  const baseImgUrl = `${supabaseUrl}/storage/v1/object/public/book-images/${orderId}`

  console.log(`[pdf] building for order ${orderId} — ${child_name}, ${theme} (story_json: ${story_json ? 'yes' : 'fallback'})`)

  const pdfBuffer = await buildPDF(child_name, theme, gender, baseImgUrl, orderId, story_json || null)
  console.log(`[pdf] built — ${pdfBuffer.length} bytes`)

  const pdfUrl = await uploadToSupabase(
    pdfBuffer,
    `${orderId}/book.pdf`,
    supabaseUrl,
    serviceKey,
    'application/pdf'
  )
  console.log(`[pdf] uploaded → ${pdfUrl}`)

  // Patch order with pdf_url (non-fatal if it fails)
  try {
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method:  'PATCH',
      headers: {
        'apikey':        anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({ pdf_url: pdfUrl }),
    })
  } catch (err) {
    console.warn('[pdf] pdf_url patch failed (non-fatal):', err.message)
  }

  return pdfUrl
}
