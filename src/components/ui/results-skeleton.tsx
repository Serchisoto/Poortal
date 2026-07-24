export function ResultsGridSkeleton({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
        <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
        <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
          <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">{title}</span>
        </div>
      </div>

      <div className="container mx-auto max-w-md px-6 mt-2">
        {/* Filter row */}
        <div className="flex gap-3 mb-6">
          <div className="h-8 w-28 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-8 w-20 rounded-full bg-slate-100 animate-pulse" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-xl bg-slate-100 animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ResultsListSkeleton({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
        <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
        <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
          <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">{title}</span>
        </div>
      </div>

      <div className="container mx-auto max-w-md px-6 mt-2 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-slate-100 animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
