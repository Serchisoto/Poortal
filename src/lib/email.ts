import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL || 'Poortal <onboarding@resend.dev>'

export interface BookingConfirmationData {
  toEmail: string
  toName: string | null
  bookingNumber: string
  experienceTitle: string
  serviceDate: string
  serviceTime: string | null
  people: number
  totalAmount: number
  currency: string
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const {
    toEmail,
    toName,
    bookingNumber,
    experienceTitle,
    serviceDate,
    serviceTime,
    people,
    totalAmount,
    currency,
  } = data

  const formattedDate = formatDate(serviceDate)
  const formattedTime = serviceTime
    ? new Date(serviceTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null
  const formattedTotal = formatCurrency(totalAmount, currency)
  const greeting = toName ? `Hola, ${toName}!` : 'Hola!'

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmacion de reserva - Poortal</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:#0f766e;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Poortal</p>
              <p style="margin:8px 0 0;font-size:13px;color:#99f6e4;letter-spacing:0.5px;text-transform:uppercase;">Reserva confirmada</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;font-size:15px;color:#334155;">${greeting} Tu reserva esta lista.</p>

              <!-- Experience Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:0.6px;">Experiencia</p>
                    <p style="margin:0 0 16px;font-size:17px;font-weight:700;color:#0f172a;">${experienceTitle}</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;">
                          <span style="font-size:12px;font-weight:600;color:#475569;">Fecha:</span>
                          <span style="font-size:12px;color:#64748b;margin-left:8px;">${formattedDate}</span>
                        </td>
                      </tr>
                      ${formattedTime ? `
                      <tr>
                        <td style="padding:4px 0;">
                          <span style="font-size:12px;font-weight:600;color:#475569;">Hora:</span>
                          <span style="font-size:12px;color:#64748b;margin-left:8px;">${formattedTime}</span>
                        </td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:4px 0;">
                          <span style="font-size:12px;font-weight:600;color:#475569;">Personas:</span>
                          <span style="font-size:12px;color:#64748b;margin-left:8px;">${people}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:8px 0;border-top:1px dashed #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;font-weight:700;color:#0f172a;">Total pagado</td>
                        <td align="right" style="font-size:14px;font-weight:700;color:#0f766e;">${formattedTotal} ${currency}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Booking number -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;">Numero de reserva</p>
                    <p style="margin:0;font-size:15px;font-weight:800;color:#0f172a;letter-spacing:1px;">${bookingNumber}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                Guarda este correo como comprobante. Presentalo al proveedor el dia de tu experiencia. Si tienes dudas, respondenos a este correo.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">Poortal &bull; Tu portal de experiencias en Mexico</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: `Reserva confirmada: ${experienceTitle} — ${bookingNumber}`,
      html,
    })
    return { ok: true }
  } catch (err) {
    console.error('[email] sendBookingConfirmation failed:', err)
    return { ok: false }
  }
}
