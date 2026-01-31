import { getDB } from "./db";

export interface Link {
    id: string;
    title: string;
    url: string;
}

export async function getAllLinks() {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("links", "readonly");
        const store = tx.objectStore("links");
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

    })
}
export async function addLink(link: Link) {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("links", "readwrite");
        const store = tx.objectStore("links");

        const request = store.add(link);

        request.onsuccess = () => resolve(link);
        request.onerror = () => reject(request.error);
    });
}
export async function deleteLink(id: string) {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("links", "readwrite");
        const store = tx.objectStore("links");
        const request = store.delete(id);

        request.onsuccess = () => resolve(undefined);
        request.onerror = () => reject(request.error);
    }
    );
}

