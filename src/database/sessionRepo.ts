import { getDB } from "./db";
import type { Link } from "./linksRepo";

interface Session {
    id: string;
    title: string;
    endsAt: Date | string;
    links: Link[];
}


export async function getAllSessions(): Promise<Session[]> {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readonly");
        const store = tx.objectStore("sessions");
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}

export async function addSession(session: Session): Promise<Session> {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readwrite");
        const store = tx.objectStore("sessions");

        const request = store.add(session);

        request.onsuccess = () => resolve(session);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteSession(id: string): Promise<void> {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readwrite");
        const store = tx.objectStore("sessions");
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    }
    );
}
export async function updateSession(session: Session) {
    const db = await getDB();

    return new Promise<Session>((resolve, reject) => {
        const tx = db.transaction("sessions", "readwrite");
        const store = tx.objectStore("sessions");
        const request = store.put(session);
        request.onsuccess = () => resolve(session);
        request.onerror = () => reject(request.error);
    }
    );
}