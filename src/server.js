var express = require("express");
var morgan = require("morgan");

// Express Route File Requires
const routes = require("./routers/index");
var cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// App routes
app.use("/api", routes);
app.use("/api", (req, res) => {
  res.sendStatus(404);
});

app.use((req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Error handler
app.use(function (err, req, res, next) {
  app.use((err, req, res, next) => {
    console.log("ERROR", err);
    res.status(500).send(err.message);
  });
});

//Starting the server
app.listen(8000, () => console.log("Listening in port 8000"));

module.exports = app;
