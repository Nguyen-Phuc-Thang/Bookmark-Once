let dbPromise: Promise<IDBDatabase> | null = null;

const DB_NAME = "bookmark-once-db";
const DB_VERSION = 3;

export function getDB(): Promise<IDBDatabase> {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                const db = request.result;

                if (!db.objectStoreNames.contains("links")) {
                    db.createObjectStore("links", { keyPath: "id" });
                }

                if (!db.objectStoreNames.contains("sessions")) {
                    db.createObjectStore("sessions", { keyPath: "id" });
                }
            };


            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    return dbPromise;
}
