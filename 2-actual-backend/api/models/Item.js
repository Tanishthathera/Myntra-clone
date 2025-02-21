const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  image: String,
  company: String,
  item_name: String,
  original_price: Number,
  current_price: Number,
  discount_percentage: Number,
  return_period: Number,
  delivery_date: String,
  rating: {
    stars: Number,
    count: Number,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
