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

app.use((req, res) =>{
  res.status(404).json({message: "No route found"})
})

app.use((err, req, res, next) => {
  if(err.name === "ValidationError"){
    const message = Object.values(err.errors).map((e) => e.message).join(",");
    return res.status(400).json({ message });
  }
  if(err.name === "CastError") return res.status(400).json({message: "Invalid value or id"})
  if(err.code === 11000) return res.status(400).json({message: "This value already exist"})
    console.error(err)
  res.status(500).json({message: "Server has some issue"})
})

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
