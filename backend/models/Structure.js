const mongoose = require("mongoose");

const structureSchema = new mongoose.Schema(
    {
        record_id: {
            type: String,
            required: true,
            unique: true,
        },

        system_name: {
            type: String,
            required: true,
        },

        system_type: {
            type: String,
            required: true,
        },

        state_or_region: {
            type: String,
            required: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

        coordinate_status: {
            type: String,
        },

        ecological_region: {
            type: String,
        },

        annual_rainfall_mm: {
            type: Number,
        },

        soil_type: {
            type: String,
        },

        water_harvesting_principle: {
            type: String,
        },

        cultural_environmental_reason: {
            type: String,
        },

        primary_purpose: {
            type: String,
        },

        advantages: {
            type: String,
        },

        current_condition: {
            type: String,
        },

        maintenance_model: {
            type: String,
        },

        revival_efforts: {
            type: String,
        },

        government_initiatives: {
            type: String,
        },

        groundwater_recharge_potential: {
            type: String,
        },

        water_storage_type: {
            type: String,
        },

        community_management: {
            type: String,
        },

        climate_resilience_score: {
            type: Number,
        },

        sustainability_score: {
            type: Number,
        },

        data_source_type: {
            type: String,
        },

        contributor: {
            type: String,
        },

        image_url: {
            type: String,
        },

        contextual_details: {
            type: String,
        },

        source_reference: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Allows MongoDB to perform geographic queries later
structureSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Structure", structureSchema);