'use client'

import QRCode from 'react-qr-code'

export function QrCodeDisplay({ value }: { value: string }) {
  return (
    <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
      <QRCode value={value} size={200} />
    </div>
  )
}
