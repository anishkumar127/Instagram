const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 4000;
const { MONGOURI } = require("./config/keys");
//require("dotenv").config();
mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // mongoose.connection.on("connected", () => {
    console.log("Database Connected.!");
  })
  // })
  .catch((err) => {
    // mongoose.connection.on("error", (err) => {
    console.log("Database Error.", err);
  });
// });

require("./models/post"); // no need to export
require("./models/user"); // no need export
app.use(express.json()); // pass to json data
app.use(require("./routes/auth")); // router middleware
app.use(require("./routes/post")); // router middleware
app.use(require("./routes/user")); // router middleware

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () =>
  console.log(`Server running at PORT ~ http://localhost:${PORT}`)
);
