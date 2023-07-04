// importing the dependencies
require("dotenv").config();
const path = require("path");
const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const _Image = require("./models/image");
// register routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const patientRouter = require("./routes/patient");
const doctorRouter = require("./routes/doctor");
const lookupRouter = require("./routes/lookup");
const reservationRouter = require("./routes/reservation");
const imageRouter = require("./routes/image");
const questionsRouter = require("./routes/questions");

const upload = require("express-fileupload");
// defining the Express app
const app = express();

// db connection
require("./models");

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// view engine setup
/**
 * comment out the following lines if you don't want to use a view engine
 */
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// adding morgan to log HTTP requests
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/reservation", reservationRouter);
app.use("/lookup", lookupRouter);
app.use("/image", imageRouter);
app.use("/questions", questionsRouter);

// path for images
// app.get("/file/:filename", (req, res) => {
//   res.sendFile(path.join(__dirname, `./public/uploads/${req.params.filename}`));
// });

const upld = upload("file");
app.post("/file", upld, async (req, res) => {
  if (req.files) {
    var file = req.files.file;
    var fileName = file.name;
    const image = new _Image({ fileName: fileName });
    await image.save();
    file.mv(path.join( "./public/uploads/" + fileName), (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send(image);
      }
    });
  }
});

app.use("/file/:filename", (req, res) => {
  res.sendFile(path.join(`./public/uploads/${req.params.filename}`));
});

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

// not-found route
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "./views", "404.html"));
});



// starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
