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

// Interface for dynamic :id parameter in GET / PUT / DELETE
export interface PlantIdParam {
    id: string;
}

export interface ScheduleUpdatePayload {
    scheduledTime?: string;
    targetVolumeMl?: number;
    daysOfWeek?: number[];
    isActive?: boolean;
}

// Interface for updating a plant (PUT /api/plants/:id)
export interface UpdatePlantBody {
    name?: string;
    species?: string;
    outputChannelId?: string | null;
    gpioPinNumber?: number;
    controllerId?: string;
    schedule?: ScheduleUpdatePayload;
    safetyTriggerEnabled?: boolean;
    moistureThresholdPct?: number;
    safetyWaterVolumeMl?: number;
}

