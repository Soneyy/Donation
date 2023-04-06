const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    area_of_interest:
        {
            type: String,
        },
    skills: {
        type: String,
    },
    experience: {
        type: String,
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "rejected", "accepted"],
        default: "pending"
    },
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);
module.exports = Opportunity;