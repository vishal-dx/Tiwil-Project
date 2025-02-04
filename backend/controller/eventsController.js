const Event = require("../models/EventSchema");

// Fetch Events with Structured Response
const getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch and sort events by date
    const events = await Event.find({ userId }).sort({ date: 1 });

    // ✅ Structure the response
    const structuredEvents = {};

    events.forEach((event) => {
      // Convert single-value relations into an object
      if (["Father", "Mother", "Parent Anniversary", "Spouse", "Marriage Anniversary"].includes(event.relation)) {
        structuredEvents[event.relation] = {
          name: event.name,
          date: event.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          image: event.image || null,
          relation: event.relation, 
          isFavorite: false, // Initialize favorite status
        };
      } 
      // Convert multi-value relations into arrays
      else if (event.relation === "Child") {
        if (!structuredEvents["Children"]) {
          structuredEvents["Children"] = [];
        }
        structuredEvents["Children"].push({
          name: event.name,
          date: event.date.toISOString().split("T")[0],
          image: event.image || null,
          relation: event.relation, 
          isFavorite: false,
        });
      } 
      else if (event.relation === "Sibling") {
        if (!structuredEvents["Siblings"]) {
          structuredEvents["Siblings"] = [];
        }
        structuredEvents["Siblings"].push({
          name: event.name,
          date: event.date.toISOString().split("T")[0],
          image: event.image || null,
          relation: event.relation, 
          isFavorite: false,
        });
      }
    });

    res.status(200).json({ success: true, data: structuredEvents });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events." });
  }
};

module.exports = { getEvents };
