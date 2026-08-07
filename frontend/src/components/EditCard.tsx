import React, { useState, useEffect } from 'react';
import type { Plant, Controller } from '../types';
import { updatePlant, fetchControllers } from '../services/api';

interface EditCardProps {
    plant: Plant;
    setIsFlipped: (flipped: boolean) => void;
    onPlantEdited: () => void;
}

const WEEKDAYS = [
    { label: 'S', value: 0, fullName: 'Sunday' },
    { label: 'M', value: 1, fullName: 'Monday' },
    { label: 'T', value: 2, fullName: 'Tuesday' },
    { label: 'W', value: 3, fullName: 'Wednesday' },
    { label: 'T', value: 4, fullName: 'Thursday' },
    { label: 'F', value: 5, fullName: 'Friday' },
    { label: 'S', value: 6, fullName: 'Saturday' },
];

export function EditCard({ plant, setIsFlipped, onPlantEdited }: EditCardProps) {
    const existingSchedule = plant.schedules?.[0];

    const [name, setName] = useState(plant.name);
    const [species, setSpecies] = useState(plant.species || '');
    const [gpioPinNumber, setGpioPinNumber] = useState<number>(plant.outputChannel?.gpioPinNumber || 4);
    const [controllerId, setControllerId] = useState<string>(plant.outputChannel?.controllerId || '');
    const [controllers, setControllers] = useState<Controller[]>([]);

    // Schedule state
    const [scheduledTime, setScheduledTime] = useState(existingSchedule?.scheduledTime || '08:00');
    const [targetVolumeMl, setTargetVolumeMl] = useState<number>(existingSchedule?.targetVolumeMl || 250);
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>(existingSchedule?.daysOfWeek || [1, 3, 5]);
    const [isScheduleActive, setIsScheduleActive] = useState<boolean>(existingSchedule?.isActive ?? true);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchControllers()
            .then(data => {
                setControllers(data);
                if (!controllerId && data.length > 0) {
                    setControllerId(data[0].id);
                }
            })
            .catch(() => {
                // Controller list fetch optional fallback
            });
    }, []);

    const toggleDay = (dayVal: number) => {
        if (daysOfWeek.includes(dayVal)) {
            setDaysOfWeek(daysOfWeek.filter(d => d !== dayVal));
        } else {
            setDaysOfWeek([...daysOfWeek, dayVal].sort());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await updatePlant(plant.id, {
                name: name.trim(),
                species: species.trim() || undefined,
                gpioPinNumber: Number(gpioPinNumber),
                controllerId: controllerId || undefined,
                schedule: {
                    scheduledTime,
                    targetVolumeMl: Number(targetVolumeMl),
                    daysOfWeek,
                    isActive: isScheduleActive
                }
            });
            setIsFlipped(false);
            onPlantEdited();
        } catch (err: any) {
            setError(err.message || 'Failed to update plant');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card-back card-back-edit">
            <div className="edit-card-header">
                <h4 className="edit-card-title">✏️ Edit {plant.name}</h4>
                <button
                    type="button"
                    className="close-btn"
                    onClick={() => setIsFlipped(false)}
                    aria-label="Close edit"
                >
                    ✕
                </button>
            </div>

            {error && (
                <div className="edit-error-banner">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-card-form">
                <div className="edit-card-body">
                    {/* Section 1: Basic Info */}
                    <div className="form-section">
                        <div className="section-title">Plant Info</div>
                        <div className="form-group">
                            <label className="form-label">Plant Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Monstera"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Species</label>
                            <input
                                type="text"
                                className="form-input"
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                placeholder="e.g. Monstera Deliciosa"
                            />
                        </div>
                    </div>

                    {/* Section 2: Hardware Controller & Pin */}
                    <div className="form-section">
                        <div className="section-title">⚡ Hardware & Output</div>
                        {controllers.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Controller</label>
                                <select
                                    className="form-input"
                                    value={controllerId}
                                    onChange={(e) => setControllerId(e.target.value)}
                                >
                                    {controllers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.deviceMacAddress})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">GPIO Pin Number</label>
                            <input
                                type="number"
                                className="form-input"
                                value={gpioPinNumber}
                                onChange={(e) => setGpioPinNumber(Number(e.target.value))}
                                min="1"
                                max="40"
                            />
                        </div>
                    </div>

                    {/* Section 3: Watering Schedule */}
                    <div className="form-section">
                        <div className="section-title">🗓️ Watering Schedule</div>

                        <div className="form-group row-group">
                            <div>
                                <label className="form-label">Scheduled Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Target Volume (mL)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={targetVolumeMl}
                                    onChange={(e) => setTargetVolumeMl(Number(e.target.value))}
                                    min="1"
                                    max="2000"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Repeat Days</label>
                            <div className="days-picker">
                                {WEEKDAYS.map(day => {
                                    const isSelected = daysOfWeek.includes(day.value);
                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            className={`day-pill ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleDay(day.value)}
                                            title={day.fullName}
                                        >
                                            {day.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-group toggle-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={isScheduleActive}
                                    onChange={(e) => setIsScheduleActive(e.target.checked)}
                                />
                                <span>Enable Active Schedule</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="edit-card-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsFlipped(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || !name.trim()}
                    >
                        {isLoading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}