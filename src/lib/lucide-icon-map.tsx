import {
  MapPin,
  type LucideProps,
} from 'lucide-react'
import * as Icons from 'lucide-react'
import type { ComponentType } from 'react'

interface DynamicIconProps extends Omit<LucideProps, 'name'> {
  name: string | null
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  let SelectedIcon: ComponentType<LucideProps> = MapPin

  if (name) {
    const iconDict = Icons as unknown as Record<string, ComponentType<LucideProps>>
    // Find the selected icon safely (handle possible lowercase values from DB)
    if (iconDict[name]) {
      SelectedIcon = iconDict[name]
    } else {
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
      if (iconDict[capitalized]) {
        SelectedIcon = iconDict[capitalized]
      }
    }
  }

  return <SelectedIcon {...props} />
}
