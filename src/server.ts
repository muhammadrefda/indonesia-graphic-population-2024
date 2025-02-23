import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Konfigurasi EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("index", { title: "Grafik Populasi Indonesia 2024" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
