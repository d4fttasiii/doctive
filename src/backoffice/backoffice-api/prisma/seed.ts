import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.user.upsert({
        where: { address: '0x68e3d67D798274ef526b95b27169d7C8dF1C6E2d' },
        update: {},
        create: {
            email: 'peter.tasner@conceptualise.de',
            name: 'Peter',
            address: '0x68e3d67D798274ef526b95b27169d7C8dF1C6E2d',
            role: 0,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });