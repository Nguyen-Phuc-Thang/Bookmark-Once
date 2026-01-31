import { useEffect, useRef, useState } from "react";
import '../css/pages/Home.css';
import '../global/global.css';
import SessionCard from "../components/SessionCard";
import Drawer from "../components/Drawer";
import AddLinkOverlay from "../components/AddLinkOverlay";
import DeleteLinkOverlay from "../components/DeleteLinkOverlay";
import DeleteSessionOverlay from "../components/DeleteSessionOverlay";
import { getAllLinks, deleteLink, type Link } from "../database/linksRepo";
import { getAllSessions, deleteSession } from "../database/sessionRepo";

export default function Home() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [isDeletingLink, setIsDeletingLink] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState<{ id: string; title: string } | null>(null);
    const [isDeletingSession, setIsDeletingSession] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<{ id: string; title: string } | null>(null);
    const [links, setLinks] = useState<Link[]>([]);
    const [sessions, setSessions] = useState<Array<{ id: string; title: string; endsAt: Date | string; links: Link[] }>>([]);
    const reopenTimeoutRef = useRef<number | null>(null);
    const [drawerMode, setDrawerMode] = useState<"ADD_SESSION" | "VIEW_SESSIONS">("VIEW_SESSIONS");
    const [currentSession, setCurrentSession] = useState<{ id: string; title: string; endsAt: Date | string; links: Link[] } | undefined>(undefined);


    const DRAWER_REOPEN_DELAY = 350; // matches drawer transition duration

    const openDrawer = () => {
        // If already open, briefly close to play the exit animation then reopen
        if (isDrawerOpen) {
            closeDrawer();

            if (reopenTimeoutRef.current) {
                clearTimeout(reopenTimeoutRef.current);
            }

            reopenTimeoutRef.current = window.setTimeout(() => {
                setIsDrawerOpen(true);
                reopenTimeoutRef.current = null;
            }, DRAWER_REOPEN_DELAY);

            return;
        }

        setIsDrawerOpen(true);
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    }

    const openAddLinkOverlay = () => {
        setIsAddingLink(true);
    };

    const closeAddLinkOverlay = () => {
        setIsAddingLink(false);
    };

    const openDeleteOverlay = (link: { id: string; title: string }) => {
        setLinkToDelete(link);
        setIsDeletingLink(true);
    };

    const closeDeleteOverlay = () => {
        setIsDeletingLink(false);
        setLinkToDelete(null);
    };

    useEffect(() => {
        return () => {
            if (reopenTimeoutRef.current) {
                clearTimeout(reopenTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        getAllLinks().then((fetchedLinks: any) => setLinks(fetchedLinks));
        getAllSessions().then((fetchedSessions: any) => setSessions(fetchedSessions));
    }, []);

    const refresh = () => {
        getAllLinks().then((fetchedLinks: any) => setLinks(fetchedLinks));
        getAllSessions().then((fetchedSessions: any) => setSessions(fetchedSessions));
    };

    const confirmDeleteLink = async () => {
        if (!linkToDelete) return;
        await deleteLink(linkToDelete.id);
        closeDeleteOverlay();
        refresh();
    };

    const openDeleteSessionOverlay = (sessionTitle: string) => {
        if (currentSession) {
            setSessionToDelete({ id: currentSession.id, title: sessionTitle });
            setIsDeletingSession(true);
        }
    };

    const closeDeleteSessionOverlay = () => {
        setIsDeletingSession(false);
        setSessionToDelete(null);
    };

    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return;
        await deleteSession(sessionToDelete.id);
        closeDeleteSessionOverlay();
        closeDrawer();
        refresh();
    };

    return (
        <div className="home-page">
            <h1 className="page-title">Bookmark Once</h1>

            <section className="bookmark-session">
                <h3>Bookmark sessions</h3>
                <div className="session-wrapper">
                    {
                        sessions.map((session, index) => (
                            <SessionCard
                                key={index}
                                sessionName={session.title}
                                remainingTime={session.endsAt}
                                links={session.links}
                                onClick={() => {
                                    setCurrentSession(session);
                                    setDrawerMode("VIEW_SESSIONS");
                                    openDrawer();
                                }}
                                onTimeOut={() => {
                                    deleteSession(session.id).then(() => refresh());
                                }}
                            />
                        ))
                    }
                    <div
                        className="add-session-card"
                        onClick={() => {
                            setDrawerMode("ADD_SESSION");
                            openDrawer();
                        }}
                    >
                        <span className="plus-icon">+</span>
                    </div>
                </div>

            </section>

            <section className="links-section">
                <h3>Links</h3>
                <div className="links-wrapper">
                    {
                        links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-item"
                            >
                                {link.title}
                                <span
                                    className="delete-icon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openDeleteOverlay({ id: link.id, title: link.title });
                                    }}
                                >
                                    ×
                                </span>
                            </a>
                        ))
                    }
                    <div
                        className="add-link-card"
                        onClick={openAddLinkOverlay}
                    >
                        <span className="plus-icon">+</span>
                    </div>
                </div>
            </section>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                mode={drawerMode}
                onSessionAdd={refresh}
                onSessionUpdate={refresh}
                onSessionDelete={refresh}
                currentSession={currentSession}
                onDeleteSessionClick={openDeleteSessionOverlay}
            />
            <AddLinkOverlay
                isOpen={isAddingLink}
                onClose={closeAddLinkOverlay}
                onSubmit={refresh}
            />
            <DeleteLinkOverlay
                isOpen={isDeletingLink}
                linkTitle={linkToDelete?.title}
                onCancel={closeDeleteOverlay}
                onDelete={confirmDeleteLink}
            />
            <DeleteSessionOverlay
                isOpen={isDeletingSession}
                sessionTitle={sessionToDelete?.title}
                onCancel={closeDeleteSessionOverlay}
                onDelete={confirmDeleteSession}
            />
        </div>
    );
}