const express = require("express");
const app = express();
const cors = require('cors');

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");
app.use(cors());
dotenv.config();

app.use(express.json())

mongoose
  .connect("mongodb://localhost:27017", { 
    useNewUrlParser: true ,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);


app.listen(8800, () => {
  console.log("Backend server is running!");
});