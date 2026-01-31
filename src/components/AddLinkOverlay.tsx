import { useState } from 'react';
import '../css/components/AddLinkOverlay.css';
import { addLink } from '../database/linksRepo';

interface AddLinkOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function AddLinkOverlay({ isOpen, onClose, onSubmit }: AddLinkOverlayProps) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && url.trim()) {
            await addLink({ id: crypto.randomUUID(), title: title, url: url });
            setTitle('');
            setUrl('');
            onClose();
            onSubmit();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="overlay-backdrop" onClick={handleOverlayClick}>
            <div className="overlay-container">
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>

                <h2 className="overlay-title">Add New Link</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="link-title">Link Title</label>
                        <input
                            id="link-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter link title"
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="link-url">Link URL</label>
                        <input
                            id="link-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Add Link
                    </button>
                </form>
            </div>
        </div>
    );
}
