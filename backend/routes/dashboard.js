const express = require("express")
const Budget = require("../models/budget")
const {auth} = require("../middleware/auth")
const handler = require("../utils/handler")
const {isValidMonth, monthRange, currentMonth} = require("../utils/month")
const buildSummary = require("../utils/budgetSummary")
const Expense = require("../models/expense")

const router = express.Router();
router.use(auth);

router.get (
    "/",
    handler(async(req, res) => {
        const month = req.query.month || currentMonth()
        if(!isValidMonth(month)) return res.status(400).json({message: "A valid month look like 2026-10"})
        
        const {start, end} = monthRange(month)
        const summary = await buildSummary(req.user._id, month)

        const expenses = await Expense.find({
            user: req.user._id,
            date: {$gte: start, $lt: end},
        })
        .populate("category", "name")
        .sort({date: -1 });

        let highExpense = null
        expenses.forEach((e) => {
            if (!highExpense || e.amount > highExpense.amount) 
                highExpense = e;
        });

        const total = {}
        expenses.forEach((e) =>{
            const name = e.category.name
            total[name] = (total[name] || 0) + e.amount;
        }) 

        const spending = Object.keys(total).map((name) => ({name, total: total[name]}));
        res.json({
            ...summary,
            highExpense,
            spending,
            recentExpenses: expenses.slice(0, 5),
        })
        })
)

module.exports = router;