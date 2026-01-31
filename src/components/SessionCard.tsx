import { useState, useEffect } from "react";
import { deleteSession } from "../database/sessionRepo";

import '../css/components/SessionCard.css';
import '../global/global.css';

interface SessionCardProps {
    sessionName: string;
    remainingTime: string | Date;
    links: Array<{ title: string; url: string }>;
    onClick: () => void;
    onTimeOut: () => void;
}

export default function SessionCard(props: SessionCardProps) {
    const [displayTime, setDisplayTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            if (props.remainingTime === "PERMANENT") {
                setDisplayTime("PERMANENT");
                return;
            }

            const endTime = new Date(props.remainingTime);
            const currentTime = new Date();
            const diffMs = endTime.getTime() - currentTime.getTime();

            if (diffMs <= 0) {
                props.onTimeOut();
                return;
            }

            const totalSeconds = Math.floor(diffMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            setDisplayTime(formattedTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [props.remainingTime]);

    return (
        <div className="session-card" onClick={props.onClick}>
            <p>{props.sessionName}</p>
            <div className="divider"></div>
            <p>{displayTime}</p>
            {
                props.links.map((link, index) => (
                    <div key={index} className="session-link">
                        <p>{link.title}</p>
                    </div>
                ))
            }
        </div>
    );
}
