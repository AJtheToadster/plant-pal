import type { Plant } from '../types';

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

