const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: "name is required field",
  },
  email: {
    type: String,
    required: "email is required field",
  },
});

module.exports = mongoose.model("Product", productSchema);
