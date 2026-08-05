import React, { useState } from 'react';
import { createPlant } from '../services/api';

interface AddPlantModalProps {
    onClose: () => void;
    onPlantAdded: () => void;
}

export function AddPlantModal({ onClose, onPlantAdded }: AddPlantModalProps) {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // Prevents full page reload!
        if (!name.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await createPlant(name.trim(), species.trim() || undefined);
            onPlantAdded();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create plant');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">🌿 Add New Plant</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ color: 'var(--danger-red)', marginBottom: '1rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Plant Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Fiddle Leaf Fig"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Species (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Ficus lyrata"
                            className="form-input"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : '🌱 Save Plant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
