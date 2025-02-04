const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    relation: {
      type: String,
      enum: ["Father", "Mother", "Parent Anniversary", "Spouse", "Marriage Anniversary", "Child", "Sibling", "Other"],
      required: true,
    },
    isRecurring: { type: Boolean, default: false }, // Recurring event (e.g., birthday, anniversary)
    image: { type: String }, // Optional image path
  },
  { timestamps: true }
);

// ✅ Virtual field to dynamically calculate `daysLeft`
eventSchema.virtual("daysLeft").get(function () {
  const today = new Date();
  const eventDate = new Date(this.date);
  const diffTime = eventDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
});

// ✅ Ensure `daysLeft` is included in JSON responses
eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
