const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Structure = require("./models/Structure");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.send("Traditional Indian Water Management Analytics API is running!");
});

// ===============================
// GET ALL STRUCTURES
// WITH OPTIONAL FILTERS
// ===============================
// Examples:
// /api/structures
// /api/structures?state=Rajasthan
// /api/structures?type=Stepwell
// /api/structures?state=Rajasthan&type=Stepwell

app.get("/api/structures", async (req, res) => {
    try {
        const { state, type } = req.query;

        const filter = {};

        // Filter by state
        if (state) {
            filter.state_or_region = state;
        }

        // Filter by structure type
        if (type) {
            filter.system_type = type;
        }

        const structures = await Structure.find(filter);

        res.json(structures);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch structures",
            error: error.message,
        });
    }
});

// ===============================
// GET ONE STRUCTURE BY RECORD ID
// ===============================
// Example:
// /api/structures/IWMS001

app.get("/api/structures/:id", async (req, res) => {
    try {
        const structure = await Structure.findOne({
            record_id: req.params.id,
        });

        if (!structure) {
            return res.status(404).json({
                message: "Structure not found",
            });
        }

        res.json(structure);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch structure",
            error: error.message,
        });
    }
});

// ===============================
// GET STRUCTURES FOR MAP
// ===============================

app.get("/api/map/structures", async (req, res) => {
    try {
        const structures = await Structure.find(
            {},
            {
                record_id: 1,
                system_name: 1,
                system_type: 1,
                state_or_region: 1,
                location: 1,
            }
        );

        res.json(structures);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch map structures",
            error: error.message,
        });
    }
});

// ===============================
// SERVER + MONGODB CONNECTION
// ===============================

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    });