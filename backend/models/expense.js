const mongoose = require("mongoose");
const category = require("./category");

const PAY = ["Cash", "Mobile money", "Card"];

const expenseSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number, 
        required: true,
        min: [0.1]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    payMethod: {
        type: String,
        enum: Pay,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        default: ""
    },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Expense", expenseSchema);
module.exports.payMethod = payMethod;