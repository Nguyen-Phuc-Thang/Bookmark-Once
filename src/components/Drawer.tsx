import { useState, useEffect } from 'react';
import '../css/components/Drawer.css';
import { addSession, updateSession } from '../database/sessionRepo';
import type { Link } from '../database/linksRepo';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: "ADD_SESSION" | "VIEW_SESSIONS";
    onSessionAdd: () => void;
    onSessionUpdate: () => void;
    onSessionDelete: () => void;
    currentSession?: { id: string; title: string; endsAt: Date | string; links: Link[] };
    onDeleteSessionClick?: (sessionTitle: string) => void;
}

export default function Drawer({ isOpen, onClose, mode, onSessionAdd, onSessionUpdate, currentSession, onDeleteSessionClick }: DrawerProps) {
    const [title, setTitle] = useState("");
    const [isPermanent, setIsPermanent] = useState(false);
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [links, setLinks] = useState<Link[]>([]);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    // Initialize form with current session data when in VIEW_SESSIONS mode
    useEffect(() => {
        if (mode === "VIEW_SESSIONS" && currentSession) {
            setTitle(currentSession.title);
            setLinks([...currentSession.links]);

            if (currentSession.endsAt === "PERMANENT") {
                setIsPermanent(true);
                setHours("");
                setMinutes("");
            } else {
                setIsPermanent(false);
                const endTime = new Date(currentSession.endsAt);
                const currentTime = new Date();
                const diffMs = endTime.getTime() - currentTime.getTime();
                const totalSeconds = Math.floor(diffMs / 1000);
                const calculatedHours = Math.floor(totalSeconds / 3600);
                const calculatedMinutes = Math.floor((totalSeconds % 3600) / 60);
                setHours(String(calculatedHours));
                setMinutes(String(calculatedMinutes));
            }
        } else if (mode === "ADD_SESSION") {
            // Reset form for ADD_SESSION mode
            setTitle("");
            setIsPermanent(false);
            setHours("");
            setMinutes("");
            setLinks([]);
            setIsAddingLink(false);
            setEditingLinkIndex(null);
            setLinkTitle("");
            setLinkUrl("");
        }
    }, [mode, currentSession, isOpen]);

    const handleAddLinkClick = () => {
        setIsAddingLink(true);
        setEditingLinkIndex(null);
        setLinkTitle("");
        setLinkUrl("");
    };

    const handleEditLinkClick = (index: number) => {
        setEditingLinkIndex(index);
        setLinkTitle(links[index].title);
        setLinkUrl(links[index].url);
        setIsAddingLink(false);
    };

    const handleLinkCancel = () => {
        setIsAddingLink(false);
        setEditingLinkIndex(null);
        setLinkTitle("");
        setLinkUrl("");
    };

    const handleLinkConfirm = () => {
        if (linkTitle.trim() && linkUrl.trim()) {
            if (editingLinkIndex !== null) {
                // Update existing link
                const updatedLinks = [...links];
                updatedLinks[editingLinkIndex] = { id: links[editingLinkIndex].id, title: linkTitle, url: linkUrl };
                setLinks(updatedLinks);
                setEditingLinkIndex(null);
            } else {
                // Add new link
                setLinks([...links, { id: crypto.randomUUID(), title: linkTitle, url: linkUrl }]);
            }
            setLinkTitle("");
            setLinkUrl("");
            setIsAddingLink(false);
        }
    };

    const handleRemoveLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleAddSession = () => {
        if (title.trim() && (isPermanent || hours || minutes)) {
            addSession({
                id: crypto.randomUUID(),
                title: title,
                endsAt: isPermanent ? "PERMANENT" : new Date(Date.now() + (Number(hours) * 3600 + Number(minutes) * 60) * 1000),
                links: links
            });

            // Reset form
            setTitle("");
            setIsPermanent(false);
            setHours("");
            setMinutes("");
            setLinks([]);
            onClose();
            onSessionAdd();
        }
    };

    const handleUpdateSession = () => {
        if (!currentSession) return;

        if (title.trim() && (isPermanent || hours || minutes)) {
            updateSession({
                id: currentSession.id,
                title: title,
                endsAt: isPermanent ? "PERMANENT" : new Date(Date.now() + (Number(hours) * 3600 + Number(minutes) * 60) * 1000),
                links: links
            });

            onClose();
            onSessionUpdate();
        }
    };

    const handleDeleteSession = () => {
        if (!currentSession) return;

        if (onDeleteSessionClick) {
            onDeleteSessionClick(currentSession.title);
        }
    };

    return (
        <>
            {/* Drawer */}
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                {mode === "ADD_SESSION" && (
                    <div className="drawer-content">
                        <h2>Add New Session</h2>

                        {/* Title Input */}
                        <div className="form-group" style={{ marginTop: '30px' }}>
                            <label htmlFor="session-title">Session Title</label>
                            <input
                                id="session-title"
                                type="text"
                                placeholder="Enter session title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Permanent Checkbox */}
                        <div className="form-group checkbox-group">
                            <label htmlFor="permanent-checkbox">
                                <input
                                    id="permanent-checkbox"
                                    type="checkbox"
                                    checked={isPermanent}
                                    onChange={(e) => setIsPermanent(e.target.checked)}
                                />
                                <span>Permanent</span>
                            </label>
                        </div>

                        {/* Duration Input */}
                        <div className="form-group" style={{ opacity: isPermanent ? 0.5 : 1, pointerEvents: isPermanent ? 'none' : 'auto' }}>
                            <label>Duration</label>
                            <div className="duration-inputs">
                                <div className="duration-field">
                                    <input
                                        type="number"
                                        placeholder="Hours"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        min="0"
                                        disabled={isPermanent}
                                    />
                                    <span>Hours</span>
                                </div>
                                <div className="duration-field">
                                    <input
                                        type="number"
                                        placeholder="Minutes"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                        min="0"
                                        max="59"
                                        disabled={isPermanent}
                                    />
                                    <span>Minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="form-group">
                            <label>Links</label>
                            <div className="links-container">
                                {links.map((link, index) => (
                                    <div key={index} className="link-card">
                                        <div className="link-info" onClick={() => handleEditLinkClick(index)} style={{ cursor: 'pointer' }}>
                                            <p className="link-title">{link.title}</p>
                                            <p className="link-url">{link.url}</p>
                                        </div>
                                        <button
                                            className="link-remove-btn"
                                            onClick={() => handleRemoveLink(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {!isAddingLink ? (
                                    <div className="add-link-box" onClick={handleAddLinkClick}>
                                        <span className="plus-icon">+</span>
                                    </div>
                                ) : (
                                    <div className="link-input-card">
                                        <input
                                            type="text"
                                            placeholder="Link title"
                                            value={linkTitle}
                                            onChange={(e) => setLinkTitle(e.target.value)}
                                            className="link-title-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            className="link-url-input"
                                        />
                                        <div className="link-action-buttons">
                                            <button
                                                className="link-confirm-btn"
                                                onClick={handleLinkConfirm}
                                                title="Confirm"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="link-cancel-btn"
                                                onClick={handleLinkCancel}
                                                title="Cancel"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {editingLinkIndex !== null && !isAddingLink && (
                                    <div className="link-input-card">
                                        <input
                                            type="text"
                                            placeholder="Link title"
                                            value={linkTitle}
                                            onChange={(e) => setLinkTitle(e.target.value)}
                                            className="link-title-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            className="link-url-input"
                                        />
                                        <div className="link-action-buttons">
                                            <button
                                                className="link-confirm-btn"
                                                onClick={handleLinkConfirm}
                                                title="Confirm"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="link-cancel-btn"
                                                onClick={handleLinkCancel}
                                                title="Cancel"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Session Button */}
                        <button className="add-session-btn" onClick={handleAddSession}>
                            Add Session
                        </button>
                    </div>)
                }

                {mode === "VIEW_SESSIONS" && (
                    <div className="drawer-content">
                        <h2>Edit Session</h2>

                        {/* Title Input */}
                        <div className="form-group" style={{ marginTop: '30px' }}>
                            <label htmlFor="session-title">Session Title</label>
                            <input
                                id="session-title"
                                type="text"
                                placeholder="Enter session title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Permanent Checkbox */}
                        <div className="form-group checkbox-group">
                            <label htmlFor="permanent-checkbox">
                                <input
                                    id="permanent-checkbox"
                                    type="checkbox"
                                    checked={isPermanent}
                                    onChange={(e) => setIsPermanent(e.target.checked)}
                                />
                                <span>Permanent</span>
                            </label>
                        </div>

                        {/* Duration Input */}
                        <div className="form-group" style={{ opacity: isPermanent ? 0.5 : 1, pointerEvents: isPermanent ? 'none' : 'auto' }}>
                            <label>Duration</label>
                            <div className="duration-inputs">
                                <div className="duration-field">
                                    <input
                                        type="number"
                                        placeholder="Hours"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        min="0"
                                        disabled={isPermanent}
                                    />
                                    <span>Hours</span>
                                </div>
                                <div className="duration-field">
                                    <input
                                        type="number"
                                        placeholder="Minutes"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                        min="0"
                                        max="59"
                                        disabled={isPermanent}
                                    />
                                    <span>Minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="form-group">
                            <label>Links</label>
                            <div className="links-container">
                                {links.map((link, index) => (
                                    !isAddingLink && editingLinkIndex !== index ? (
                                        <div key={index} className="link-card">
                                            <div className="link-info" onClick={() => { window.open(link.url, "_blank", "noopener,noreferrer") }} style={{ cursor: 'pointer' }}>
                                                <p className="link-title">{link.title}</p>
                                                <p className="link-url">{link.url}</p>
                                            </div>
                                            <button
                                                className="link-remove-btn"
                                                onClick={() => handleRemoveLink(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : null
                                ))}

                                {!isAddingLink && editingLinkIndex === null ? (
                                    <div className="add-link-box" onClick={handleAddLinkClick}>
                                        <span className="plus-icon">+</span>
                                    </div>
                                ) : null}

                                {isAddingLink && editingLinkIndex === null && (
                                    <div className="link-input-card">
                                        <input
                                            type="text"
                                            placeholder="Link title"
                                            value={linkTitle}
                                            onChange={(e) => setLinkTitle(e.target.value)}
                                            className="link-title-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            className="link-url-input"
                                        />
                                        <div className="link-action-buttons">
                                            <button
                                                className="link-confirm-btn"
                                                onClick={handleLinkConfirm}
                                                title="Confirm"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="link-cancel-btn"
                                                onClick={handleLinkCancel}
                                                title="Cancel"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {editingLinkIndex !== null && (
                                    <div className="link-input-card">
                                        <input
                                            type="text"
                                            placeholder="Link title"
                                            value={linkTitle}
                                            onChange={(e) => setLinkTitle(e.target.value)}
                                            className="link-title-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            className="link-url-input"
                                        />
                                        <div className="link-action-buttons">
                                            <button
                                                className="link-confirm-btn"
                                                onClick={handleLinkConfirm}
                                                title="Confirm"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="link-cancel-btn"
                                                onClick={handleLinkCancel}
                                                title="Cancel"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="session-action-buttons" style={{ marginTop: '40px' }}>
                            <button className="update-session-btn" onClick={handleUpdateSession}>
                                Update Session
                            </button>
                            <button className="delete-session-btn" onClick={handleDeleteSession}>
                                Delete Session
                            </button>
                        </div>
                    </div>)
                }
            </div>
        </>
    );
}
