const mongoose = require("mongoose");
const XLSX = require("xlsx");
require("dotenv").config();

const Structure = require("./models/Structure");

const filePath =
    "../dataset/raw/indian_water_management_150_records_datascience_ready-2.xlsx";

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected!");

        // Read Excel file
        const workbook = XLSX.readFile(filePath);

        // Get first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert worksheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Found ${data.length} records in Excel file.`);

        // Remove existing records to avoid duplicates
        await Structure.deleteMany({});

        // Convert data into MongoDB format
        const formattedData = data.map((row) => ({
            record_id: row.record_id,
            system_name: row.system_name,
            system_type: row.system_type,
            state_or_region: row.state_or_region,

            location: {
                type: "Point",
                coordinates: [
                    Number(row.longitude),
                    Number(row.latitude),
                ],
            },

            coordinate_status: row.coordinate_status,
            ecological_region: row.ecological_region,
            annual_rainfall_mm: Number(row.annual_rainfall_mm_est),
            soil_type: row.soil_type,
            water_harvesting_principle: row.water_harvesting_principle,
            cultural_environmental_reason: row.cultural_environmental_reason,
            primary_purpose: row.primary_purpose,
            advantages: row.advantages,
            current_condition: row.current_condition,
            maintenance_model: row.maintenance_model,
            revival_efforts: row.revival_efforts,
            government_initiatives: row.government_initiatives,
            groundwater_recharge_potential: row.groundwater_recharge_potential,
            water_storage_type: row.water_storage_type,
            community_management: row.community_management,
            climate_resilience_score: Number(row.climate_resilience_score),
            sustainability_score: Number(row.sustainability_score),
            data_source_type: row.data_source_type,
            contributor: row.contributor,
            image_url: row.image_url,
            contextual_details: row.contextual_details,
            source_reference: row.source_reference,
        }));

        // Insert data into MongoDB
        await Structure.insertMany(formattedData);

        console.log("Data imported successfully!");
        console.log(`${formattedData.length} records inserted.`);

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Import failed:");
        console.error(error.message);
    }
}

importData();