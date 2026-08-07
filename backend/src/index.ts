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

app.get('/api/controllers', async (req, res) => {
    try {
        const controllers = await prisma.controller.findMany({
            include: { outputs: true }
        });
        return res.json(controllers);
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to fetch controllers' });
    }
});

app.put('/api/plants/:id', async (req, res) => {
    const { id } = req.params as PlantIdParam;
    const { name, species, gpioPinNumber, controllerId, schedule } = req.body as UpdatePlantBody;

    try {
        const existingPlant = await prisma.plant.findUnique({
            where: { id },
            include: { outputChannel: true, schedules: true }
        });

        if (!existingPlant) {
            return res.status(404).json({ error: 'Plant not found' });
        }

        let outputChannelId = existingPlant.outputChannelId;

        // Handle GPIO pin or Controller update
        if (gpioPinNumber !== undefined && gpioPinNumber !== null && gpioPinNumber > 0) {
            if (existingPlant.outputChannel) {
                await prisma.controllerOutput.update({
                    where: { id: existingPlant.outputChannel.id },
                    data: {
                        gpioPinNumber: Number(gpioPinNumber),
                        ...(controllerId ? { controllerId } : {})
                    }
                });
            } else {
                let targetControllerId = controllerId;
                if (!targetControllerId) {
                    const firstController = await prisma.controller.findFirst();
                    if (firstController) {
                        targetControllerId = firstController.id;
                    } else {
                        const newController = await prisma.controller.create({
                            data: {
                                name: "ESP32 Controller",
                                deviceMacAddress: "AA:BB:CC:DD:EE:FF"
                            }
                        });
                        targetControllerId = newController.id;
                    }
                }
                const newOutput = await prisma.controllerOutput.create({
                    data: {
                        controllerId: targetControllerId,
                        gpioPinNumber: Number(gpioPinNumber)
                    }
                });
                outputChannelId = newOutput.id;
            }
        }

        // Update basic plant fields
        await prisma.plant.update({
            where: { id },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(species !== undefined ? { species: species || null } : {}),
                outputChannelId
            }
        });

        // Handle Schedule update
        if (schedule) {
            const existingSchedule = existingPlant.schedules[0];
            if (existingSchedule) {
                await prisma.plantSchedule.update({
                    where: { id: existingSchedule.id },
                    data: {
                        ...(schedule.scheduledTime ? { scheduledTime: schedule.scheduledTime } : {}),
                        ...(schedule.targetVolumeMl !== undefined ? { targetVolumeMl: Number(schedule.targetVolumeMl) } : {}),
                        ...(schedule.daysOfWeek ? { daysOfWeek: schedule.daysOfWeek } : {}),
                        ...(schedule.isActive !== undefined ? { isActive: schedule.isActive } : {})
                    }
                });
            } else {
                await prisma.plantSchedule.create({
                    data: {
                        plantId: id,
                        scheduledTime: schedule.scheduledTime || "08:00",
                        targetVolumeMl: Number(schedule.targetVolumeMl) || 250,
                        daysOfWeek: schedule.daysOfWeek || [1, 3, 5],
                        isActive: schedule.isActive ?? true
                    }
                });
            }
        }

        // Return updated plant with all relations included
        const updatedPlant = await prisma.plant.findUnique({
            where: { id },
            include: {
                outputChannel: { include: { controller: true } },
                schedules: true
            }
        });

        return res.json(updatedPlant);
    } catch (error: any) {
        console.error("Failed to update plant:", error);
        return res.status(500).json({ error: error.message || 'Failed to update plant' });
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
