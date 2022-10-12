const app = require("./app.js");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");

//handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log(`Shutting down servr due to uncaught exception 🤦‍♀️`);
  process.exit(1);
});
// mongoose
//   .connect(db, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//   })
//   .then(() => console.log("MongoDB connected..."))
//   .catch((err) => console.log(err));

//setting config file
dotenv.config({ path: "backend/config/config.env" });

//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started at ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log(`shutting down server due to unhandled promise rejection 🤦‍♂️`);
  server.close(() => {
    process.exit(1);
  });
});
