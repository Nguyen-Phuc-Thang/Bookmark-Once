import { useState } from "react";
import '../css/components/HelpButton.css';

interface HelpButtonProps {
    onClick?: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={`help-button${isHovered ? " hovered" : ""}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title="Help"
            aria-label="Help"
        >
            <span className="help-icon">?</span>
        </button>
    );
}
