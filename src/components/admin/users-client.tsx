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
import { ChevronDown, Loader2 } from 'lucide-react'
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
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 font-medium"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
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
      <DropdownMenuContent align="start">
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
  return (
    <div className="rounded-md border">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_1.5fr_auto_1fr_auto] gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
        <div>Nombre</div>
        <div>Email</div>
        <div>Rol</div>
        <div>Telefono</div>
        <div>Registro</div>
      </div>

      {users.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Sin usuarios registrados
        </div>
      ) : (
        <div className="divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1.5fr_auto_1fr_auto] gap-4 px-4 py-3 text-sm items-center"
            >
              <div className="truncate font-medium">{user.full_name ?? '—'}</div>
              <div className="truncate text-muted-foreground">{user.email}</div>
              <div>
                <RoleSelector profile={user} />
              </div>
              <div className="text-muted-foreground">{user.phone ?? '—'}</div>
              <div className="text-muted-foreground whitespace-nowrap">
                {new Date(user.created_at).toLocaleDateString('es-MX')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
