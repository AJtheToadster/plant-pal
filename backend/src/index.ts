import express from 'express';
import 'dotenv/config';
import { prisma } from './db.js';
import type { CreatePlantBody, WaterPlantParams, WaterPlantBody, PlantIdParam, UpdatePlantBody } from './types.js';
import { calculateWateringDuration } from './tools.js'
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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

app.get('/api/plants/:id', async (req, res) => {
    const { id } = req.params as PlantIdParam;
    const plant = await prisma.plant.findUnique({
        where: { id: id }
    })
    if (!plant) {
        return res.status(404).json({ error: 'Plant not found' })
    }
    res.json(plant)
})

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
    const { id } = req.params as WaterPlantParams;
    const { volumeMl } = req.body as WaterPlantBody;

    if (volumeMl <= 0) {
        return res.status(400).json({
            error: 'Volume of water requested is invalid'
        })
    }

    const plant = await prisma.plant.findUnique({
        where: { id: id },
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

    const durationSeconds = calculateWateringDuration(volumeMl, plant.outputChannel.flowRateMlPerSec)

    //TO-DO: Websockets/MQTT Layer, send the command to actaully pump the water
    //io.emit('pump:trigger', {pin, duration})
    return res.json({ gpioPinNumber: plant.outputChannel.gpioPinNumber, durationSeconds: durationSeconds })

});

app.put('/api/plants/:id', async (req, res) => {
    const { id } = req.params as PlantIdParam;
    const body = req.body as UpdatePlantBody;

    try {
        const updatedPlant = await prisma.plant.update({
            where: { id },
            data: body
        });
        return res.json(updatedPlant);
    } catch (error) {
        return res.status(404).json({ error: 'Plant not found' });
    }
});

app.delete('/api/plants/:id', async (req, res) => {
    const { id } = req.params as PlantIdParam;
    try {
        const deletedPlant = await prisma.plant.delete({
            where: { id },
        });
        return res.json(deletedPlant);
    } catch (error) {
        return res.status(404).json({ error: 'Plant not found' });
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
