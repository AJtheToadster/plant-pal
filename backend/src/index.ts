import express from 'express';
import 'dotenv/config';
import { prisma } from './db.js';
import type { CreatePlantBody, WaterPlantParams, WaterPlantBody } from './types.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/plants', async (req, res) => {
    const plants = await prisma.plant.findMany({
        include: {
            schedules: true,
            outputChannel: true
        }
    })
    res.json(plants)
});

app.post('/api/plants', async (req, res) => {
    const { name, species, outputChannelId } = req.body as CreatePlantBody;
    if (!name) {
        return res.status(400).json({
            error: 'Plant name is required'
        })
    }
    const newPlant = await prisma.plant.create({
        data: {
            name: name,
            species: species ?? null,
            outputChannelId: outputChannelId ?? null
        }
    })
    return res.status(201).json(newPlant)
});

app.post('/api/plants/:id/water', async (req, res) => {
    const plantId = req.params.id
    const { volumeMl } = req.body

    if (volumeMl <= 0) {
        return res.status(400).json({
            error: 'Volume of water requested is invalid'
        })
    }

    const plant = await prisma.plant.findUnique({
        where: { id: plantId },
        include: { outputChannel: true }
    })

    if (!plant) {
        return res.status(404).json({
            error: 'Plant not found'
        })
    }

    if (!plant.outputChannel) {
        return res.status(400).json({
            error: 'Plant has no assigned pump channel'
        })
    }

    const durationSeconds = volumeMl / plant.outputChannel.flowRateMlPerSec

    //TO-DO: Websockets/MQTT Layer, send the command to actaully pump the water
    //io.emit('pump:trigger', {pin, duration})
    return res.json({ gpioPinNumber: plant.outputChannel.gpioPinNumber, durationSeconds: durationSeconds })

});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
