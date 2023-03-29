const express = require("express");
const router = express.Router();
const MoneyDonate = require("../models/MoneyDonate.js");
const axios = require('axios');

router.get("/", (req, res) => {
    res.render("home/welcome");
});

router.get("/home/about-us", (req, res) => {
    res.render("home/aboutUs", {title: "About Us | Food Aid"});
});

router.get("/home/money-donate", (req, res) => {
    res.render("home/money-donate", {title: "Money donate"});
});

router.post("/home/money-donate", (req, res) => {
    let resData = req.body;
    let moneyDonate = new MoneyDonate(resData);
    moneyDonate.save();
    req.flash("success", "Thank you for your donation");
    let data = {
        "return_url": "https://example.com/payment/",
        "website_url": "https://example.com/",
        "amount": 1300,
        "purchase_order_id": "test12",
        "purchase_order_name": "test",
    }
    let headers = {
        "Authorization": "Key live_secret_key_292ff997b479476b9fa2fb39fa715244"
    }
    axios.post("https://khalti.com/api/v2/epayment/initiate/", data, {
        headers: headers
    }).then((response) => {
        console.log(response);
        res.redirect(response.data.payment_url)
    });
});

router.get("/home/mission", (req, res) => {
    res.render("home/mission", {title: "Our mission | Food Aid"});
});

router.get("/home/contact-us", (req, res) => {
    res.render("home/contactUs", {title: "Contact us | Food Aid"});
});


module.exports = router;