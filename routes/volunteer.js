const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Donation = require("../models/donation.js");
const Opportunity = require("../models/opportunity.js");

router.get("/volunteer/dashboard", middleware.ensureVolunteerLoggedIn, async (req, res) => {
    const agentId = req.user._id;
    const numAssignedDonations = await Donation.countDocuments({agent: agentId, status: "assigned"});
    const numCollectedDonations = await Donation.countDocuments({agent: agentId, status: "collected"});
    res.render("volunteer/dashboard", {
        title: "Dashboard",
        numAssignedDonations, numCollectedDonations
    });
});


router.get("/volunteer/profile", middleware.ensureVolunteerLoggedIn, (req, res) => {
    res.render("volunteer/profile", {title: "My Profile"});
});

router.put("/volunteer/profile", middleware.ensureVolunteerLoggedIn, async (req, res) => {
    try {
        const id = req.user._id;
        const updateObj = req.body.agent;
        await User.findByIdAndUpdate(id, updateObj);
        req.flash("success", "Profile updated successfully");
        res.redirect("/volunteer/profile");
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }

});


router.get("/volunteer/opportunity", middleware.ensureVolunteerLoggedIn, (req, res) => {
    res.render("volunteer/opportunity", {title: "opportunity"});
});

router.post("/volunteer/opportunity", middleware.ensureVolunteerLoggedIn, async (req, res) => {
    try {
        const opportunity = req.body;
        opportunity.volunteer = req.user._id;
        await Opportunity.create(opportunity);
        req.flash("success", "opportunity created successfully");
        res.redirect("/volunteer/opportunity");
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }

});
router.get("/volunteer/apply-opportunity", middleware.ensureVolunteerLoggedIn, async (req, res) => {
    let opportunities = await Opportunity.find({volunteer: req.user._id});
    console.log(opportunities)
    res.render("volunteer/applyList", {
        title: "Dashboard",
        opportunities
    });

});


module.exports = router;