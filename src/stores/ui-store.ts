"use client"

import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}))
