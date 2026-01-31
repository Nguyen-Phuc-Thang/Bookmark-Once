import '../css/components/AddLinkOverlay.css';
import '../css/components/DeleteLinkOverlay.css';

interface DeleteSessionOverlayProps {
    isOpen: boolean;
    sessionTitle?: string;
    onCancel: () => void;
    onDelete: () => void;
}

export default function DeleteSessionOverlay({
    isOpen,
    sessionTitle,
    onCancel,
    onDelete,
}: DeleteSessionOverlayProps) {
    if (!isOpen) return null;


    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const titleDisplay = sessionTitle?.trim() ? `"${sessionTitle}"` : 'this session';

    return (
        <div className="overlay-backdrop" onClick={handleOverlayClick}>
            <div className="overlay-container delete-overlay">
                <button className="close-button" onClick={onCancel}>
                    ✕
                </button>

                <h2 className="overlay-title">Delete Session</h2>

                <p className="delete-caption">
                    Are you sure about deleting{' '}
                    <span className="delete-link-title">{titleDisplay}</span>?
                </p>

                <div className="delete-actions">
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="delete-button" onClick={onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
