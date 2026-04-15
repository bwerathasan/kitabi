/**
 * Email sending helpers — customer confirmation + admin/printer notification.
 * Used by the consolidated /api/main endpoint (confirm_order action).
 */

import { Resend } from 'resend'

// ---------------------------------------------------------------------------
// HTML builders
// ---------------------------------------------------------------------------

function buildCustomerHtml(parentName, childName) {
  const greeting = parentName ? `مرحبًا ${parentName}،` : 'مرحبًا،'

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>تم استلام طلبك</title>
</head>
<body style="margin:0;padding:0;background:#faf5ef;font-family:Arial,Helvetica,sans-serif;direction:rtl;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf5ef;padding:32px 16px 48px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">

          <!-- Brand -->
          <tr>
            <td align="center" style="padding:0 0 18px;">
              <p style="margin:0;font-size:26px;font-weight:900;color:#c97d3a;letter-spacing:-.02em;">كِتابي</p>
              <p style="margin:5px 0 0;font-size:12px;color:#8a7060;">قصتك، طفلك، بطله هو</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #ede8e0;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Orange header -->
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#c97d3a 0%,#e8a45a 100%);padding:28px 24px 26px;">
                    <p style="margin:0 0 8px;font-size:34px;line-height:1;">&#x1F4DA;</p>
                    <h1 style="margin:0;font-size:20px;font-weight:900;color:#ffffff;line-height:1.3;">تم استلام طلبك بنجاح</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:26px 28px 6px;text-align:right;">
                    <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#2d2416;line-height:1.7;">${greeting}</p>
                    <p style="margin:0 0 12px;font-size:15px;color:#3d3020;line-height:1.85;">
                      تم استلام طلبك بنجاح وبدأنا تجهيز كتاب طفلك
                      <strong style="color:#c97d3a;">${childName}</strong>.
                    </p>
                    <p style="margin:0 0 20px;font-size:15px;color:#3d3020;line-height:1.85;">
                      سيتم تنفيذ الطلب وإرساله خلال <strong>48&ndash;72 ساعة</strong> كحد أقصى.
                    </p>
                  </td>
                </tr>

                <!-- Soft bordered box -->
                <tr>
                  <td style="padding:0 28px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#fff8f2;border:1.5px solid #f0dcc8;border-radius:10px;padding:15px 18px;text-align:right;">
                          <p style="margin:0;font-size:14px;color:#6b5040;line-height:1.75;">
                            سنتواصل معك عند شحن الطلب<br>وإرسال رقم التتبع.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Thank-you -->
                <tr>
                  <td style="padding:4px 28px 26px;text-align:right;">
                    <p style="margin:0;font-size:15px;font-weight:700;color:#3d3020;">شكرًا لثقتك بنا &#x1F90D;</p>
                  </td>
                </tr>

                <!-- Card footer -->
                <tr>
                  <td style="background:#faf7f4;padding:14px 28px;border-top:1px solid #ede8e0;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#a09080;">كِتابي &mdash; كتاب مخصص لطفلك</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
}

function buildPrinterHtml(order, pdfUrl) {
  function row(label, value) {
    if (!value) return ''
    return `<tr>
      <td style="padding:10px 16px;background:#f7f7f7;font-weight:700;color:#333333;white-space:nowrap;border-bottom:1px solid #e0e0e0;font-size:13px;">${label}</td>
      <td style="padding:10px 16px;color:#111111;border-bottom:1px solid #e0e0e0;font-size:14px;">${value}</td>
    </tr>`
  }

  const pdfRow = pdfUrl
    ? `<tr>
        <td style="padding:10px 16px;background:#f7f7f7;font-weight:700;color:#333333;white-space:nowrap;border-bottom:1px solid #e0e0e0;font-size:13px;">Link</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e0e0e0;font-size:14px;word-break:break-all;">
          <a href="${pdfUrl}" style="color:#0066cc;text-decoration:underline;">${pdfUrl}</a>
        </td>
      </tr>`
    : `<tr>
        <td style="padding:10px 16px;background:#f7f7f7;font-weight:700;color:#333333;white-space:nowrap;border-bottom:1px solid #e0e0e0;font-size:13px;">Link</td>
        <td style="padding:10px 16px;color:#cc0000;border-bottom:1px solid #e0e0e0;font-size:14px;">Not yet generated</td>
      </tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Book Order</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e0e0e0;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:24px 32px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">New Book Order</p>
            </td>
          </tr>

          <!-- Section 1: Customer Details -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0;font-size:11px;font-weight:700;color:#888888;letter-spacing:.08em;text-transform:uppercase;">Customer Details</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-collapse:collapse;">
                ${row('Parent Name', order.parent_name)}
                ${row('Child Name',  order.child_name)}
                ${row('Phone',       order.phone)}
                ${row('City',        order.city)}
                ${row('Address',     order.address)}
              </table>
            </td>
          </tr>

          <!-- Section 2: Order -->
          <tr>
            <td style="padding:0 32px 8px;border-top:1px solid #e0e0e0;">
              <p style="margin:16px 0 0;font-size:11px;font-weight:700;color:#888888;letter-spacing:.08em;text-transform:uppercase;">Order</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-collapse:collapse;">
                ${row('Book Type', 'Personalized Story Book')}
                ${row('Price',     '&#8362;199 (Delivery Included)')}
              </table>
            </td>
          </tr>

          <!-- Section 3: PDF -->
          <tr>
            <td style="padding:0 32px 8px;border-top:1px solid #e0e0e0;">
              <p style="margin:16px 0 0;font-size:11px;font-weight:700;color:#888888;letter-spacing:.08em;text-transform:uppercase;">PDF</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-collapse:collapse;">
                ${pdfRow}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f5;padding:16px 32px;border-top:1px solid #e0e0e0;">
              <p style="margin:0;font-size:12px;color:#888888;">Qisah — Automated Print Queue</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Exported send functions
// ---------------------------------------------------------------------------

/**
 * Send Arabic confirmation email to the customer.
 * Non-fatal: logs and returns a result object, never throws.
 */
export async function sendCustomerEmail(orderId, supabaseUrl, anonKey) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const FROM_EMAIL     = process.env.RESEND_FROM || 'onboarding@resend.dev'

  if (!RESEND_API_KEY) {
    console.warn('[notify-customer] RESEND_API_KEY not set — skipping')
    return { skipped: true, reason: 'no RESEND_API_KEY' }
  }

  const orderRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=id,child_name,parent_name,customer_email`,
    { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } }
  )
  if (!orderRes.ok) {
    console.error('[notify-customer] could not fetch order', orderId)
    return { sent: false, error: 'could not fetch order' }
  }
  const orders = await orderRes.json()
  if (!orders.length) return { sent: false, error: 'order not found' }

  const { child_name, parent_name, customer_email } = orders[0]
  if (!customer_email) {
    console.warn('[notify-customer] no customer_email on order', orderId)
    return { skipped: true, reason: 'no customer_email' }
  }

  const resend = new Resend(RESEND_API_KEY)
  let result
  try {
    result = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      customer_email,
      subject: 'تم استلام طلبك بنجاح — كتابي',
      html:    buildCustomerHtml(parent_name, child_name),
    })
  } catch (err) {
    console.error('[notify-customer] network error:', err.message)
    return { sent: false, error: err.message }
  }

  if (result.error) {
    console.error('[notify-customer] Resend API error:', result.error.message)
    return { sent: false, error: result.error.message, resend_error: result.error }
  }

  console.log('[notify-customer] sent to', customer_email, '| id:', result.data?.id)
  return { sent: true, email_id: result.data?.id }
}

/**
 * Send English print-order email to the admin/printer.
 * Non-fatal: logs and returns a result object, never throws.
 */
export async function sendAdminEmail(orderId, supabaseUrl, anonKey) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const PRINTER_EMAIL  = process.env.PRINTER_EMAIL
  const FROM_EMAIL     = process.env.RESEND_FROM || 'onboarding@resend.dev'

  if (!RESEND_API_KEY) {
    console.warn('[notify-admin] RESEND_API_KEY not set — skipping')
    return { skipped: true, reason: 'no RESEND_API_KEY' }
  }
  if (!PRINTER_EMAIL) {
    console.warn('[notify-admin] PRINTER_EMAIL not set — skipping')
    return { skipped: true, reason: 'no PRINTER_EMAIL' }
  }

  const orderRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=id,child_name,parent_name,phone,city,address,pdf_url`,
    { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } }
  )
  if (!orderRes.ok) {
    console.error('[notify-admin] could not fetch order', orderId)
    return { sent: false, error: 'could not fetch order' }
  }
  const orders = await orderRes.json()
  if (!orders.length) return { sent: false, error: 'order not found' }

  const order   = orders[0]
  const pdfUrl  = order.pdf_url || null
  const subject = `New Book Order — ${order.child_name}${order.parent_name ? ' / ' + order.parent_name : ''} [${orderId.slice(0, 8)}]`

  console.log('[notify-admin] sending to', PRINTER_EMAIL)

  const resend = new Resend(RESEND_API_KEY)
  let result
  try {
    result = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      PRINTER_EMAIL,
      subject,
      html:    buildPrinterHtml(order, pdfUrl),
    })
  } catch (err) {
    console.error('[notify-admin] network error:', err.message)
    return { sent: false, error: err.message }
  }

  if (result.error) {
    console.error('[notify-admin] Resend API error:', result.error.message)
    return { sent: false, error: result.error.message, resend_error: result.error }
  }

  console.log('[notify-admin] sent | id:', result.data?.id)
  return { sent: true, email_id: result.data?.id }
}
