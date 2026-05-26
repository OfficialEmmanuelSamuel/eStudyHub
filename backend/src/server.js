// backend/src/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const subjectsRoutes = require("./routes/subjects");
const catalogRoutes = require("./routes/catalog");
const adminRoutes = require("./routes/admin");
const adminAuthRoutes = require("./routes/adminAuth");
const usersRoutes = require("./routes/users");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/subjects", subjectsRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
