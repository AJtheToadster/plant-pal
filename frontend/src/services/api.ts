import type { Plant, WaterResponse } from '../types';

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
 * @param {Plant} plant - The plant to be watered
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