const mongoose = require("mongoose");


const WishlistSchema = new mongoose.Schema({
    userId: {type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});

module.exports = mongoose.model("Wishlist", WishlistSchema);