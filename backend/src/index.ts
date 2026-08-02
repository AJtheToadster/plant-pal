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

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
