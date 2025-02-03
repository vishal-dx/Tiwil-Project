const Profile = require("../models/Profile");

const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await Profile.findOne({ userId }, "parentAnniversary marriageAnniversary siblings children");

        if (!profile) {
            return res.status(404).json({ success: false, message: "No events found." });
        }

        const events = [];

        if (profile.parentAnniversary) events.push(profile.parentAnniversary);
        if (profile.marriageAnniversary) events.push(profile.marriageAnniversary);
        profile.siblings.forEach(sibling => events.push({ _id: sibling._id, date: sibling.dob }));
        profile.children.forEach(child => events.push({ _id: child._id, date: child.dob }));

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Failed to fetch events." });
    }
};
module.exports = getUserEvents