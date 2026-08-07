import type { Plant, WaterResponse, Controller } from '../types';

export interface UpdatePlantPayload {
    name?: string;
    species?: string;
    gpioPinNumber?: number;
    controllerId?: string;
    schedule?: {
        scheduledTime?: string;
        targetVolumeMl?: number;
        daysOfWeek?: number[];
        isActive?: boolean;
    };
}

const API_BASE_URL = 'http://localhost:3000/api';


/**
 * Fetches all plants from the Express backend.
 */
export async function fetchPlants(): Promise<Plant[]> {
    const response = await fetch(`${API_BASE_URL}/plants`);
    if (!response.ok) {
        throw new Error(`Failed to fetch plants (Status: ${response.status})`);
    }
    return response.json();
}

/**
 * Waters the passed in plant
 * @param {string} plantId - The plant's id to be watered
 * @param {number} volumeMl - The volume of water in mL to water the plant
 * @returns {WaterResponse} - 
 */
export async function waterPlant(plantId: string, volumeMl: number): Promise<WaterResponse> {
    const response = await fetch(`${API_BASE_URL}/plants/${plantId}/water`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volumeMl: volumeMl })
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to water plant (Status: ${response.status})`);
    }
    console.log(`I'm watered with ${volumeMl}!`)
    return response.json();
}

/**
 * Creates a new plant profile in PostgreSQL.
 * @param {string} name - The name of the plant to be created
 * @param {species} species - The species of the plant to be created
 * @returns {Promise<Plant>} - The created plant
 */
export async function createPlant(name: string, species?: string): Promise<Plant> {
    const response = await fetch(`${API_BASE_URL}/plants/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, species: species })
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create plant (Status: ${response.status})`);
    }
    console.log(`${name} has been created!`)
    return response.json();
}

/**
 * Deletes a plant profile in PostgreSQL.
 * @param {string} plantId - The id of the plant to be deleted
 * @returns {Promise<Plant>} - The deleted plant
 */
export async function deletePlant(plantId: string): Promise<Plant> {
    const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete plant (Status: ${response.status})`);
    }
    console.log(`plant id ${plantId} has been deleted!`)
    return response.json();
}


/**
 * Fetches all hardware controllers from the backend.
 */
export async function fetchControllers(): Promise<Controller[]> {
    const response = await fetch(`${API_BASE_URL}/controllers`);
    if (!response.ok) {
        throw new Error(`Failed to fetch controllers (Status: ${response.status})`);
    }
    return response.json();
}

/**
 * Updates an existing plant profile in PostgreSQL.
 * @param {string} plantId - The id of the plant to be updated
 * @param {UpdatePlantPayload} updates - Updates object containing name, species, gpioPinNumber, schedule, etc.
 * @returns {Promise<Plant>} - The updated plant
 */
export async function updatePlant(plantId: string, updates: UpdatePlantPayload): Promise<Plant> {
    const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update plant (Status: ${response.status})`);
    }
    console.log(`plant id ${plantId} has been updated!`);
    return response.json();
}