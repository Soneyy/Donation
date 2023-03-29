const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Donation = require("../models/donation.js");
const moneyDonated = require("../models/MoneyDonate.js");
const Opportunity = require("../models/opportunity.js");
const Upload = require("../middleware/uploads.js");
const Banner = require("../models/banner.js");
router.get("/admin/dashboard", middleware.ensureAdminLoggedIn, async (req, res) => {
    const numAdmins = await User.countDocuments({role: "admin"});
    const numDonors = await User.countDocuments({role: "donor"});
    const numAgents = await User.countDocuments({role: "agent"});
    const numPendingDonations = await Donation.countDocuments({status: "pending"});
    const numAcceptedDonations = await Donation.countDocuments({status: "accepted"});
    const numAssignedDonations = await Donation.countDocuments({status: "assigned"});
    const numCollectedDonations = await Donation.countDocuments({status: "collected"});
    const numMoneyDonated = await moneyDonated.countDocuments({status: "pending"});
    res.render("admin/dashboard", {
        title: "Dashboard",
        numAdmins,
        numDonors,
        numAgents,
        numPendingDonations,
        numAcceptedDonations,
        numAssignedDonations,
        numCollectedDonations,
        numMoneyDonated,
    });
});

router.get("/admin/donations/pending", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const pendingDonations = await Donation.find({status: ["pending", "accepted", "assigned"]}).populate("donor");
        res.render("admin/pendingDonations", {title: "Pending Donations", pendingDonations});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.get("/admin/donations/previous", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const previousDonations = await Donation.find({status: "collected"}).populate("donor");
        res.render("admin/previousDonations", {title: "Previous Donations", previousDonations});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.get("/admin/donation/view/:donationId", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const donationId = req.params.donationId;
        const donation = await Donation.findById(donationId).populate("donor").populate("agent");
        res.render("admin/donation", {title: "Donation details", donation});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.get("/admin/donation/accept/:donationId", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const donationId = req.params.donationId;
        await Donation.findByIdAndUpdate(donationId, {status: "accepted"});
        req.flash("success", "Donation accepted successfully");
        res.redirect(`/admin/donation/view/${donationId}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.get("/admin/donation/reject/:donationId", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const donationId = req.params.donationId;
        await Donation.findByIdAndUpdate(donationId, {status: "rejected"});
        req.flash("success", "Donation rejected successfully");
        res.redirect(`/admin/donation/view/${donationId}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.get("/admin/donation/assign/:donationId", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const donationId = req.params.donationId;
        const agents = await User.find({role: "agent"});
        const donation = await Donation.findById(donationId).populate("donor");
        res.render("admin/assignAgent", {title: "Assign agent", donation, agents});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.post("/admin/donation/assign/:donationId", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const donationId = req.params.donationId;
        const {agent, adminToAgentMsg} = req.body;
        await Donation.findByIdAndUpdate(donationId, {status: "assigned", agent, adminToAgentMsg});
        req.flash("success", "Agent assigned successfully");
        res.redirect(`/admin/donation/view/${donationId}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.get("/admin/agents", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const agents = await User.find({role: "agent"});
        res.render("admin/agents", {title: "List of agents", agents});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});
router.get("/admin/volunteer", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const volunteer = await User.find({role: "volunteer"});
        res.render("admin/volunteer", {title: "List of volunteer", volunteer});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});


router.get("/admin/profile", middleware.ensureAdminLoggedIn, (req, res) => {
    res.render("admin/profile", {title: "My profile"});
});

router.put("/admin/profile", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const id = req.user._id;
        const updateObj = req.body.admin;	// updateObj: {firstName, lastName, gender, address, phone}
        await User.findByIdAndUpdate(id, updateObj);

        req.flash("success", "Profile updated successfully");
        res.redirect("/admin/profile");
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }

});


/*
============================Money Donation============================
 */

router.get("/admin/money-donations", middleware.ensureAdminLoggedIn, async (req, res) => {
    try {
        const moneyDonateData = await moneyDonated.find({});
        res.render("admin/money-donation", {title: "Money Donations", moneyDonateData});
    } catch (err) {
        console.log(err);
        req.flash("error", "Some error occurred on the server.")
        res.redirect("back");
    }
});

router.post("/admin/money-donations", middleware.ensureAdminLoggedIn, async (req, res) => {
    let mId = req.body.criteria;
    if (req.body.accept == '') {
        await moneyDonated.findByIdAndUpdate(mId, {status: "accepted"});
    } else {
        await moneyDonated.findByIdAndUpdate(mId, {status: "rejected"});
    }
    const moneyDonateData = await moneyDonated.find({});
    res.render("admin/money-donation", {title: "Money Donations", moneyDonateData});

});

router.get("/admin/show-opportunity", middleware.ensureAdminLoggedIn, async (req, res) => {
    let opportunityData = await Opportunity.find({}).populate("volunteer");
    res.render("admin/show-opportunity", {title: "Opportunity Data", opportunityData});

});
router.get("/admin/opportunity-details/:aId", middleware.ensureAdminLoggedIn, async (req, res) => {
    let opportunityId = req.params.aId;
    let opportunityData = await Opportunity.findById(opportunityId).populate("volunteer");
    console.log(opportunityData);
    res.render("admin/opportunity-details", {title: "Opportunity Data", opportunityData});

});
router.post("/admin/opportunity-details/:aId", middleware.ensureAdminLoggedIn, async (req, res) => {
    let opportunityId = req.params.aId;
    if (req.body.accept == '') {
        await Opportunity.findByIdAndUpdate(opportunityId, {status: "accepted"});
    } else {
        await Opportunity.findByIdAndUpdate(opportunityId, {status: "rejected"});
    }
    let opportunityData = await Opportunity.findById(opportunityId).populate("volunteer");
    res.render("admin/opportunity-details", {title: "Opportunity Data", opportunityData});

});



/*
==================Start Banner Router===================
 */

let fileUpload = new Upload();
let fsObj = fileUpload.fileUpload("/banner");
router.get("/admin/show-banner", middleware.ensureAdminLoggedIn, async (req, res) => {
    let bannerData = await Banner.find({});
    res.render("admin/banner/show", {title: "Add show", bannerData});
});

router.get("/admin/add-banner", middleware.ensureAdminLoggedIn, async (req, res) => {
    res.render("admin/banner/create", {title: "Add Banner"});
});
router.post("/admin/add-banner", fsObj.single('image'), async (req, res) => {
    try {
        let imageName = "";
        if (req.file) {
            imageName = req.file.filename;
        }
        return await Banner.create({...req.body, image: imageName}).then((user) => {
            res.redirect("/admin/show-banner");
        }).catch((err) => {
            return res.json(err);
        });


    } catch (e) {
        return res.json(e);
    }
});

/*
==================End Banner Router===================
 */

module.exports = router;