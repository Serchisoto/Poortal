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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Buscar experiencias...'}
          className="pl-10 pr-24"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}
