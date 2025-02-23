import sqlite3 from "sqlite3";
import * as xlsx from "xlsx";
import path from "path";
import fs from "fs";

const DB_PATH: string = path.join(__dirname, "../database.sqlite");

const filePath: string = path.join(__dirname, "../jumlah-penduduk-indonesia-di-38-provinsi-(juni-2024).xlsx");

if (!fs.existsSync(filePath)) {
    console.error("File Excel tidak ditemukan!");
    process.exit(1);
}

const workbook = xlsx.readFile(filePath);
const sheetName: string = workbook.SheetNames[0];
const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

async function initDB(): Promise<sqlite3.Database> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error("gagal membuka database:", err.message);
                reject(err);
            } else {
                console.log("Terhubung ke database SQLite.");
                resolve(db);
            }
        });
    });
}

const runQuery = (db: sqlite3.Database, query: string, params: any[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

async function importData() {
    const db = await initDB();

    try {
        await runQuery(
            db,
            `CREATE TABLE IF NOT EXISTS population (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                province TEXT NOT NULL,
                population INTEGER NOT NULL
            )`
        );
        console.log("Tabel `population` siap digunakan.");

        await runQuery(db, `DROP TABLE IF EXISTS population`);
        console.log("Tabel lama dihapus.");

        await runQuery(
            db,
            `CREATE TABLE population (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        province TEXT NOT NULL,
        population INTEGER NOT NULL
    )`
        );
        console.log("Tabel `population` dibuat ulang.");

        const stmt = db.prepare(`INSERT INTO population (province, population) VALUES (?, ?)`);

        for (const row of data) {
            const province: string = row["Nama Data"];
            let rawValue: string = row["Nilai"].toString().trim();

            let population: number;

            if (rawValue.includes("Juta")) {
                rawValue = rawValue.replace(" Juta", "").replace(",", ".");
                population = Math.round(parseFloat(rawValue) * 1_000_000);
            } else {
                rawValue = rawValue.replace(".", "");
                population = parseInt(rawValue, 10);
            }

            if (province && population) {
                await new Promise<void>((resolve, reject) => {
                    stmt.run(province, population, (err: Error | null) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }
        }

        stmt.finalize(() => {
            console.log("Data berhasil diimport ke SQLite!");
            db.close();
        });
    } catch (error) {
        console.error("Gagal mengimpor data:", error);
        db.close();
    }
}

importData().catch(console.error);
