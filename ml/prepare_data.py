import os
import pandas as pd
import numpy as np

from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


# ==================================================
# 1. File paths
# ==================================================

file_path = r"C:\Users\hp\OneDrive\Desktop\Mini Project\traditional-indian-water-management-analytics\dataset\raw\indian_water_management_150_records_datascience_ready-2.xlsx"

output_folder = "outputs"

os.makedirs(output_folder, exist_ok=True)


# ==================================================
# 2. Load dataset
# ==================================================

df = pd.read_excel(file_path)

print("Dataset loaded successfully!")
print(f"Number of records: {len(df)}")
print(f"Number of columns: {len(df.columns)}")


# ==================================================
# 3. Select environmental ML features
# ==================================================

feature_columns = [
    "annual_rainfall_mm_est",
    "latitude",
    "longitude"
]

print("\nML features:")

for feature in feature_columns:
    print("-", feature)


# ==================================================
# 4. Check missing values
# ==================================================

print("\nMissing values:")

print(
    df[feature_columns].isnull().sum()
)


# ==================================================
# 5. Prepare numerical data
# ==================================================

X = df[feature_columns].copy()

for column in feature_columns:

    X[column] = pd.to_numeric(
        X[column],
        errors="coerce"
    )


# Fill missing numerical values
# with the median

X = X.fillna(
    X.median()
)


# ==================================================
# 6. Standardize features
# ==================================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

print("\nPreprocessing completed successfully!")

print(
    f"ML matrix shape: {X_scaled.shape}"
)


# ==================================================
# 7. Test different K values
# ==================================================

print(
    "\nTesting different numbers of clusters..."
)

print("-" * 60)

results = []


for k in range(2, 9):

    model = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )

    labels = model.fit_predict(
        X_scaled
    )

    score = silhouette_score(
        X_scaled,
        labels
    )

    inertia = model.inertia_

    results.append(
        {
            "k": k,
            "inertia": inertia,
            "silhouette_score": score
        }
    )

    print(
        f"K = {k} | "
        f"Inertia = {inertia:.2f} | "
        f"Silhouette Score = {score:.4f}"
    )


# ==================================================
# 8. Save K evaluation results
# ==================================================

k_results_df = pd.DataFrame(
    results
)

k_results_path = os.path.join(
    output_folder,
    "k_evaluation_results.csv"
)

k_results_df.to_csv(
    k_results_path,
    index=False
)


# ==================================================
# 9. Select best K
# ==================================================

best_result = max(
    results,
    key=lambda item: item[
        "silhouette_score"
    ]
)

best_k = best_result["k"]

best_score = best_result[
    "silhouette_score"
]


print(
    "\nBest K based on silhouette score:",
    best_k
)

print(
    f"Best Silhouette Score: "
    f"{best_score:.4f}"
)


# ==================================================
# 10. Train final K-Means model
# ==================================================

final_model = KMeans(
    n_clusters=best_k,
    random_state=42,
    n_init=10
)

df["cluster"] = final_model.fit_predict(
    X_scaled
)


# ==================================================
# 11. Create readable cluster names
# ==================================================

cluster_names = {}


cluster_stats_temp = (
    df.groupby("cluster")
    .agg(
        average_rainfall=(
            "annual_rainfall_mm_est",
            "mean"
        ),

        average_latitude=(
            "latitude",
            "mean"
        ),

        average_longitude=(
            "longitude",
            "mean"
        )
    )
)


for cluster_id, row in (
    cluster_stats_temp.iterrows()
):

    rainfall = row[
        "average_rainfall"
    ]

    if rainfall < 500:

        climate_label = (
            "Low Rainfall"
        )

    elif rainfall < 1000:

        climate_label = (
            "Moderate Rainfall"
        )

    elif rainfall < 2000:

        climate_label = (
            "High Rainfall"
        )

    else:

        climate_label = (
            "Very High Rainfall"
        )

    cluster_names[
        cluster_id
    ] = (
        f"Cluster {cluster_id} - "
        f"{climate_label}"
    )


df["cluster_name"] = (
    df["cluster"].map(
        cluster_names
    )
)


# ==================================================
# 12. Cluster distribution
# ==================================================

print(
    "\nCluster distribution:"
)

print("-" * 60)

distribution = (
    df["cluster"]
    .value_counts()
    .sort_index()
)

print(distribution)


# ==================================================
# 13. Cluster summary
# ==================================================

cluster_summary = (
    df.groupby("cluster")
    .agg(

        structures=(
            "record_id",
            "count"
        ),

        average_rainfall=(
            "annual_rainfall_mm_est",
            "mean"
        ),

        min_rainfall=(
            "annual_rainfall_mm_est",
            "min"
        ),

        max_rainfall=(
            "annual_rainfall_mm_est",
            "max"
        ),

        average_latitude=(
            "latitude",
            "mean"
        ),

        average_longitude=(
            "longitude",
            "mean"
        )
    )
    .reset_index()
)


cluster_summary[
    "cluster_name"
] = (
    cluster_summary["cluster"]
    .map(cluster_names)
)


cluster_summary[
    "average_rainfall"
] = (
    cluster_summary[
        "average_rainfall"
    ].round(2)
)


cluster_summary[
    "min_rainfall"
] = (
    cluster_summary[
        "min_rainfall"
    ].round(2)
)


cluster_summary[
    "max_rainfall"
] = (
    cluster_summary[
        "max_rainfall"
    ].round(2)
)


cluster_summary[
    "average_latitude"
] = (
    cluster_summary[
        "average_latitude"
    ].round(4)
)


cluster_summary[
    "average_longitude"
] = (
    cluster_summary[
        "average_longitude"
    ].round(4)
)


print(
    "\nCluster summary:"
)

print("-" * 60)

print(
    cluster_summary[
        [
            "cluster",
            "cluster_name",
            "structures",
            "average_rainfall",
            "min_rainfall",
            "max_rainfall",
            "average_latitude",
            "average_longitude"
        ]
    ].to_string(index=False)
)


# ==================================================
# 14. Traditional system types by cluster
# ==================================================

print(
    "\nTraditional system types by cluster:"
)

print("-" * 60)


for cluster_id in sorted(
    df["cluster"].unique()
):

    print(
        f"\nCluster {cluster_id} "
        f"({cluster_names[cluster_id]}):"
    )

    type_counts = (
        df[
            df["cluster"] == cluster_id
        ]["system_type"]
        .value_counts()
    )

    print(type_counts)


# ==================================================
# 15. Ecological regions by cluster
# ==================================================

print(
    "\nEcological regions by cluster:"
)

print("-" * 60)


for cluster_id in sorted(
    df["cluster"].unique()
):

    print(
        f"\nCluster {cluster_id}:"
    )

    region_counts = (
        df[
            df["cluster"] == cluster_id
        ]["ecological_region"]
        .value_counts()
    )

    print(region_counts)


# ==================================================
# 16. Water storage types by cluster
# ==================================================

print(
    "\nWater storage types by cluster:"
)

print("-" * 60)


for cluster_id in sorted(
    df["cluster"].unique()
):

    print(
        f"\nCluster {cluster_id}:"
    )

    storage_counts = (
        df[
            df["cluster"] == cluster_id
        ]["water_storage_type"]
        .value_counts()
    )

    print(storage_counts)


# ==================================================
# 17. Groundwater recharge potential by cluster
# ==================================================

print(
    "\nGroundwater recharge potential by cluster:"
)

print("-" * 60)


for cluster_id in sorted(
    df["cluster"].unique()
):

    print(
        f"\nCluster {cluster_id}:"
    )

    recharge_counts = (
        df[
            df["cluster"] == cluster_id
        ]["groundwater_recharge_potential"]
        .value_counts()
    )

    print(recharge_counts)


# ==================================================
# 18. Save clustered Excel file
# ==================================================

clustered_excel_path = os.path.join(
    output_folder,
    "clustered_water_structures.xlsx"
)

df.to_excel(
    clustered_excel_path,
    index=False
)


# ==================================================
# 19. Save clustered CSV
# ==================================================

clustered_csv_path = os.path.join(
    output_folder,
    "clustered_structures.csv"
)

df.to_csv(
    clustered_csv_path,
    index=False
)


# ==================================================
# 20. Save cluster summary CSV
# ==================================================

cluster_summary_path = os.path.join(
    output_folder,
    "cluster_summary.csv"
)

cluster_summary.to_csv(
    cluster_summary_path,
    index=False
)


# ==================================================
# 21. Save ML metadata
# ==================================================

metadata = pd.DataFrame(
    [
        {
            "algorithm": "K-Means",

            "best_k": best_k,

            "silhouette_score": round(
                best_score,
                4
            ),

            "features_used": ", ".join(
                feature_columns
            ),

            "records": len(df)
        }
    ]
)


metadata_path = os.path.join(
    output_folder,
    "ml_metadata.csv"
)

metadata.to_csv(
    metadata_path,
    index=False
)


# ==================================================
# 22. Final output
# ==================================================

print(
    "\n" + "=" * 60
)

print(
    "ML clustering completed successfully!"
)

print(
    "=" * 60
)

print(
    "\nOutput files created:"
)

print(
    f"1. {clustered_excel_path}"
)

print(
    f"2. {clustered_csv_path}"
)

print(
    f"3. {cluster_summary_path}"
)

print(
    f"4. {k_results_path}"
)

print(
    f"5. {metadata_path}"
)

print(
    f"\nFinal K: {best_k}"
)

print(
    f"Final Silhouette Score: "
    f"{best_score:.4f}"
)