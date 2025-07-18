import React, { useEffect, useState, useCallback } from "react";
import { getAllSeats, saveSeat, clearSeats, clearHistory } from "../Storage/db";
import { tableData, tableLabels, initialSeats } from "../Storage/EventSeatData";

const getInitialSeats = () =>
    tableData.map((t, idx) => ({
        id: t.id,
        label: tableLabels[idx],
        count: initialSeats[idx],
    }));

const mergeSeats = (data) =>
    tableData.map((t, idx) => {
        const found = data.find((d) => d.id === t.id);
        return {
            id: t.id,
            label: tableLabels[idx],
            count: found ? found.count : initialSeats[idx],
        };
    });

const AdminPage = () => {
    const [seats, setSeats] = useState([]);
    const [toast, setToast] = useState(null);

    // Load seats from IndexedDB
    useEffect(() => {
        let isMounted = true;
        getAllSeats().then((data) => {
            if (!isMounted) return;
            setSeats(data.length === 0 ? getInitialSeats() : mergeSeats(data));
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Input change handler
    const handleInputChange = useCallback((id, value) => {
        setSeats((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, count: Number(value) } : s
            )
        );
    }, []);

    // Save handler
    const handleSave = useCallback((id, count) => {
        saveSeat({ id, count: Number(count) }).then(() => {
            setToast("บันทึกข้อมูลสำเร็จ");
            setTimeout(() => setToast(null), 1200);
        });
    }, []);

    // Delete handler
    const handleDelete = useCallback((id) => {
        saveSeat({ id, count: 0 }).then(() => {
            setSeats((prev) =>
                prev.map((s) => (s.id === id ? { ...s, count: 0 } : s))
            );
            setToast("ลบข้อมูลสำเร็จ");
            setTimeout(() => setToast(null), 1200);
        });
    }, []);

    // Reset handler
    const handleReset = useCallback(() => {
        Promise.all([clearSeats(), clearHistory()]).then(() => {
            const initial = getInitialSeats();
            Promise.all(
                initial.map((seat) => saveSeat({ id: seat.id, count: seat.count }))
            ).then(() => {
                setSeats(initial);
                setToast("รีเซ็ตข้อมูลสำเร็จ");
                setTimeout(() => setToast(null), 1200);
            });
        });
    }, []);

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">จัดการข้อมูลโต๊ะและที่นั่ง</h2>
            {toast && (
                <div className="mb-4 px-4 py-2 bg-green-600 rounded text-center font-bold animate-pulse">
                    {toast}
                </div>
            )}
            <button
                type="button"
                className="admin-btn mb-4 px-4 py-2 bg-yellow-500 rounded font-bold"
                onClick={handleReset}
            >
                รีเซ็ตข้อมูลเริ่มต้น
            </button>
            <style>{`
                .admin-btn {
                    transition: transform 0.18s, box-shadow 0.18s;
                }
                .admin-btn:hover {
                    transform: scale(1.08);
                    box-shadow: 0 2px 12px 0 rgba(255,255,255,0.18), 0 0 0 4px rgba(255,255,255,0.08);
                    filter: brightness(1.1);
                }
            `}</style>
            <table className="w-full bg-gray-800 rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2">โต๊ะ</th>
                        <th className="py-2">จำนวนที่ว่าง</th>
                        <th className="py-2">แก้ไข</th>
                        <th className="py-2">ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {seats.map((seat) => (
                        <tr key={seat.id} className="border-b border-gray-700">
                            <td className="py-2 text-center font-bold">{seat.label}</td>
                            <td className="py-2 text-center">
                                <input
                                    type="number"
                                    min={0}
                                    max={20}
                                    value={seat.count}
                                    onChange={(e) =>
                                        handleInputChange(seat.id, e.target.value)
                                    }
                                    className="w-16 px-2 py-1 rounded bg-gray-700 text-white text-center"
                                    aria-label={`จำนวนที่ว่างสำหรับ ${seat.label}`}
                                />
                            </td>
                            <td className="py-2 text-center">
                                <button
                                    type="button"
                                    className="admin-btn px-3 py-1 bg-blue-500 rounded"
                                    onClick={() => handleSave(seat.id, seat.count)}
                                >
                                    บันทึก
                                </button>
                            </td>
                            <td className="py-2 text-center">
                                <button
                                    type="button"
                                    className="admin-btn px-3 py-1 bg-red-500 rounded"
                                    onClick={() => handleDelete(seat.id)}
                                >
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;