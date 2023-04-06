const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});


const Banner = mongoose.model("banners", bannerSchema);
module.exports = Banner;