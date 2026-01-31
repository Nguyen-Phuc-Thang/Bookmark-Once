import '../css/components/AddLinkOverlay.css';
import '../css/components/DeleteLinkOverlay.css';

interface DeleteLinkOverlayProps {
    isOpen: boolean;
    linkTitle?: string;
    onCancel: () => void;
    onDelete: () => void;
}

export default function DeleteLinkOverlay({
    isOpen,
    linkTitle,
    onCancel,
    onDelete,
}: DeleteLinkOverlayProps) {
    if (!isOpen) return null;


    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const titleDisplay = linkTitle?.trim() ? `"${linkTitle}"` : 'this link';

    return (
        <div className="overlay-backdrop" onClick={handleOverlayClick}>
            <div className="overlay-container delete-overlay">
                <button className="close-button" onClick={onCancel}>
                    ✕
                </button>

                <h2 className="overlay-title">Delete Link</h2>

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
