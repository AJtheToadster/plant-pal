import { useState } from 'react';
import { deletePlant, waterPlant } from '../services/api';
import type { Plant } from '../types';

interface PlantCardProps {
    plant: Plant;
    onPlantDeleted: () => void;
    onPlantEdited: () => void;
}

export function PlantCard({ plant, onPlantDeleted, onPlantEdited }: PlantCardProps) {
    const [volumeMl, setVolumeMl] = useState<number>(20)
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const handleDelete = async () => {
        setIsFlipped(true)
    }
    const confirmDelete = async () => {
        await deletePlant(plant.id);
        onPlantDeleted();
    }
    const handleEdit = async () => {
        onPlantEdited();
    }

    return (
        <div className={`plant-card ${isFlipped ? 'flipped' : ''}`}>
            <div className='card-inner'>
                <div className="card-front">
                    <div className="plant-header">
                        <div className="plant-avatar">🌿</div>
                        <div className='edit-delete-container'>
                            <button className="btn btn-primary" onClick={handleEdit}>%</button>
                            <button className="btn btn-delete" onClick={handleDelete}>X</button>
                        </div>
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

                <div className="card-back">
                    <div>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                        <h4 style={{ color: 'var(--danger-red)', fontWeight: 700 }}>Delete {plant.name}?</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            This action cannot be undone.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {/* Cancel flips back */}
                        <button className="btn btn-secondary" onClick={() => setIsFlipped(false)}>
                            Cancel
                        </button>
                        {/* Confirm performs deletion */}
                        <button className="btn btn-danger" onClick={confirmDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
