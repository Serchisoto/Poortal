"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  experienceId: string
  availabilityId: string | null
  title: string
  shortDescription: string | null
  coverImageUrl: string | null
  providerName: string
  providerId: string
  quantity: number
  unitPrice: number
  currency: string
  serviceDate: string
  serviceTime: string | null
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (experienceId: string, serviceDate: string) => void
  updateQuantity: (experienceId: string, serviceDate: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if item already exists for same experience + date
          const existingIndex = state.items.findIndex(
            (i) =>
              i.experienceId === item.experienceId &&
              i.serviceDate === item.serviceDate
          )

          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            }
            return { items: updatedItems }
          }

          return { items: [...state.items, item] }
        })
      },

      removeItem: (experienceId, serviceDate) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.experienceId === experienceId && i.serviceDate === serviceDate)
          ),
        }))
      },

      updateQuantity: (experienceId, serviceDate, quantity) => {
        if (quantity <= 0) {
          get().removeItem(experienceId, serviceDate)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.experienceId === experienceId && i.serviceDate === serviceDate
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'poortal-cart',
    }
  )
)
