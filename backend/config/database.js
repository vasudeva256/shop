const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`mongodb database connected at ${con.connection.host}`);
    })
    .catch((error) =>
      console.error("MongoDB connection failed:", error.message)
    );
};
module.exports = connectDatabase;
