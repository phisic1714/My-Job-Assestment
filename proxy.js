const express = require("express");
const cors = require("cors");

// ถ้า Node <18 และต้องใช้ fetch
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());
app.options("*", cors());

app.post("/api", async (req, res) => {
    try {
        const gsheetAPI = "https://script.google.com/macros/s/AKfycby7ue3tM6hbHFEYvjObcFVx3GfId0zdwJZDMQeJwd_nYonII8_3LZCeOmdgF19Wedn46Q/exec";

        // Node >=18 มี fetch ในตัว
        const response = await fetch(gsheetAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error proxying request");
    }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
