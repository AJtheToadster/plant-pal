interface EditCardProps {
    plantName: String;
    confirmEdit: () => void;
    setIsFlipped: (boolean) => void;
}

export function EditCard({ plantName, confirmEdit, setIsFlipped }: EditCardProps) {
    return (<div className="card-back card-back-edit">
        <div>
            <h4 style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Edit your {plantName}</h4>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            {/* Cancel flips back */}
            <button className="btn btn-secondary" onClick={() => setIsFlipped(false)}>
                Cancel
            </button>
            {/* Confirm performs edit */}
            <button className="btn btn-danger" onClick={confirmEdit}>
                Delete
            </button>
        </div>
    </div>)
}