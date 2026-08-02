import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seed...');

    const controller = await prisma.controller.create({
        data: {
            name: "Living Room ESP32",
            deviceMacAddress: "AA:BB:CC:DD:EE:01"
        }
    })

    const controllerOutput = await prisma.controllerOutput.create({
        data: {
            controllerId: controller.id,
            gpioPinNumber: 4
        }
    })

    const plant = await prisma.plant.create({
        data: {
            name: "Monseta",
            species: "Mostera Deliciosa",
            outputChannelId: controllerOutput.id
        }
    })
    prisma.plant.findMany()
    const plantSchedule = await prisma.plantSchedule.create({
        data: {
            plantId: plant.id,
            scheduledTime: "08:00",
            daysOfWeek: [1, 3, 5],
            targetVolumeMl: 250
        }
    })
    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
