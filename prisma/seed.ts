/**
 * Seed: crea datos de prueba
 *
 * Crea:
 *   - 1 destino (Tulum)
 *   - 4 categorías + subcategorías
 *   - 1 usuario admin
 *   - 1 usuario proveedor con perfil, experiencias y disponibilidad
 *
 * Uso:
 *   npm run db:seed
 */

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL!.replace('sslmode=require', 'sslmode=verify-full')
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// ─── ids fijos (para reproducibilidad) ────────────────────────────────────────

const IDS = {
  destination: 'a1b2c3d4-0001-0001-0001-000000000001',

  catAventura:    'ca000000-0000-0000-0000-000000000001',
  catGastronomia: 'ca000000-0000-0000-0000-000000000002',
  catCultura:     'ca000000-0000-0000-0000-000000000003',
  catBienestar:   'ca000000-0000-0000-0000-000000000004',

  subAcuatico:    'ab000000-0000-0000-0000-000000000001',
  subTrekking:    'ab000000-0000-0000-0000-000000000002',
  subRestaurantes:'ab000000-0000-0000-0000-000000000003',
  subCocina:      'ab000000-0000-0000-0000-000000000004',
  subArqueologia: 'ab000000-0000-0000-0000-000000000005',
  subArte:        'ab000000-0000-0000-0000-000000000006',
  subYoga:        'ab000000-0000-0000-0000-000000000007',
  subSpa:         'ab000000-0000-0000-0000-000000000008',

  userAdmin:    'adm00000-0000-0000-0000-000000000001',
  userProvider: 'b0000000-0000-0000-0000-000000000001',

  profileAdmin:    'fa000000-0000-0000-0000-000000000001',
  profileProvider: 'fa000000-0000-0000-0000-000000000002',

  providerProfile: 'ff000000-0000-0000-0000-000000000001',

  exp1: 'e0000000-0000-0000-0000-000000000001',
  exp2: 'e0000000-0000-0000-0000-000000000002',
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...\n')

  await seedDestination()
  await seedCategories()
  await seedAdminUser()
  await seedProviderUser()

  console.log('\n✅ Seed completado')
  console.log('\n📋 Credenciales:')
  console.log('  Admin:    admin@poortal.dev  /  Admin1234!')
  console.log('  Provider: provider@poortal.dev  /  Provider1234!')
}

// ─── destino ──────────────────────────────────────────────────────────────────

async function seedDestination() {
  console.log('📍 Creando destino...')
  await prisma.destinations.upsert({
    where: { id: IDS.destination },
    create: {
      id: IDS.destination,
      name: 'Tulum',
      slug: 'tulum',
      description:
        'Paraíso caribeño conocido por sus ruinas mayas, cenotes cristalinos y playas de arena blanca.',
      country: 'México',
      state: 'Quintana Roo',
      city: 'Tulum',
      latitude: 20.2114,
      longitude: -87.4654,
      cover_image_url: 'https://images.unsplash.com/photo-1682686578023-dc680e7a3aeb?w=1200',
      is_active: true,
    },
    update: {},
  })
  console.log('  ✓ Tulum')
}

// ─── categorías ───────────────────────────────────────────────────────────────

async function seedCategories() {
  console.log('🏷️  Creando categorías...')

  const categories = [
    { id: IDS.catAventura,    name: 'Aventura',     slug: 'aventura',     icon: '🏄', sort_order: 1 },
    { id: IDS.catGastronomia, name: 'Gastronomía',  slug: 'gastronomia',  icon: '🍽️', sort_order: 2 },
    { id: IDS.catCultura,     name: 'Cultura',      slug: 'cultura',      icon: '🏛️', sort_order: 3 },
    { id: IDS.catBienestar,   name: 'Bienestar',    slug: 'bienestar',    icon: '🧘', sort_order: 4 },
  ]

  for (const cat of categories) {
    await prisma.categories.upsert({
      where: { slug: cat.slug },
      create: { ...cat, is_active: true },
      update: {},
    })
  }

  // Re-leer IDs reales (pueden diferir si ya existían)
  const dbCats = await prisma.categories.findMany({
    where: { slug: { in: categories.map((c) => c.slug) } },
    select: { id: true, slug: true },
  })
  const catIdBySlug = Object.fromEntries(dbCats.map((c) => [c.slug, c.id]))
  IDS.catAventura    = catIdBySlug['aventura']    ?? IDS.catAventura
  IDS.catGastronomia = catIdBySlug['gastronomia'] ?? IDS.catGastronomia
  IDS.catCultura     = catIdBySlug['cultura']     ?? IDS.catCultura
  IDS.catBienestar   = catIdBySlug['bienestar']   ?? IDS.catBienestar

  const subcategories = [
    { category_id: IDS.catAventura,    name: 'Acuático',         slug: 'acuatico',     sort_order: 1 },
    { category_id: IDS.catAventura,    name: 'Trekking',         slug: 'trekking',     sort_order: 2 },
    { category_id: IDS.catGastronomia, name: 'Restaurantes',     slug: 'restaurantes', sort_order: 1 },
    { category_id: IDS.catGastronomia, name: 'Clases de Cocina', slug: 'clases-cocina',sort_order: 2 },
    { category_id: IDS.catCultura,     name: 'Arqueología',      slug: 'arqueologia',  sort_order: 1 },
    { category_id: IDS.catCultura,     name: 'Arte Local',       slug: 'arte-local',   sort_order: 2 },
    { category_id: IDS.catBienestar,   name: 'Yoga',             slug: 'yoga',         sort_order: 1 },
    { category_id: IDS.catBienestar,   name: 'Spa & Masajes',    slug: 'spa-masajes',  sort_order: 2 },
  ]

  for (const sub of subcategories) {
    await prisma.subcategories.upsert({
      where: { slug: sub.slug },
      create: { ...sub, is_active: true },
      update: {},
    })
  }

  // Re-leer IDs de subcategorías
  const dbSubs = await prisma.subcategories.findMany({
    where: { slug: { in: ['acuatico', 'yoga'] } },
    select: { id: true, slug: true },
  })
  const subIdBySlug = Object.fromEntries(dbSubs.map((s) => [s.slug, s.id]))
  IDS.subAcuatico = subIdBySlug['acuatico'] ?? IDS.subAcuatico
  IDS.subYoga     = subIdBySlug['yoga']     ?? IDS.subYoga

  // Vincular destino con categorías
  for (const catId of Object.values(catIdBySlug)) {
    await prisma.destination_categories.upsert({
      where: {
        destination_id_category_id: {
          destination_id: IDS.destination,
          category_id: catId,
        },
      },
      create: { destination_id: IDS.destination, category_id: catId },
      update: {},
    })
  }

  console.log(`  ✓ ${categories.length} categorías, ${subcategories.length} subcategorías`)
}

// ─── admin ────────────────────────────────────────────────────────────────────

async function seedAdminUser() {
  console.log('👤 Creando usuario admin...')

  const password = await hashPassword('Admin1234!')

  await prisma.user.upsert({
    where: { id: IDS.userAdmin },
    create: {
      id: IDS.userAdmin,
      email: 'admin@poortal.dev',
      name: 'Admin Poortal',
      emailVerified: true,
      role: 'admin',
    },
    update: { role: 'admin' },
  })

  await prisma.account.upsert({
    where: { id: `credential_${IDS.userAdmin}` },
    create: {
      id: `credential_${IDS.userAdmin}`,
      accountId: 'admin@poortal.dev',
      providerId: 'credential',
      userId: IDS.userAdmin,
      password,
    },
    update: {},
  })

  await prisma.profiles.upsert({
    where: { id: IDS.profileAdmin },
    create: {
      id: IDS.profileAdmin,
      email: 'admin@poortal.dev',
      full_name: 'Admin Poortal',
      role: 'admin',
      preferred_language: 'es',
      user_id: IDS.userAdmin,
    },
    update: {},
  })

  console.log('  ✓ admin@poortal.dev')
}

// ─── provider ─────────────────────────────────────────────────────────────────

async function seedProviderUser() {
  console.log('🏪 Creando usuario proveedor...')

  const password = await hashPassword('Provider1234!')

  await prisma.user.upsert({
    where: { id: IDS.userProvider },
    create: {
      id: IDS.userProvider,
      email: 'provider@poortal.dev',
      name: 'Carlos Dive Tulum',
      emailVerified: true,
      role: 'provider',
    },
    update: { role: 'provider' },
  })

  await prisma.account.upsert({
    where: { id: `credential_${IDS.userProvider}` },
    create: {
      id: `credential_${IDS.userProvider}`,
      accountId: 'provider@poortal.dev',
      providerId: 'credential',
      userId: IDS.userProvider,
      password,
    },
    update: {},
  })

  await prisma.profiles.upsert({
    where: { id: IDS.profileProvider },
    create: {
      id: IDS.profileProvider,
      email: 'provider@poortal.dev',
      full_name: 'Carlos Mendoza',
      phone: '+52 984 123 4567',
      role: 'provider',
      preferred_language: 'es',
      user_id: IDS.userProvider,
    },
    update: {},
  })

  await prisma.provider_profiles.upsert({
    where: { id: IDS.providerProfile },
    create: {
      id: IDS.providerProfile,
      user_id: IDS.profileProvider,
      destination_id: IDS.destination,
      category_id: IDS.catAventura,
      business_name: 'Tulum Dive & Snorkel',
      representative_name: 'Carlos Mendoza',
      phone: '+52 984 123 4567',
      customer_phone: '+52 984 123 4567',
      location: 'Zona Hotelera, Tulum, QR',
      full_address: 'Carretera Tulum-Boca Paila Km 7.5, Zona Hotelera, 77780 Tulum, Q.R.',
      short_description:
        'Operadora de buceo y snorkel en cenotes y arrecifes de Tulum. +8 años de experiencia.',
      status: 'active',
      legal_name: 'Carlos Mendoza Ruiz',
      tax_id: 'MERC850312AB1',
      website: 'https://tulumdive.mx',
      stripe_onboarding_complete: false,
    },
    update: {},
  })

  await seedExperiences()

  console.log('  ✓ provider@poortal.dev')
}

// ─── experiencias ─────────────────────────────────────────────────────────────

async function seedExperiences() {
  console.log('🌊 Creando experiencias...')

  // Exp 1: Snorkel en Cenote
  await prisma.experiences.upsert({
    where: { id: IDS.exp1 },
    create: {
      id: IDS.exp1,
      provider_id: IDS.providerProfile,
      destination_id: IDS.destination,
      category_id: IDS.catAventura,
      subcategory_id: IDS.subAcuatico,
      title: 'Snorkel en Cenote Gran Cenote',
      slug: 'snorkel-cenote-gran-cenote',
      description:
        'Explora las aguas cristalinas del Gran Cenote con equipo profesional. Nada entre estalactitas y estalagnitas en uno de los cenotes más bellos de Tulum. Apto para todos los niveles.',
      short_description: 'Nada en las aguas turquesas del Gran Cenote con equipo incluido.',
      highlights: [
        'Equipo de snorkel profesional incluido',
        'Guía certificado bilingüe',
        'Agua dulce a 24°C todo el año',
        'Máximo 8 personas por grupo',
      ],
      includes: [
        'Equipo de snorkel (máscara, snorkel, aletas)',
        'Chaleco salvavidas',
        'Guía certificado',
        'Seguro de actividad',
        'Entrada al cenote',
      ],
      excludes: ['Transporte', 'Propinas', 'Fotografías profesionales'],
      requirements: [
        'Saber nadar básico',
        'Edad mínima 6 años',
        'No se recomenda si hay problemas cardíacos',
      ],
      meeting_point: 'Gran Cenote, Carretera Tulum Ruinas Km 3',
      meeting_point_lat: 20.2170,
      meeting_point_lng: -87.4418,
      duration_minutes: 90,
      max_capacity: 8,
      min_capacity: 1,
      pricing_type: 'per_person',
      price_amount: 650,
      price_currency: 'MXN',
      cancellation_policy: 'moderate',
      status: 'active',
      is_featured: true,
      published_at: new Date(),
    },
    update: {},
  })

  // Exp 2: Buceo en arrecife
  await prisma.experiences.upsert({
    where: { id: IDS.exp2 },
    create: {
      id: IDS.exp2,
      provider_id: IDS.providerProfile,
      destination_id: IDS.destination,
      category_id: IDS.catAventura,
      subcategory_id: IDS.subAcuatico,
      title: 'Bautizo de Buceo en Arrecife',
      slug: 'bautizo-buceo-arrecife',
      description:
        'Tu primera experiencia de buceo en el arrecife de Mesoamérica. Clase teórica en tierra, práctica en aguas poco profundas y una inmersión guiada entre peces tropicales y coral. Sin experiencia previa necesaria.',
      short_description: 'Primera inmersión en el arrecife mesoamericano. Sin experiencia necesaria.',
      highlights: [
        'Certificación de bautizo incluida',
        'Instructor con ratio 1:2',
        'Arrecife a solo 10 min en lancha',
        'Fotos subacuáticas incluidas',
      ],
      includes: [
        'Equipo de buceo completo',
        'Lancha de transporte al arrecife',
        'Instructor certificado PADI',
        'Seguro de actividad',
        'Certificado de bautizo',
        'Fotos subacuáticas',
      ],
      excludes: ['Transporte al muelle', 'Propinas'],
      requirements: [
        'Saber nadar',
        'Edad mínima 10 años',
        'No problemas cardíacos ni epilepsia',
        'No haber buceado en las últimas 24h si van a volar',
      ],
      meeting_point: 'Muelle Tulum Dive, Zona Hotelera',
      meeting_point_lat: 20.1851,
      meeting_point_lng: -87.4568,
      duration_minutes: 180,
      max_capacity: 4,
      min_capacity: 1,
      pricing_type: 'per_person',
      price_amount: 1850,
      price_currency: 'MXN',
      cancellation_policy: 'strict',
      status: 'active',
      is_featured: false,
      published_at: new Date(),
    },
    update: {},
  })

  // Disponibilidad: próximos 7 días para cada experiencia
  // Borrar disponibilidades existentes para evitar duplicados
  await prisma.experience_availability.deleteMany({
    where: { experience_id: { in: [IDS.exp1, IDS.exp2] } },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const availabilityData: any[] = []

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Snorkel: 9am y 2pm
    availabilityData.push(
      {
        experience_id: IDS.exp1,
        date,
        start_time: new Date('1970-01-01T09:00:00'),
        end_time:   new Date('1970-01-01T10:30:00'),
        total_spots: 8,
        booked_spots: 0,
        is_blocked: false,
      },
      {
        experience_id: IDS.exp1,
        date,
        start_time: new Date('1970-01-01T14:00:00'),
        end_time:   new Date('1970-01-01T15:30:00'),
        total_spots: 8,
        booked_spots: 0,
        is_blocked: false,
      },
    )

    // Buceo: solo 9am
    availabilityData.push({
      experience_id: IDS.exp2,
      date,
      start_time: new Date('1970-01-01T09:00:00'),
      end_time:   new Date('1970-01-01T12:00:00'),
      total_spots: 4,
      booked_spots: 0,
      is_blocked: false,
    })
  }

  await prisma.experience_availability.createMany({ data: availabilityData })

  console.log('  ✓ 2 experiencias con disponibilidad 7 días')
}

// ─── run ──────────────────────────────────────────────────────────────────────

main()
  .catch((err) => {
    console.error('\n❌ Error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
