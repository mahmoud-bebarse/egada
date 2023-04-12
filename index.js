// importing the dependencies
require('dotenv').config()
var path = require("path");
var createError = require("http-errors");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// register routes
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

// defining the Express app
const app = express();

// db connection
require('./models');

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// adding morgan to log HTTP requests
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// path for images
app.get("/file/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, `./public/uploads/${req.params.filename}`));
});

// not-found route
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, './views', '404.html'))
});

// starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});