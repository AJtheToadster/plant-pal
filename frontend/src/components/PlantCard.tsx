import { useState } from 'react';
import { deletePlant, waterPlant } from '../services/api';
import type { Plant } from '../types';
import { DeleteCard } from './DeleteCard';
import { EditCard } from './EditCard';

interface PlantCardProps {
    plant: Plant;
    onPlantDeleted: () => void;
    onPlantEdited: () => void;
}

export function PlantCard({ plant, onPlantDeleted, onPlantEdited }: PlantCardProps) {
    const [volumeMl, setVolumeMl] = useState<number>(20)
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        setIsFlipped(true)
    }
    const confirmDelete = async () => {
        await deletePlant(plant.id);
        onPlantDeleted();
    }
    const handleEdit = async () => {
        setIsDeleting(false)
        setIsFlipped(true)
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
                {isDeleting ? <DeleteCard plantName={plant.name} confirmDelete={confirmDelete} setIsFlipped={setIsFlipped} /> : <EditCard plantName={plant.name} confirmEdit={() => { }} setIsFlipped={setIsFlipped} />}
            </div>
        </div>
    );
}
