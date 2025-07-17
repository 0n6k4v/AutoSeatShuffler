import { openDB } from 'idb';

const DB_NAME = 'seat-db';
const DB_VERSION = 2;
const SEATS_STORE = 'seats';
const HISTORY_STORE = 'history';

let dbPromise;

function initDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(SEATS_STORE)) {
                    db.createObjectStore(SEATS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(HISTORY_STORE)) {
                    db.createObjectStore(HISTORY_STORE, { keyPath: 'time' });
                }
            },
        });
    }
    return dbPromise;
}

export async function saveSeat(seat) {
    const db = await initDB();
    return db.put(SEATS_STORE, seat);
}

export async function getAllSeats() {
    const db = await initDB();
    return db.getAll(SEATS_STORE);
}

export async function clearSeats() {
    const db = await initDB();
    return db.clear(SEATS_STORE);
}

export async function saveHistory(item) {
    const db = await initDB();
    return db.put(HISTORY_STORE, item);
}

export async function getAllHistory() {
    const db = await initDB();
    return db.getAll(HISTORY_STORE);
}

export async function clearHistory() {
    const db = await initDB();
    return db.clear(HISTORY_STORE);
}