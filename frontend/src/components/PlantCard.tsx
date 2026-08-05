import { useState } from 'react';
import { deletePlant, waterPlant } from '../services/api';
import type { Plant } from '../types';

interface PlantCardProps {
    plant: Plant;
    onPlantDeleted: () => void;
}

export function PlantCard({ plant, onPlantDeleted }: PlantCardProps) {
    const [volumeMl, setVolumeMl] = useState<number>(20)
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${plant.name}? This can't be undone!`)) return;
        await deletePlant(plant.id);
        onPlantDeleted();
    }

    return (
        <div className="plant-card">
            <div className="plant-header">
                <div className="plant-avatar">🌿</div>
                <button className="btn btn-delete" onClick={handleDelete}>X</button>
            </div>

            <h3 className="plant-name">{plant.name}</h3>
            <p className="plant-species">{plant.species || 'Species unspecified'}</p>

            {/* Hardware Channel Tag */}
            <div className={`channel-tag ${plant.outputChannel ? 'active' : ''}`}>
                ⚡ {plant.outputChannel
                    ? `Pin #${plant.outputChannel.gpioPinNumber} (${plant.outputChannel.flowRateMlPerSec} mL/s)`
                    : 'No Output Channel Linked'}
            </div>

            <div className="card-footer">
                <div className="volume-input-group">
                    <input
                        type="number"
                        className="form-input volume-input"
                        value={volumeMl}
                        onChange={(e) => setVolumeMl(Number(e.target.value))}
                        min="1"
                        max="2000"
                    />
                    <span className="unit-label">mL</span>
                </div>

                <button
                    className="btn btn-water"
                    onClick={() => waterPlant(plant.id, volumeMl)}
                    disabled={!plant.outputChannel}
                >
                    💧 Water Now
                </button>
            </div>

        </div>
    );
}
