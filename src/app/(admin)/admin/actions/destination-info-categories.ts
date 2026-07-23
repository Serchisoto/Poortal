'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function createInfoCategory(data: {
    destination_id: string
    title: string
    slug: string
    icon: string | null
    color: string | null
    subtitle: string | null
}) {
    const last = await prisma.destination_info_categories.findFirst({
        where: { destination_id: data.destination_id },
        orderBy: { sort_order: 'desc' },
        select: { sort_order: true },
    })
    const maxOrder = last?.sort_order ?? 0

    await prisma.destination_info_categories.create({
        data: { ...data, sort_order: maxOrder + 1 },
    })

    revalidatePath(`/admin/destinations/${data.destination_id}`)
    return { success: true }
}

export async function updateInfoCategory(
    id: string,
    data: {
        title?: string
        slug?: string
        icon?: string | null
        color?: string | null
        subtitle?: string | null
    },
    destinationId: string
) {
    await prisma.destination_info_categories.update({
        where: { id },
        data,
    })

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function deleteInfoCategory(id: string, destinationId: string) {
    await prisma.destination_info_categories.delete({ where: { id } })

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function updateInfoCategoriesOrder(orderedIds: string[], destinationId: string) {
    await Promise.all(
        orderedIds.map((id, index) =>
            prisma.destination_info_categories.update({
                where: { id },
                data: { sort_order: index },
            })
        )
    )

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}
