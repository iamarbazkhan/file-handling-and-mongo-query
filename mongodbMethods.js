const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const Product = require("./model/products.js");
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT2;

//DB connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected "))
  .catch((error) => console.log(`error is ${error}`));

app.get("/users", async (req, res) => {
  const { skip, limit, selectionKey, searchValue } = req.query;
  const allProducts = await Product.find({
    name: { $regex: searchValue || "", $options: "$i" },
    email: { $regex: searchValue || "", $options: "$i" },
  })
    .select(`${selectionKey ||""}`)
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    responseData: allProducts,
  });
});

app.listen(3001, () => {
  console.log(`Running on port ${PORT}`);
});
