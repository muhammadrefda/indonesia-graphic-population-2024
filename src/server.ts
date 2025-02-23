import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const app = express();
const DEFAULT_PORT = 3001;
let port = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

const DB_PATH = path.resolve(__dirname, "../database.sqlite");

async function getDBConnection() {
    return open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
}

app.get("/api/population", async (req, res) => {
    try {
        const db = await getDBConnection();
        const rows = await db.all("SELECT province, population FROM population ORDER BY population DESC");
        res.json(rows);
    } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
        res.status(500).json({ error: "Gagal mengambil data" });
    }
});

app.get("/", async (req, res) => {
    try {
        const db = await getDBConnection();
        const populationData = await db.all("SELECT province, population FROM population ORDER BY population DESC");

        const highestPop = populationData.slice(0, 3);
        const lowestPop = populationData.slice(-3);
        const totalPop = populationData.reduce((acc, curr) => acc + curr.population, 0);

        const summary = {
            highest: highestPop.map(p => `${p.province} (${p.population.toLocaleString()} jiwa)`).join(", "),
            lowest: lowestPop.map(p => `${p.province} (${p.population.toLocaleString()} jiwa)`).join(", "),
            total: totalPop.toLocaleString(),
            mainPoint: "Pulau Jawa masih menjadi pusat kepadatan penduduk di Indonesia, dengan jumlah penduduk terbanyak berasal dari provinsi Jawa Barat, Jawa Timur, dan Jawa Tengah."
        };

        res.render("index", { title: "Grafik Populasi Indonesia 2024", populationData, summary });
    } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
        res.status(500).send("Gagal memuat data");
    }
});

const startServer = (port: number) => {
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    server.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
            console.warn(`Port ${port} sudah digunakan. Mencoba port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error("Gagal menjalankan server:", err);
        }
    });
};

startServer(port);
