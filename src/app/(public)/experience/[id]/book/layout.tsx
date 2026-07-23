export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] -mb-16 overflow-hidden">
      {children}
    </div>
  )
}
