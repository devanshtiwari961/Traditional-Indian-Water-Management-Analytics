import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "leaflet/dist/leaflet.css";
import "./App.css";


// =========================
// HOME PAGE
// =========================

function Home() {
  return (
    <div className="page">
      <h2>Traditional Indian Water Management Analytics</h2>

      <p>
        This project studies traditional Indian water-management practices
        such as stepwells, tanks, ponds, johads, kunds and other indigenous
        water systems using data analytics, machine learning and GIS.
      </p>

      <br />

      <p>
        The goal is to identify sustainable patterns in traditional water
        management and present them through an interactive web application.
      </p>
    </div>
  );
}


// =========================
// EXPLORE PAGE
// =========================

function Explore() {
  const [structures, setStructures] = useState([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/structures")
      .then((response) => response.json())
      .then((data) => setStructures(data))
      .catch((error) => console.error(error));
  }, []);

  const states = [
    ...new Set(
      structures
        .map((item) => item.state_or_region)
        .filter(Boolean)
    ),
  ].sort();

  const types = [
    ...new Set(
      structures
        .map((item) => item.system_type)
        .filter(Boolean)
    ),
  ].sort();

  const filteredStructures = structures.filter((item) => {
    const matchesSearch =
      item.system_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.record_id
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesState =
      stateFilter === "" ||
      item.state_or_region === stateFilter;

    const matchesType =
      typeFilter === "" ||
      item.system_type === typeFilter;

    return matchesSearch && matchesState && matchesType;
  });

  return (
    <div className="page">
      <h2>Explore Water Management Structures</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Search structure..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            minWidth: "220px",
          }}
        />

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All States/Regions</option>

          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All Types</option>

          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="total-count">
        Showing {filteredStructures.length} of {structures.length} structures
      </div>

      <div className="structure-list">
        {filteredStructures.map((structure) => (
          <div
            className="structure-card"
            key={structure.record_id}
          >
            <h3>{structure.system_name}</h3>

            <p>
              <strong>ID:</strong> {structure.record_id}
            </p>

            <p>
              <strong>Type:</strong> {structure.system_type}
            </p>

            <p>
              <strong>State/Region:</strong>{" "}
              {structure.state_or_region}
            </p>

            <p>
              <strong>Water Principle:</strong>{" "}
              {structure.water_harvesting_principle || "Not available"}
            </p>

            <p>
              <strong>Purpose:</strong>{" "}
              {structure.primary_purpose || "Not available"}
            </p>

            <p>
              <strong>Condition:</strong>{" "}
              {structure.current_condition || "Not available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


// =========================
// MAP PAGE
// =========================

function MapPage() {
  const [structures, setStructures] = useState([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/map/structures")
      .then((response) => response.json())
      .then((data) => setStructures(data))
      .catch((error) => console.error(error));
  }, []);

  const states = [
    ...new Set(
      structures
        .map((item) => item.state_or_region)
        .filter(Boolean)
    ),
  ].sort();

  const types = [
    ...new Set(
      structures
        .map((item) => item.system_type)
        .filter(Boolean)
    ),
  ].sort();

  const filteredStructures = structures.filter((item) => {
    const matchesSearch =
      item.system_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.record_id
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesState =
      stateFilter === "" ||
      item.state_or_region === stateFilter;

    const matchesType =
      typeFilter === "" ||
      item.system_type === typeFilter;

    return matchesSearch && matchesState && matchesType;
  });

  return (
    <div className="page">
      <h2>Water Management Map</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "25px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search structure..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            minWidth: "220px",
          }}
        />

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All States/Regions</option>

          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All Types</option>

          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <p style={{ marginBottom: "15px" }}>
        Showing {filteredStructures.length} mapped structures.
      </p>

      <div
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[22.5, 78.9]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredStructures.map((structure) => {
            const coordinates = structure.location?.coordinates;

            if (
              !coordinates ||
              coordinates.length !== 2
            ) {
              return null;
            }

            const longitude = coordinates[0];
            const latitude = coordinates[1];

            if (
              typeof latitude !== "number" ||
              typeof longitude !== "number"
            ) {
              return null;
            }

            if (
              latitude < -90 ||
              latitude > 90 ||
              longitude < -180 ||
              longitude > 180
            ) {
              return null;
            }

            return (
              <Marker
                key={structure.record_id}
                position={[latitude, longitude]}
              >
                <Popup>
                  <strong>{structure.system_name}</strong>

                  <br />

                  Type: {structure.system_type}

                  <br />

                  State: {structure.state_or_region}

                  <br />

                  ID: {structure.record_id}

                  <br />

                  Coordinates: {latitude}, {longitude}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}


// =========================
// ANALYTICS PAGE
// =========================

function Analytics() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/structures")
      .then((response) => response.json())
      .then((data) => {
        setStructures(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Analytics Dashboard</h2>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  // =========================
  // BASIC COUNTS
  // =========================

  const typeCounts = {};

  structures.forEach((structure) => {
    const type = structure.system_type || "Unknown";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const typeData = Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
    }))
    .sort((a, b) => b.count - a.count);


  const stateCounts = {};

  structures.forEach((structure) => {
    const state = structure.state_or_region || "Unknown";

    stateCounts[state] =
      (stateCounts[state] || 0) + 1;
  });

  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({
      state,
      count,
    }))
    .sort((a, b) => b.count - a.count);


  // =========================
  // RAINFALL ANALYSIS
  // =========================

  const rainfallRanges = {
    "< 500 mm": 0,
    "500–1000 mm": 0,
    "1000–1500 mm": 0,
    "1500–2000 mm": 0,
    "> 2000 mm": 0,
  };

  structures.forEach((structure) => {
    const rainfall = Number(
      structure.annual_rainfall_mm
    );

    if (Number.isNaN(rainfall)) {
      return;
    }

    if (rainfall < 500) {
      rainfallRanges["< 500 mm"]++;
    } else if (rainfall < 1000) {
      rainfallRanges["500–1000 mm"]++;
    } else if (rainfall < 1500) {
      rainfallRanges["1000–1500 mm"]++;
    } else if (rainfall < 2000) {
      rainfallRanges["1500–2000 mm"]++;
    } else {
      rainfallRanges["> 2000 mm"]++;
    }
  });

  const rainfallData = Object.entries(
    rainfallRanges
  ).map(([range, count]) => ({
    range,
    count,
  }));


  // =========================
  // PURPOSE ANALYSIS
  // =========================

  const purposeCounts = {};

  structures.forEach((structure) => {
    const purpose =
      structure.primary_purpose || "Not available";

    purposeCounts[purpose] =
      (purposeCounts[purpose] || 0) + 1;
  });

  const purposeData = Object.entries(purposeCounts)
    .map(([purpose, count]) => ({
      purpose,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);


  // =========================
  // CONDITION ANALYSIS
  // =========================

  const conditionCounts = {};

  structures.forEach((structure) => {
    const condition =
      structure.current_condition || "Not available";

    conditionCounts[condition] =
      (conditionCounts[condition] || 0) + 1;
  });

  const conditionData = Object.entries(conditionCounts)
    .map(([condition, count]) => ({
      condition,
      count,
    }))
    .sort((a, b) => b.count - a.count);


  // =========================
  // COMMUNITY MANAGEMENT
  // =========================

  const communityCounts = {};

  structures.forEach((structure) => {
    const management =
      structure.community_management ||
      "Not available";

    communityCounts[management] =
      (communityCounts[management] || 0) + 1;
  });

  const communityData = Object.entries(
    communityCounts
  )
    .map(([management, count]) => ({
      management,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);


  // =========================
  // SUSTAINABILITY SCORE
  // =========================

  const sustainabilityRanges = {
    "0–20": 0,
    "21–40": 0,
    "41–60": 0,
    "61–80": 0,
    "81–100": 0,
  };

  const sustainabilityValues = [];

  structures.forEach((structure) => {
    const score = Number(
      structure.sustainability_score
    );

    if (Number.isNaN(score)) {
      return;
    }

    sustainabilityValues.push(score);

    if (score <= 20) {
      sustainabilityRanges["0–20"]++;
    } else if (score <= 40) {
      sustainabilityRanges["21–40"]++;
    } else if (score <= 60) {
      sustainabilityRanges["41–60"]++;
    } else if (score <= 80) {
      sustainabilityRanges["61–80"]++;
    } else {
      sustainabilityRanges["81–100"]++;
    }
  });

  const sustainabilityData = Object.entries(
    sustainabilityRanges
  ).map(([range, count]) => ({
    range,
    count,
  }));

  const averageSustainability =
    sustainabilityValues.length > 0
      ? sustainabilityValues.reduce(
        (sum, value) => sum + value,
        0
      ) / sustainabilityValues.length
      : 0;


  // =========================
  // CLIMATE RESILIENCE SCORE
  // =========================

  const resilienceRanges = {
    "0–20": 0,
    "21–40": 0,
    "41–60": 0,
    "61–80": 0,
    "81–100": 0,
  };

  const resilienceValues = [];

  structures.forEach((structure) => {
    const score = Number(
      structure.climate_resilience_score
    );

    if (Number.isNaN(score)) {
      return;
    }

    resilienceValues.push(score);

    if (score <= 20) {
      resilienceRanges["0–20"]++;
    } else if (score <= 40) {
      resilienceRanges["21–40"]++;
    } else if (score <= 60) {
      resilienceRanges["41–60"]++;
    } else if (score <= 80) {
      resilienceRanges["61–80"]++;
    } else {
      resilienceRanges["81–100"]++;
    }
  });

  const resilienceData = Object.entries(
    resilienceRanges
  ).map(([range, count]) => ({
    range,
    count,
  }));

  const averageResilience =
    resilienceValues.length > 0
      ? resilienceValues.reduce(
        (sum, value) => sum + value,
        0
      ) / resilienceValues.length
      : 0;


  // =========================
  // AVERAGE RAINFALL
  // =========================

  const rainfallValues = structures
    .map((structure) =>
      Number(structure.annual_rainfall_mm)
    )
    .filter((value) => !Number.isNaN(value));

  const averageRainfall =
    rainfallValues.length > 0
      ? rainfallValues.reduce(
        (sum, value) => sum + value,
        0
      ) / rainfallValues.length
      : 0;


  return (
    <div className="page">
      <h2>Analytics Dashboard</h2>

      <p>
        This dashboard provides exploratory analysis of
        traditional Indian water-management structures in the
        prototype dataset.
      </p>

      <div className="recommendation-note">
        <strong>Analytical note:</strong> The charts describe
        patterns present in the current prototype dataset.
        They should not be interpreted as definitive historical,
        hydrological or engineering conclusions.
      </div>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        <div className="analytics-card">
          <h3>Total Structures</h3>

          <p className="number">
            {structures.length}
          </p>
        </div>

        <div className="analytics-card">
          <h3>Structure Types</h3>

          <p className="number">
            {typeData.length}
          </p>
        </div>

        <div className="analytics-card">
          <h3>States/Regions</h3>

          <p className="number">
            {stateData.length}
          </p>
        </div>

        <div className="analytics-card">
          <h3>Avg. Rainfall</h3>

          <p className="number">
            {averageRainfall.toFixed(0)}
          </p>

          <p>mm/year</p>
        </div>

        <div className="analytics-card">
          <h3>Avg. Sustainability</h3>

          <p className="number">
            {averageSustainability.toFixed(1)}
          </p>

          <p>score</p>
        </div>

        <div className="analytics-card">
          <h3>Avg. Climate Resilience</h3>

          <p className="number">
            {averageResilience.toFixed(1)}
          </p>

          <p>score</p>
        </div>
      </div>


      {/* =========================
          ANALYSIS 1
      ========================= */}

      <div className="chart-container">
        <h3>1. Structures by Type</h3>

        <p style={{ marginBottom: "20px" }}>
          Distribution of traditional water-management
          structure types represented in the dataset.
        </p>

        <div style={{ width: "100%", height: "450px" }}>
          <ResponsiveContainer>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="type"
                angle={-20}
                textAnchor="end"
                height={100}
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 2
      ========================= */}

      <div className="chart-container">
        <h3>2. Structures by State/Region</h3>

        <p style={{ marginBottom: "20px" }}>
          Geographic distribution of records across states
          and regions represented in the prototype dataset.
        </p>

        <div style={{ width: "100%", height: "500px" }}>
          <ResponsiveContainer>
            <BarChart
              data={stateData}
              layout="vertical"
              margin={{
                left: 30,
                right: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="state"
                width={130}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 3
      ========================= */}

      <div className="chart-container">
        <h3>3. Annual Rainfall Range Distribution</h3>

        <p style={{ marginBottom: "20px" }}>
          Number of structures associated with different
          annual rainfall ranges.
        </p>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="range" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 4
      ========================= */}

      <div className="chart-container">
        <h3>4. Primary Purpose Distribution</h3>

        <p style={{ marginBottom: "20px" }}>
          Distribution of the main purposes associated with
          traditional water-management structures.
        </p>

        <div style={{ width: "100%", height: "500px" }}>
          <ResponsiveContainer>
            <BarChart
              data={purposeData}
              layout="vertical"
              margin={{
                left: 30,
                right: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="purpose"
                width={180}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 5
      ========================= */}

      <div className="chart-container">
        <h3>5. Current Condition Distribution</h3>

        <p style={{ marginBottom: "20px" }}>
          Exploratory view of the reported current condition
          of the traditional water structures.
        </p>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <BarChart data={conditionData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="condition"
                angle={-20}
                textAnchor="end"
                height={100}
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 6
      ========================= */}

      <div className="chart-container">
        <h3>6. Community Management Distribution</h3>

        <p style={{ marginBottom: "20px" }}>
          Distribution of community-management approaches
          recorded for the structures.
        </p>

        <div style={{ width: "100%", height: "500px" }}>
          <ResponsiveContainer>
            <BarChart
              data={communityData}
              layout="vertical"
              margin={{
                left: 30,
                right: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="management"
                width={180}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 7
      ========================= */}

      <div className="chart-container">
        <h3>7. Sustainability Score Distribution</h3>

        <p style={{ marginBottom: "20px" }}>
          Distribution of the sustainability scores currently
          present in the prototype dataset.
        </p>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <BarChart data={sustainabilityData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="range" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYSIS 8
      ========================= */}

      <div className="chart-container">
        <h3>8. Climate Resilience Score Distribution</h3>

        <p style={{ marginBottom: "20px" }}>
          Distribution of the climate-resilience scores
          currently available in the prototype dataset.
        </p>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <BarChart data={resilienceData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="range" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                name="Number of Structures"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =========================
          ANALYTICS SUMMARY
      ========================= */}

      <div
        className="selected-structure"
        style={{ marginTop: "40px" }}
      >
        <h3>Analytics Summary</h3>

        <p>
          <strong>Total records analyzed:</strong>{" "}
          {structures.length}
        </p>

        <p>
          <strong>Different structure types:</strong>{" "}
          {typeData.length}
        </p>

        <p>
          <strong>States/regions represented:</strong>{" "}
          {stateData.length}
        </p>

        <p>
          <strong>Average annual rainfall:</strong>{" "}
          {averageRainfall.toFixed(0)} mm/year
        </p>

        <p>
          <strong>Average sustainability score:</strong>{" "}
          {averageSustainability.toFixed(1)}
        </p>

        <p>
          <strong>Average climate resilience score:</strong>{" "}
          {averageResilience.toFixed(1)}
        </p>
      </div>
    </div>
  );
}


// =========================
// PATTERNS & CLUSTERS PAGE
// =========================

function Patterns() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/api/structures")
      .then((response) => response.json())
      .then((data) => {
        setStructures(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Patterns & Clusters</h2>
        <p>Loading machine learning cluster results...</p>
      </div>
    );
  }

  // Group structures by cluster
  const clusterGroups = {};

  structures.forEach((structure) => {
    if (
      structure.cluster === undefined ||
      structure.cluster === null
    ) {
      return;
    }

    const clusterId = Number(structure.cluster);

    if (!clusterGroups[clusterId]) {
      clusterGroups[clusterId] = [];
    }

    clusterGroups[clusterId].push(structure);
  });

  // Convert groups into summary objects
  const clusterSummaries = Object.entries(clusterGroups)
    .map(([clusterId, records]) => {
      const rainfallValues = records
        .map((record) =>
          Number(record.annual_rainfall_mm)
        )
        .filter((value) => !Number.isNaN(value));

      const averageRainfall =
        rainfallValues.length > 0
          ? rainfallValues.reduce(
            (sum, value) => sum + value,
            0
          ) / rainfallValues.length
          : 0;

      const typeCounts = {};

      records.forEach((record) => {
        const type =
          record.system_type || "Unknown";

        typeCounts[type] =
          (typeCounts[type] || 0) + 1;
      });

      const mainTypes = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({
          type,
          count,
        }));

      const regions = [
        ...new Set(
          records
            .map((record) => record.state_or_region)
            .filter(Boolean)
        ),
      ];

      const ecologicalRegions = [
        ...new Set(
          records
            .map((record) => record.ecological_region)
            .filter(Boolean)
        ),
      ];

      const clusterName =
        records[0]?.cluster_name ||
        getClusterName(averageRainfall);

      return {
        clusterId: Number(clusterId),
        clusterName,
        count: records.length,
        averageRainfall,
        mainTypes,
        regions,
        ecologicalRegions,
      };
    })
    .sort((a, b) => a.clusterId - b.clusterId);

  const filteredClusters =
    selectedCluster === "all"
      ? clusterSummaries
      : clusterSummaries.filter(
        (cluster) =>
          String(cluster.clusterId) ===
          selectedCluster
      );

  const totalClusteredStructures =
    clusterSummaries.reduce(
      (sum, cluster) => sum + cluster.count,
      0
    );

  const averageClusterRainfall =
    clusterSummaries.length > 0
      ? clusterSummaries.reduce(
        (sum, cluster) =>
          sum + cluster.averageRainfall,
        0
      ) / clusterSummaries.length
      : 0;

  return (
    <div className="page">
      <h2>Patterns & Clusters</h2>

      <p>
        Machine learning clustering groups structures with
        similar environmental and geographical characteristics.
        The current prototype uses rainfall, latitude and
        longitude as the main clustering features.
      </p>

      <div className="recommendation-note">
        <strong>Important:</strong> These clusters are analytical
        patterns from the current prototype dataset. They should
        not be interpreted as definitive historical classifications
        or engineering recommendations.
      </div>

      {/* SUMMARY CARDS */}

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Clusters</h3>

          <p className="number">
            {clusterSummaries.length}
          </p>
        </div>

        <div className="analytics-card">
          <h3>Clustered Structures</h3>

          <p className="number">
            {totalClusteredStructures}
          </p>
        </div>

        <div className="analytics-card">
          <h3>Average Cluster Rainfall</h3>

          <p className="number">
            {averageClusterRainfall.toFixed(0)}
          </p>

          <p>mm/year</p>
        </div>

        <div className="analytics-card">
          <h3>ML Method</h3>

          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#1f5f5b",
            }}
          >
            K-Means
          </p>
        </div>
      </div>

      {/* CLUSTER FILTER */}

      <div className="filter-container">
        <select
          className="filter-select"
          value={selectedCluster}
          onChange={(e) =>
            setSelectedCluster(e.target.value)
          }
        >
          <option value="all">
            Show All Clusters
          </option>

          {clusterSummaries.map((cluster) => (
            <option
              key={cluster.clusterId}
              value={String(cluster.clusterId)}
            >
              Cluster {cluster.clusterId} —{" "}
              {cluster.clusterName}
            </option>
          ))}
        </select>
      </div>

      {/* CLUSTER CARDS */}

      <div className="cluster-grid">
        {filteredClusters.map((cluster) => (
          <div
            className="cluster-card"
            key={cluster.clusterId}
          >
            <h3>
              Cluster {cluster.clusterId}
            </h3>

            <p>
              <strong>Cluster Name:</strong>{" "}
              {cluster.clusterName}
            </p>

            <p>
              <strong>Structures:</strong>{" "}
              {cluster.count}
            </p>

            <p>
              <strong>Average Rainfall:</strong>{" "}
              {cluster.averageRainfall.toFixed(0)} mm/year
            </p>

            <p>
              <strong>Main Structure Types:</strong>
            </p>

            <ul
              style={{
                marginLeft: "20px",
                marginBottom: "12px",
              }}
            >
              {cluster.mainTypes.map(
                (item) => (
                  <li key={item.type}>
                    {item.type} ({item.count})
                  </li>
                )
              )}
            </ul>

            <p>
              <strong>Regions Represented:</strong>
            </p>

            <p>
              {cluster.regions.length > 0
                ? cluster.regions.join(", ")
                : "Not available"}
            </p>

            <p>
              <strong>Ecological Regions:</strong>
            </p>

            <p>
              {cluster.ecologicalRegions.length > 0
                ? cluster.ecologicalRegions.join(", ")
                : "Not available"}
            </p>

            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#eef7f5",
                borderRadius: "8px",
              }}
            >
              <strong>Pattern Interpretation:</strong>

              <p
                style={{
                  marginTop: "7px",
                  marginBottom: "0",
                }}
              >
                {getClusterDescription(
                  cluster.clusterName,
                  cluster.averageRainfall,
                  cluster.mainTypes
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CLUSTER RAINFALL CHART */}

      {filteredClusters.length > 0 && (
        <div
          className="chart-container"
          style={{ marginTop: "40px" }}
        >
          <h3>
            Average Rainfall by Cluster
          </h3>

          <div
            style={{
              width: "100%",
              height: "400px",
            }}
          >
            <ResponsiveContainer>
              <BarChart
                data={filteredClusters.map(
                  (cluster) => ({
                    cluster:
                      `Cluster ${cluster.clusterId}`,
                    rainfall:
                      Number(
                        cluster.averageRainfall.toFixed(0)
                      ),
                  })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="cluster" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="rainfall"
                  name="Average Rainfall (mm/year)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}


// =========================
// CLUSTER NAME HELPER
// =========================

function getClusterName(averageRainfall) {
  if (averageRainfall < 500) {
    return "Low Rainfall";
  }

  if (averageRainfall < 1000) {
    return "Moderate Rainfall";
  }

  if (averageRainfall < 2000) {
    return "High Rainfall";
  }

  return "Very High Rainfall";
}


// =========================
// CLUSTER DESCRIPTION HELPER
// =========================

function getClusterDescription(
  clusterName,
  averageRainfall,
  mainTypes
) {
  const typeNames = mainTypes
    .slice(0, 3)
    .map((item) => item.type)
    .join(", ");

  if (clusterName === "Low Rainfall") {
    return `This cluster represents structures located in relatively low-rainfall environments. Common examples include ${typeNames || "traditional storage structures"}. The grouping suggests a geographical and rainfall-based pattern in the prototype dataset.`;
  }

  if (clusterName === "Moderate Rainfall") {
    return `This cluster represents structures associated with moderate rainfall conditions. Common examples include ${typeNames || "traditional water-management structures"}. The grouping highlights traditional practices found across moderate-rainfall regions.`;
  }

  if (clusterName === "High Rainfall") {
    return `This cluster represents structures associated with higher rainfall conditions. Common examples include ${typeNames || "traditional water-management structures"}. The grouping indicates a recurring environmental pattern within the dataset.`;
  }

  if (clusterName === "Very High Rainfall") {
    return `This cluster represents structures located in very high-rainfall environments. Common examples include ${typeNames || "traditional water-management structures"}. The grouping highlights traditional practices associated with humid environments.`;
  }

  return `This cluster has an average rainfall of approximately ${averageRainfall.toFixed(0)} mm/year and contains examples such as ${typeNames || "traditional water-management structures"}.`;
}


// =========================
// RECOMMENDATIONS PAGE
// =========================

function Recommendations() {
  const [structures, setStructures] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/structures")
      .then((response) => response.json())
      .then((data) => {
        setStructures(data);

        if (data.length > 0) {
          setSelectedId(data[0].record_id);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const selectedStructure = structures.find(
    (structure) =>
      structure.record_id === selectedId
  );

  useEffect(() => {
    if (!selectedStructure) {
      setRecommendations([]);
      return;
    }

    const selectedRainfall = Number(
      selectedStructure.annual_rainfall_mm
    );

    const selectedState =
      selectedStructure.state_or_region;

    const scored = structures
      .filter(
        (structure) =>
          structure.record_id !== selectedStructure.record_id
      )
      .map((structure) => {
        const rainfall = Number(
          structure.annual_rainfall_mm
        );

        let score = 0;

        if (
          !Number.isNaN(selectedRainfall) &&
          !Number.isNaN(rainfall)
        ) {
          const difference = Math.abs(
            selectedRainfall - rainfall
          );

          score += Math.max(
            0,
            100 - difference / 20
          );
        }

        if (
          structure.state_or_region === selectedState
        ) {
          score += 20;
        }

        if (
          structure.system_type ===
          selectedStructure.system_type
        ) {
          score += 20;
        }

        return {
          ...structure,
          similarityScore: Math.min(
            100,
            Math.round(score)
          ),
        };
      })
      .sort(
        (a, b) =>
          b.similarityScore -
          a.similarityScore
      )
      .slice(0, 3);

    setRecommendations(scored);
  }, [selectedStructure, structures]);

  return (
    <div className="page">
      <h2>Recommendations</h2>

      <p>
        The recommendation engine identifies historical
        water-management practices that may be relevant to
        structures with similar environmental characteristics.
      </p>

      <div className="recommendation-section">
        <h3>Select a Structure</h3>

        <select
          className="structure-select"
          value={selectedId}
          onChange={(e) =>
            setSelectedId(e.target.value)
          }
        >
          {structures.map((structure) => (
            <option
              key={structure.record_id}
              value={structure.record_id}
            >
              {structure.system_name} —{" "}
              {structure.system_type}
            </option>
          ))}
        </select>
      </div>

      {selectedStructure && (
        <div className="selected-structure">
          <h3>Selected Structure</h3>

          <p>
            <strong>Name:</strong>{" "}
            {selectedStructure.system_name}
          </p>

          <p>
            <strong>Type:</strong>{" "}
            {selectedStructure.system_type}
          </p>

          <p>
            <strong>State/Region:</strong>{" "}
            {selectedStructure.state_or_region}
          </p>

          <p>
            <strong>Annual Rainfall:</strong>{" "}
            {selectedStructure.annual_rainfall_mm ||
              "Not available"}{" "}
            mm
          </p>
        </div>
      )}

      <div className="recommendation-section">
        <h3>Similar Historical Cases</h3>

        <div className="recommendation-grid">
          {recommendations.map(
            (recommendation) => (
              <div
                className="recommendation-card"
                key={recommendation.record_id}
              >
                <h4>
                  {recommendation.system_name}
                </h4>

                <p>
                  <strong>Similarity:</strong>{" "}
                  {recommendation.similarityScore}%
                </p>

                <p>
                  <strong>Type:</strong>{" "}
                  {recommendation.system_type}
                </p>

                <p>
                  <strong>State/Region:</strong>{" "}
                  {recommendation.state_or_region}
                </p>

                <p>
                  <strong>Rainfall:</strong>{" "}
                  {recommendation.annual_rainfall_mm ||
                    "Not available"}{" "}
                  mm
                </p>

                <p>
                  <strong>Water Principle:</strong>{" "}
                  {recommendation.water_harvesting_principle ||
                    "Not available"}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="recommendation-note">
        <strong>Note:</strong> Recommendations are historical
        comparisons based on similarity in the prototype dataset.
        They are not engineering approvals or construction
        instructions.
      </div>
    </div>
  );
}


// =========================
// ABOUT PAGE
// =========================

function About() {
  return (
    <div className="page">
      <h2>About the Project</h2>

      <p>
        Traditional Indian Water Management Analytics combines
        historical water-management knowledge with modern
        data analytics, machine learning and GIS technologies.
      </p>

      <br />

      <p>
        The project aims to study sustainable patterns in
        traditional Indian water-management practices and
        present them through an interactive web application.
      </p>
    </div>
  );
}


// =========================
// MAIN APP
// =========================

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <header className="header">
          <h1>
            Traditional Indian Water Management Analytics
          </h1>

          <p>
            Data Analytics • Machine Learning • GIS • MERN
          </p>
        </header>

        <nav className="navbar">
          <Link to="/">Home</Link>

          <Link to="/explore">
            Explore
          </Link>

          <Link to="/map">
            Map
          </Link>

          <Link to="/analytics">
            Analytics
          </Link>

          <Link to="/patterns">
            Patterns
          </Link>

          <Link to="/recommendations">
            Recommendations
          </Link>

          <Link to="/about">
            About
          </Link>
        </nav>

        <main>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/explore"
              element={<Explore />}
            />

            <Route
              path="/map"
              element={<MapPage />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/patterns"
              element={<Patterns />}
            />

            <Route
              path="/recommendations"
              element={<Recommendations />}
            />

            <Route
              path="/about"
              element={<About />}
            />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;