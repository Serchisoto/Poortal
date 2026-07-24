'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  className?: string
}

export function SearchBar({ defaultValue = '', placeholder, className }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set('q', query.trim())
    }
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex items-center bg-background rounded-2xl shadow-xl border border-border/50 overflow-hidden h-12">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Buscar experiencias...'}
          className="h-full border-0 shadow-none bg-transparent pl-11 pr-24 text-sm focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1.5 rounded-xl text-xs font-semibold px-4 h-8"
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}
