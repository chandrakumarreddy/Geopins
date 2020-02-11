const mongoose = require("mongoose");

const PinsSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
    image: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    author: { type: mongoose.Schema.ObjectId, ref: "User" },
    comments: [
      {
        text: { type: String },
        createdAt: {
          type: Date,
          default: Date.now
        },
        author: { type: mongoose.Schema.ObjectId, ref: "User" }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pins", PinsSchema);
