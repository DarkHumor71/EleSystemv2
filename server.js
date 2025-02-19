const express = require("express");
const connectDB = require("./config/db");
const app = express();
//Connect Database
connectDB();
app.get("/", (req, res) => res.send("Hello World!"));

//Init Middleware
app.use(express.json({ extended: false })); // to use req.body

//Define Routes
app.use("/api/users", require("./routes/API/users"));
app.use("/api/auth", require("./routes/API/auth"));
app.use("/api/building", require("./routes/API/building"));
app.use("/api/apartment", require("./routes/API/apartment"));
app.use("/api/expense", require("./routes/API/expense"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
