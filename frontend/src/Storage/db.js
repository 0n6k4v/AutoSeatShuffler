import { openDB } from 'idb';

export async function getDB() {
    return openDB('seat-db', 2, { // เปลี่ยนจาก 1 เป็น 2
        upgrade(db) {
            if (!db.objectStoreNames.contains('seats')) {
                db.createObjectStore('seats', { keyPath: 'id' });
                console.log('Created seats store');
            }
            if (!db.objectStoreNames.contains('history')) {
                db.createObjectStore('history', { keyPath: 'time' });
                console.log('Created history store');
            }
        },
    });
}

export async function saveSeat(seat) {
    const db = await getDB();
    await db.put('seats', seat);
}

export async function getAllSeats() {
    const db = await getDB();
    return await db.getAll('seats');
}

export async function clearSeats() {
    const db = await getDB();
    await db.clear('seats');
}

export async function saveHistory(item) {
    const db = await getDB();
    await db.put('history', item);
    console.log('Saved history:', item); // Log ทุกครั้งที่บันทึก
}

export async function getAllHistory() {
    const db = await getDB();
    return await db.getAll('history');
}

export async function clearHistory() {
    const db = await getDB();
    await db.clear('history');
}