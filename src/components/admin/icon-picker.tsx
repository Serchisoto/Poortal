'use client'

import * as React from 'react'
import {
    ChevronsUpDown,
    Search,
} from 'lucide-react'
import * as Icons from 'lucide-react'
import type { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

// Extract all valid icon names from lucide-react (components are PascalCase)
const iconList = Object.keys(Icons).filter(
    (key) => /^[A-Z]/.test(key) && key !== 'LucideIcon' && key !== 'Icon' && typeof (Icons as Record<string, unknown>)[key] === 'object'
)

interface IconPickerProps {
    value?: string
    onChange: (value: string) => void
    name?: string
    disabled?: boolean
}

export function IconPicker({ value, onChange, name, disabled }: IconPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')

    const iconDict = Icons as unknown as Record<string, ComponentType<Icons.LucideProps>>
    // Find the selected icon component safely (handle possible lowercase values from DB)
    let SelectedIcon = value && iconDict[value] ? iconDict[value] : null
    if (!SelectedIcon && value) {
        const capitalized = value.charAt(0).toUpperCase() + value.slice(1)
        SelectedIcon = iconDict[capitalized] ? iconDict[capitalized] : null
    }

    const filteredIcons = React.useMemo(() => {
        if (!search) return iconList.slice(0, 50)
        const lowerSearch = search.toLowerCase()
        return iconList.filter(icon => icon.toLowerCase().includes(lowerSearch)).slice(0, 50)
    }, [search])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                    disabled={disabled}
                >
                    <div className="flex items-center gap-2 truncate">
                        {SelectedIcon ? <SelectedIcon className="h-4 w-4 shrink-0" /> : <Search className="h-4 w-4 shrink-0 opacity-50" />}
                        <span className="truncate">{value || 'Seleccionar ícono...'}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Buscar ícono..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList className="max-h-[250px] overflow-y-auto">
                        <CommandEmpty>No se encontró ningún ícono.</CommandEmpty>
                        <CommandGroup>
                            <div className="grid grid-cols-6 gap-1 p-1">
                                {filteredIcons.map((iconName) => {
                                    const IconComponent = (Icons as unknown as Record<string, ComponentType<Icons.LucideProps>>)[iconName]
                                    if (!IconComponent) return null

                                    return (
                                        <CommandItem
                                            key={iconName}
                                            value={iconName}
                                            onSelect={(currentValue: string) => {
                                                // find original case since CommandItem lowercases value
                                                const originalName = iconList.find(n => n.toLowerCase() === currentValue) || currentValue
                                                onChange(originalName === value ? '' : originalName)
                                                setOpen(false)
                                            }}
                                            className="flex aspect-square items-center justify-center rounded-md p-2 hover:bg-muted"
                                            title={iconName}
                                        >
                                            <IconComponent className="h-5 w-5" />
                                        </CommandItem>
                                    )
                                })}
                            </div>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
            {/* Hidden input to ensure native form submission works */}
            {name && <input type="hidden" name={name} value={value || ''} />}
        </Popover>
    )
}
