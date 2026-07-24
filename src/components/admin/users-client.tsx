'use client'

import { useTransition, useState } from 'react'
import { changeUserRoleAction } from '@/actions/change-user-role'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Loader2, User, Phone, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'

type Profile = {
  id: string
  full_name: string | null
  email: string
  role: string
  phone: string | null
  created_at: Date
}

const ROLES = [
  { value: 'tourist', label: 'Turista' },
  { value: 'provider', label: 'Proveedor' },
  { value: 'admin', label: 'Admin' },
] as const

const ROLE_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  tourist: 'secondary',
  provider: 'default',
  admin: 'destructive',
}

function RoleSelector({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition()
  const [currentRole, setCurrentRole] = useState(profile.role)

  function handleSelect(newRole: 'tourist' | 'provider' | 'admin') {
    if (newRole === currentRole) return
    startTransition(async () => {
      const result = await changeUserRoleAction(profile.id, newRole)
      if (result.success) {
        setCurrentRole(newRole)
        toast.success(result.success)
      } else {
        toast.error(result.error)
      }
    })
  }

  const label = ROLES.find((r) => r.value === currentRole)?.label ?? currentRole

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Badge variant={ROLE_BADGE_VARIANT[currentRole] ?? 'outline'} className="text-xs">
                {label}
              </Badge>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ROLES.map((r) => (
          <DropdownMenuItem
            key={r.value}
            onSelect={() => handleSelect(r.value)}
            className={r.value === currentRole ? 'font-semibold text-primary' : ''}
          >
            {r.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UsersClient({ users }: { users: Profile[] }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center">
        <User className="h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">Sin usuarios registrados</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-start gap-3 rounded-2xl border bg-card p-4"
        >
          {/* Avatar initial */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {user.full_name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold leading-tight">
                {user.full_name ?? 'Sin nombre'}
              </p>
              <RoleSelector profile={user} />
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {user.phone && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {new Date(user.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
