import { useState, useEffect } from "react";
import type { Plant } from "./types";
import { fetchPlants } from "./services/api";
import { PlantCard } from "./components/PlantCard";
import { AddPlantModal } from "./components/AddPlantModal";

export function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  async function loadPlants() {
    setIsLoading(true);
    try {
      const data = await fetchPlants()
      setPlants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load plants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPlants(); }, []);

  return (
    <div>
      <header className="app-header">
        <div className="header-container">
          <div className="logo-group">
            <div className="logo-icon">🌿</div>
            <h1 className="logo-title">PlantPal</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>＋ Add Plant</button>
        </div>
      </header>

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>My Garden</h2>
          <button className="btn btn-secondary" onClick={loadPlants} disabled={isLoading}>
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'var(--danger-light)', color: 'var(--danger-red)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="plant-grid">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onPlantDeleted={loadPlants} onPlantEdited={loadPlants} />
          ))}
        </div>
        {isAddModalOpen && <AddPlantModal onClose={() => setIsAddModalOpen(false)} onPlantAdded={loadPlants} />}
      </main>
    </div>
  );
}

export default App;
