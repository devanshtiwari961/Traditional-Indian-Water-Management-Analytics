const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
require("dotenv").config();

const Structure = require("./models/Structure");


// =========================
// ML CLUSTER FILE
// =========================

const mlFilePath = path.join(
    __dirname,
    "..",
    "ml",
    "outputs",
    "clustered_structures.csv"
);


console.log("Reading ML clustering results...");

const workbook = XLSX.readFile(mlFilePath);

const sheetName = workbook.SheetNames[0];

const worksheet = workbook.Sheets[sheetName];

const clusterData = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${clusterData.length} clustered records.`);


// =========================
// CHECK DATA
// =========================

const firstRecord = clusterData[0];

if (!firstRecord) {
    console.log("No clustering records found.");
    process.exit(1);
}


const requiredColumns = [
    "record_id",
    "cluster",
    "cluster_name",
];


for (const column of requiredColumns) {
    if (!(column in firstRecord)) {
        console.log(`Missing required column: ${column}`);
        process.exit(1);
    }
}


console.log("Required ML columns found successfully.");


// =========================
// CONNECT TO MONGODB
// =========================

console.log("\nConnecting to MongoDB...");


mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {

        console.log("MongoDB connected successfully!");


        // =========================
        // PREPARE UPDATES
        // =========================

        const operations = [];


        for (const record of clusterData) {

            const recordId = String(record.record_id).trim();

            const cluster = Number(record.cluster);

            const clusterName = String(
                record.cluster_name
            ).trim();


            if (
                !recordId ||
                Number.isNaN(cluster) ||
                !clusterName
            ) {
                console.log(
                    "Skipping invalid record:",
                    record
                );

                continue;
            }


            operations.push({
                updateOne: {
                    filter: {
                        record_id: recordId,
                    },

                    update: {
                        $set: {
                            cluster: cluster,
                            cluster_name: clusterName,
                        },
                    },
                },
            });
        }


        console.log(
            `\nPrepared ${operations.length} MongoDB updates.`
        );


        if (operations.length === 0) {

            console.log("No valid updates found.");

            await mongoose.disconnect();

            process.exit(1);
        }


        // =========================
        // UPDATE MONGODB
        // =========================

        console.log("\nUpdating MongoDB records...");


        const result =
            await Structure.bulkWrite(operations);


        console.log(
            "\nMongoDB update completed successfully!"
        );

        console.log(
            "Matched records:",
            result.matchedCount
        );

        console.log(
            "Modified records:",
            result.modifiedCount
        );


        // =========================
        // VERIFY CLUSTERS
        // =========================

        const clusteredCount =
            await Structure.countDocuments({
                cluster: {
                    $exists: true,
                },
            });


        console.log("\nVerification:");

        console.log(
            `Records containing ML clusters: ${clusteredCount}`
        );


        // =========================
        // CLUSTER DISTRIBUTION
        // =========================

        const clusterDistribution =
            await Structure.aggregate([
                {
                    $match: {
                        cluster: {
                            $exists: true,
                        },
                    },
                },

                {
                    $group: {
                        _id: "$cluster",
                        count: {
                            $sum: 1,
                        },
                    },
                },

                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);


        console.log(
            "\nCluster distribution in MongoDB:"
        );


        for (const item of clusterDistribution) {

            console.log(
                `Cluster ${item._id}: ${item.count} records`
            );
        }


        // =========================
        // CLOSE CONNECTION
        // =========================

        await mongoose.disconnect();


        console.log(
            "\nMongoDB connection closed."
        );

        console.log(
            "ML clusters are now stored in MongoDB!"
        );

    })


    // =========================
    // ERROR HANDLING
    // =========================

    .catch(async (error) => {

        console.log(
            "\nMongoDB update failed!"
        );

        console.log(error.message);


        try {

            await mongoose.disconnect();

        } catch (disconnectError) {

            console.log(
                "Error while closing MongoDB connection."
            );
        }
    });