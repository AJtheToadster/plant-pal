import express from 'express';
import 'dotenv/config';
import { prisma } from './db.js';

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
    const plantName = req.body.name
    const plantSpecies = req.body.species
    if (!plantName) {
        return res.status(400).json({
            error: 'Plant name is required'
        })
    }
    const newPlant = await prisma.plant.create({
        data: {
            name: plantName,
            species: plantSpecies
        }
    })
    return res.status(201).json(newPlant)
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
