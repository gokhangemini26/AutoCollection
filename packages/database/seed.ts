import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seed başlıyor...');

    // ─── Kullanıcılar ───────────────────────────────────────────────────────────
    const users = [
        { email: 'gm@yzkoleksiyon.com', name: 'Genel Müdür', role: 'GM' as const, departments: [] },
        { email: 'admin@yzkoleksiyon.com', name: 'Sistem Yöneticisi', role: 'ADMIN' as const, departments: [] },
        { email: 'tasarimci@yzkoleksiyon.com', name: 'Ayşe Kaya', role: 'MODULE_USER' as const, departments: ['DESIGN'] },
        { email: 'merkandiz@yzkoleksiyon.com', name: 'Mehmet Yılmaz', role: 'MODULE_USER' as const, departments: ['MERCHANDISING'] },
        { email: 'uretim@yzkoleksiyon.com', name: 'Fatma Demir', role: 'MODULE_USER' as const, departments: ['PRODUCTION'] },
    ];

    const createdUsers: Record<string, any> = {};
    for (const u of users) {
        const hash = await bcrypt.hash('Koleksiyon123!', 10);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            create: {
                email: u.email,
                name: u.name,
                passwordHash: hash,
                role: u.role,
                departmentTags: u.departments as any,
                isActive: true,
            },
            update: { name: u.name, role: u.role },
        });
        createdUsers[u.email] = user;
        console.log(`  ✓ Kullanıcı: ${u.email}`);
    }

    // ─── Sezonlar ───────────────────────────────────────────────────────────────
    const sezonlar = [
        {
            name: 'Sonbahar/Kış 2025',
            startDate: new Date('2025-08-01'),
            endDate: new Date('2026-01-31'),
            status: 'ARCHIVED',
            budget: 1800000,
            skuTarget: 70,
            targetMargin: 0.58,
        },
        {
            name: 'İlkbahar/Yaz 2026',
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-07-31'),
            status: 'ACTIVE',
            budget: 2500000,
            skuTarget: 85,
            targetMargin: 0.60,
        },
    ];

    const createdSeasons: Record<string, any> = {};
    for (const s of sezonlar) {
        const season = await prisma.season.upsert({
            where: { id: (await prisma.season.findFirst({ where: { name: s.name } }))?.id ?? 'not-found' },
            create: {
                name: s.name,
                startDate: s.startDate,
                endDate: s.endDate,
                status: s.status,
            },
            update: { status: s.status },
        }).catch(async () => {
            return prisma.season.create({
                data: {
                    name: s.name,
                    startDate: s.startDate,
                    endDate: s.endDate,
                    status: s.status,
                },
            });
        });

        await prisma.strategyDoc.upsert({
            where: { seasonId: season.id },
            create: {
                seasonId: season.id,
                budgetCap: s.budget,
                skuTargetCount: s.skuTarget,
                targetMargin: s.targetMargin,
                keyDates: {
                    koleksiyonKapanis: '2025-10-15',
                    tasarimTeslim: '2025-11-01',
                    orneklemeBitisi: '2026-01-15',
                    magazaGiris: '2026-02-15',
                },
            },
            update: { budgetCap: s.budget, skuTargetCount: s.skuTarget, targetMargin: s.targetMargin },
        });

        createdSeasons[s.name] = season;
        console.log(`  ✓ Sezon: ${s.name}`);
    }

    // ─── Koleksiyon Line Plan ────────────────────────────────────────────────────
    const aktifSezon = createdSeasons['İlkbahar/Yaz 2026'];
    const kategoriler = [
        { cat: 'Elbise', points: ['ENTRY', 'CORE', 'PREMIUM'] },
        { cat: 'Bluz', points: ['ENTRY', 'CORE'] },
        { cat: 'Pantolon', points: ['ENTRY', 'CORE'] },
        { cat: 'Dış Giyim', points: ['CORE', 'PREMIUM'] },
        { cat: 'Triko', points: ['ENTRY', 'CORE'] },
        { cat: 'Denim', points: ['ENTRY', 'CORE'] },
        { cat: 'Aksesuar', points: ['ENTRY', 'CORE', 'PREMIUM'] },
    ];

    for (const { cat, points } of kategoriler) {
        for (const pp of points) {
            const existing = await prisma.linePlanItem.findFirst({
                where: { seasonId: aktifSezon.id, category: cat, pricePoint: pp as any },
            });
            if (!existing) {
                await prisma.linePlanItem.create({
                    data: { seasonId: aktifSezon.id, category: cat, pricePoint: pp as any },
                });
                console.log(`  ✓ Line plan: ${cat} / ${pp}`);
            }
        }
    }

    console.log('\n✅ Seed tamamlandı!');
    console.log('\n📋 Giriş bilgileri (tüm kullanıcılar için şifre: Koleksiyon123!):');
    users.forEach((u) => console.log(`   ${u.email} (${u.role})`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
