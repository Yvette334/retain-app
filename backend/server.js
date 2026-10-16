const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/budget", require("./routes/budget"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.json({ message: "Retain App is running" });
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to mongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT || 5000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection failed", err));
