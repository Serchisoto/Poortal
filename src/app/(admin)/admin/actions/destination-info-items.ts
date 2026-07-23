'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function createInfoItem(
    data: {
        category_id: string
        title: string
        description: string[]
        author: string | null
        date: string | null
        images_count: number | null
        actions: Record<string, boolean>
    },
    destinationId: string
) {
    const last = await prisma.destination_info_items.findFirst({
        where: { category_id: data.category_id },
        orderBy: { sort_order: 'desc' },
        select: { sort_order: true },
    })
    const maxOrder = last?.sort_order ?? 0

    await prisma.destination_info_items.create({
        data: { ...data, sort_order: maxOrder + 1 },
    })

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function updateInfoItem(
    id: string,
    data: {
        title?: string
        description?: string[]
        author?: string | null
        date?: string | null
        images_count?: number | null
        actions?: Record<string, boolean>
    },
    destinationId: string
) {
    await prisma.destination_info_items.update({
        where: { id },
        data,
    })

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function deleteInfoItem(id: string, destinationId: string) {
    await prisma.destination_info_items.delete({ where: { id } })

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function updateInfoItemsOrder(orderedIds: string[], destinationId: string) {
    await Promise.all(
        orderedIds.map((id, index) =>
            prisma.destination_info_items.update({
                where: { id },
                data: { sort_order: index },
            })
        )
    )

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}
