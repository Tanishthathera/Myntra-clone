const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// 1. Get Wishlist (Aapka logic)
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate("items");
    res.json(wishlist ? wishlist.items : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add/Remove Toggle (Zyada efficient tarika)
router.post("/toggle", async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [itemId] });
    } else {
      const index = wishlist.items.indexOf(itemId);
      if (index === -1) {
        wishlist.items.push(itemId); // Add agar nahi hai
      } else {
        wishlist.items.splice(index, 1); // Remove agar pehle se hai
      }
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;