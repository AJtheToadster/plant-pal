// Interface for creating a plant (POST /api/plants)
export interface CreatePlantBody {
    name: string;
    species?: string;
    outputChannelId?: string;
}

// Interface for watering a plant (POST /api/plants/:id/water)
export interface WaterPlantParams {
    id: string;
}

export interface WaterPlantBody {
    volumeMl: number;
}
