import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Seed Roles
    const adminRole = await prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: { name: "Admin" },
    });

    const kearsipanRole = await prisma.role.upsert({
        where: { name: "Kearsipan" },
        update: {},
        create: { name: "Kearsipan" },
    });

    const pengelolaRole = await prisma.role.upsert({
        where: { name: "Pengelola" },
        update: {},
        create: { name: "Pengelola" },
    });

    // Seed Permissions
    const permissions = [
        "dokumen_*", "dokumen_read_all", "dokumen_store", "dokumen_update", "dokumen_delete", "dokumen_read",
        "kategori_*", "kategori_read", "kategori_store", "kategori_update", "kategori_delete","kategori_dokumen_all"
    ];

    const permissionRecords = await Promise.all(
        permissions.map(async (perm) => {
            return prisma.permission.upsert({
                where: { name: perm },
                update: {},
                create: { name: perm },
            });
        })
    );

    // Seed Role Permissions
    await prisma.rolePermission.createMany({
        data: permissionRecords.map((perm) => ({ roleId: adminRole.id, permissionId: perm.id })),
        skipDuplicates: true,
    });

    // Seed Menus
    const menus = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Dokumen", path: "/dokumen" },
        { name: "Kategori Dokumen", path: "/kategori-dokumen" },
        { name: "Setting", path: "/setting" },
    ];

    const menuRecords = await Promise.all(
        menus.map(async (menu) => {
            const existingMenu = await prisma.menu.findFirst({
                where: { path: menu.path },
            });

            if (!existingMenu) {
                return prisma.menu.create({ data: menu });
            }
            return existingMenu;
        })
    );

    // Seed Role Menus
    await prisma.roleMenu.createMany({
        data: menuRecords.map((menu) => ({ roleId: adminRole.id, menuId: menu.id })),
        skipDuplicates: true,
    });

    // Seed Users
    const hashedPassword = await bcrypt.hash("password123", 10);

    await prisma.user.createMany({
        data: [
            { name: "Admin User", username: "admin", email: "admin@example.com", password: hashedPassword, roleId: adminRole.id },
            { name: "Kearsipan User", username: "kearsipan", email: "kearsipan@example.com", password: hashedPassword, roleId: kearsipanRole.id },
            { name: "Pengelola User", username: "pengelola", email: "pengelola@example.com", password: hashedPassword, roleId: pengelolaRole.id },
        ],
        skipDuplicates: true,
    });

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
