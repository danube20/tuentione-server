require("dotenv/config")

require("./db")

const express = require("express")

const app = express()

require("./config")(app)

const allRoutes = require("./routes/index.routes")
app.use("/api", allRoutes)

require("./error-handling")(app)

app.all('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

module.exports = app
