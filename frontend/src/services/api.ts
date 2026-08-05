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
    // Pass body: JSON.stringify(data)
    // Handle !response.ok errors and return response.json()!
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
