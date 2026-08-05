interface DeleteCardProps {
    plantName: String;
    confirmDelete: () => void;
    setIsFlipped: (boolean) => void;
}

export function DeleteCard({ plantName, confirmDelete, setIsFlipped }: DeleteCardProps) {
    return (<div className="card-back">
        <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <h4 style={{ color: 'var(--danger-red)', fontWeight: 700 }}>Delete {plantName}?</h4>
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
    </div>)
}