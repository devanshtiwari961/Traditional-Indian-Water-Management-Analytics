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
            attribution='&copy; OpenStreetMap contributors'
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

  // -------------------------
  // Structures by Type
  // -------------------------

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


  // -------------------------
  // Structures by State
  // -------------------------

  const stateCounts = {};

  structures.forEach((structure) => {
    const state =
      structure.state_or_region || "Unknown";

    stateCounts[state] =
      (stateCounts[state] || 0) + 1;
  });

  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({
      state,
      count,
    }))
    .sort((a, b) => b.count - a.count);


  // -------------------------
  // Rainfall Distribution
  // -------------------------

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


  // -------------------------
  // Average Rainfall
  // -------------------------

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
        This dashboard summarizes the traditional Indian
        water-management structures available in the dataset.
      </p>


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
        <div
          style={{
            padding: "25px",
            background: "#f8faf9",
            border: "1px solid #dce7e5",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>Total Structures</h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f5f5b",
            }}
          >
            {structures.length}
          </p>
        </div>


        <div
          style={{
            padding: "25px",
            background: "#f8faf9",
            border: "1px solid #dce7e5",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>Structure Types</h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f5f5b",
            }}
          >
            {typeData.length}
          </p>
        </div>


        <div
          style={{
            padding: "25px",
            background: "#f8faf9",
            border: "1px solid #dce7e5",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>States/Regions</h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f5f5b",
            }}
          >
            {stateData.length}
          </p>
        </div>


        <div
          style={{
            padding: "25px",
            background: "#f8faf9",
            border: "1px solid #dce7e5",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>Avg. Rainfall</h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f5f5b",
            }}
          >
            {averageRainfall.toFixed(0)}
          </p>

          <p>mm/year</p>
        </div>
      </div>


      {/* =========================
          CHART 1
      ========================= */}

      <div style={{ marginBottom: "50px" }}>
        <h3
          style={{
            color: "#1f5f5b",
            marginBottom: "20px",
          }}
        >
          Structures by Type
        </h3>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="type"
                angle={-20}
                textAnchor="end"
                height={80}
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
          CHART 2
      ========================= */}

      <div style={{ marginBottom: "50px" }}>
        <h3
          style={{
            color: "#1f5f5b",
            marginBottom: "20px",
          }}
        >
          Structures by State/Region
        </h3>

        <div style={{ width: "100%", height: "450px" }}>
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
                width={120}
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
          CHART 3
      ========================= */}

      <div>
        <h3
          style={{
            color: "#1f5f5b",
            marginBottom: "20px",
          }}
        >
          Annual Rainfall Range Distribution
        </h3>

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
    </div>
  );
}


// =========================
// PATTERNS PAGE
// =========================

function Patterns() {
  return (
    <div className="page">
      <h2>Patterns & Clusters</h2>

      <p>
        Machine learning based clustering will be added here.
      </p>
    </div>
  );
}


// =========================
// RECOMMENDATIONS PAGE
// =========================

function Recommendations() {
  return (
    <div className="page">
      <h2>Recommendations</h2>

      <p>
        The recommendation engine will identify traditional
        water-management practices that may be suitable for
        similar environmental conditions.
      </p>
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